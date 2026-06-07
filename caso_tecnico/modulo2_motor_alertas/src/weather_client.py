"""
Cliente Open-Meteo (sin API key): precipitación horaria por coordenadas.

Resiliencia:
  - Reintentos con backoff ante timeout, errores de red y HTTP 429/5xx.
  - Tras **429** (rate limit Open-Meteo): espera extra, respeta ``Retry-When`` si existe,
    y variable ``WEATHER_429_MIN_SLEEP_SEC`` (default 4 s). Respeta ``Retry-After`` si la API lo envía.
  - Entre zonas: ``WEATHER_INTER_ZONE_DELAY_SEC`` (default 0,45 s) para no disparar
    decenas de GET seguidos (evita 429 al recorrer ~14 zonas).
  - Variables: ``WEATHER_HTTP_RETRIES`` (default 5), ``WEATHER_HTTP_TIMEOUT_SEC`` (30),
    ``WEATHER_HTTP_BACKOFF_SEC`` (0,7).

Errores:
  - Tras agotar reintentos se lanza ``WeatherAPIError`` (o se devuelve error en
    ``try_fetch_hourly_precipitation`` para degradar por zona sin tumbar todo el tick).
"""

from __future__ import annotations  # Tipos modernos sin comillas

import json  # Parsear cuerpo JSON de la API
import logging  # Nivel DEBUG para aciertos por zona (OPS_LOG_LEVEL=DEBUG)
import os  # Parámetros de reintentos y timeout desde entorno
import random  # Jitter en el backoff para evitar thundering herd
import time  # sleep entre reintentos
from dataclasses import dataclass  # Contenedor tipado para series horarias
from datetime import date  # Rango de fechas para API de archivo
from typing import Any, Dict, List, Optional, Tuple  # Payload y series

import requests  # Cliente HTTP

from ops_logging import get_ops_logger, log_structured  # Trazas + auditoría parseable

# URL pública de pronóstico (sin autenticación)
OPEN_METEO = "https://api.open-meteo.com/v1/forecast"
# URL de datos históricos / reanálisis
OPEN_METEO_ARCHIVE = "https://archive-api.open-meteo.com/v1/archive"

_LOG = get_ops_logger("weather")  # Logger del módulo (lazy tras import)

# Códigos HTTP donde tiene sentido reintentar (rate limit / origen caído)
_RETRYABLE_HTTP = {429, 500, 502, 503, 504}


class WeatherAPIError(RuntimeError):
    """Open-Meteo no entregó datos válidos tras reintentos."""


@dataclass
class HourlyPrecip:
    hours: List[str]  # Etiquetas de tiempo ISO devueltas por la API
    precipitation_mm: List[float]  # mm por hora, misma longitud que hours


def _env_int(name: str, default: int, *, min_v: int = 1, max_v: int = 120) -> int:
    raw = (os.environ.get(name) or "").strip()  # Variable ausente o vacía → default
    if not raw:
        return default
    try:
        v = int(raw)
        return max(min_v, min(max_v, v))  # Acotar a rango razonable
    except ValueError:
        return default


def _env_float(name: str, default: float, *, min_v: float = 0.1, max_v: float = 120.0) -> float:
    raw = (os.environ.get(name) or "").strip()
    if not raw:
        return default
    try:
        v = float(raw)
        return max(min_v, min(max_v, v))
    except ValueError:
        return default


def _request_json(
    url: str,
    params: Dict[str, Any],
    *,
    context: str,
) -> Dict[str, Any]:
    """
    GET con reintentos: 429/5xx esperan y reintentan; 4xx otros fallan sin reintento.
    Al agotar intentos → ``WeatherAPIError`` (llamador o ``try_fetch`` lo traduce).
    """
    retries = _env_int("WEATHER_HTTP_RETRIES", 5, min_v=1, max_v=12)  # Más intentos si hay 429
    timeout = _env_float("WEATHER_HTTP_TIMEOUT_SEC", 30.0, min_v=2.0, max_v=120.0)  # Por petición
    backoff = _env_float("WEATHER_HTTP_BACKOFF_SEC", 0.7, min_v=0.1, max_v=10.0)  # Base exponencial
    min_429 = _env_float("WEATHER_429_MIN_SLEEP_SEC", 4.0, min_v=0.5, max_v=120.0)  # Tras rate limit

    last_exc: Optional[BaseException] = None  # Para encadenar causa en el error final
    last_resp: Optional[requests.Response] = None  # Para Retry-After en 429
    last_status: Optional[int] = None

    for attempt in range(1, retries + 1):  # 1-indexado para logs legibles
        last_resp = None
        last_status = None
        try:
            r = requests.get(url, params=params, timeout=timeout)  # GET con query string
            last_resp = r
            sc = r.status_code  # Código HTTP
            last_status = sc
            if sc in _RETRYABLE_HTTP:
                last_exc = RuntimeError(f"HTTP {sc}")  # Se reintentará
                _LOG.warning(
                    "%s HTTP %s intento %s/%s",
                    context,
                    sc,
                    attempt,
                    retries,
                )
            elif sc >= 400:
                raise WeatherAPIError(
                    f"{context}: HTTP {sc} body={r.text[:400]!r}"
                )  # 4xx no recuperable (salvo los ya filtrados arriba)
            else:
                try:
                    return r.json()  # Cuerpo como dict
                except json.JSONDecodeError as e:
                    last_exc = e  # Tratar como transitorio y reintentar
                    _LOG.warning(
                        "%s JSON inválido intento %s/%s: %s",
                        context,
                        attempt,
                        retries,
                        e,
                    )
        except requests.Timeout as e:
            last_exc = e
            _LOG.warning(
                "%s timeout intento %s/%s (%ss)",
                context,
                attempt,
                retries,
                timeout,
            )
        except WeatherAPIError:
            raise  # No capturar: propagar error definitivo del cliente
        except requests.RequestException as e:
            last_exc = e  # DNS, conexión reset, etc.
            _LOG.warning(
                "%s error de red intento %s/%s: %s",
                context,
                attempt,
                retries,
                e,
            )

        if attempt < retries:
            # Backoff exponencial + jitter; 429 necesita pausas más largas (API pública).
            sleep_s = backoff * (2 ** (attempt - 1)) + random.uniform(0, 0.35)
            if last_status == 429 and last_resp is not None:
                sleep_s = max(sleep_s, min_429 * (1.5 ** (attempt - 1)))
                ra = last_resp.headers.get("Retry-After")
                if ra:
                    try:
                        sleep_s = max(sleep_s, float(ra))
                    except ValueError:
                        pass
                sleep_s = min(sleep_s, 90.0)  # tope para no bloquear el tick eternamente
            time.sleep(sleep_s)

    raise WeatherAPIError(f"{context}: falló tras {retries} intentos: {last_exc}") from last_exc


def _hourly_precip_from_forecast_payload(data: Dict[str, Any], *, context: str) -> HourlyPrecip:
    h = data.get("hourly")  # Bloque estándar Open-Meteo
    if not isinstance(h, dict):
        raise WeatherAPIError(f"{context}: respuesta sin bloque hourly")
    times = h.get("time") or []  # Lista de strings de tiempo
    precip = h.get("precipitation")  # mm por hora; puede faltar
    if precip is None:
        precip = []  # Normalizar a lista vacía
    if not isinstance(times, list):
        times = []
    if not isinstance(precip, list):
        precip = []
    out_mm = [float(x or 0) for x in precip]  # None → 0.0
    if not out_mm and times:
        _LOG.info("%s: hourly.precipitation vacío; se asume 0 mm", context)
        out_mm = [0.0] * len(times)  # Alinear longitud con times
    return HourlyPrecip(hours=[str(t) for t in times], precipitation_mm=out_mm)


def fetch_hourly_precipitation(
    latitude: float, longitude: float, forecast_days: int = 3
) -> HourlyPrecip:
    """
    Precipitación horaria en mm (intensidad por hora) — compatible con el dataset.
    Lanza ``WeatherAPIError`` si Open-Meteo no responde de forma usable.
    """
    params = {
        "latitude": latitude,  # Grados decimales
        "longitude": longitude,
        "hourly": "precipitation",  # Variable pedida a la API
        "forecast_days": forecast_days,  # Profundidad del pronóstico
        "timezone": "America/Monterrey",  # Alineado al caso operativo
    }
    ctx = f"forecast lat={latitude:.4f} lon={longitude:.4f}"  # Texto para logs y errores
    data = _request_json(OPEN_METEO, params, context=ctx)
    return _hourly_precip_from_forecast_payload(data, context=ctx)


def try_fetch_hourly_precipitation(
    latitude: float,
    longitude: float,
    *,
    forecast_days: int = 3,
    zone: Optional[str] = None,
) -> Tuple[List[float], Optional[str]]:
    """
    Igual que ``fetch_hourly_precipitation`` pero **no lanza**: devuelve
    ``(serie_mm, None)`` o ``([], mensaje)`` para degradar una zona sin abortar todo el pipeline.
    """
    ztag = f" zone={zone}" if zone else ""  # Sufijo opcional en logs
    try:
        hp = fetch_hourly_precipitation(latitude, longitude, forecast_days=forecast_days)
        log_structured(
            _LOG,
            "weather_fetch_ok",
            level=logging.DEBUG,
            zone=zone or "",
            latitude=round(latitude, 5),
            longitude=round(longitude, 5),
            n_hours=len(hp.precipitation_mm),
        )
        return hp.precipitation_mm, None  # Éxito: sin mensaje de error
    except WeatherAPIError as e:
        _LOG.error("Open-Meteo no disponible%s: %s", ztag, e)
        log_structured(
            _LOG,
            "weather_fetch_failed",
            level=logging.ERROR,
            zone=zone or "",
            latitude=round(latitude, 5),
            longitude=round(longitude, 5),
            error=str(e)[:800],
        )
        return [], str(e)  # Serie vacía + texto para el caller


def sleep_inter_zone_weather_delay() -> None:
    """
    Pausa breve entre llamadas Open-Meteo por zona (monitor / ``run_alert_engine``).
    Reduce ráfagas que disparan HTTP 429 en la API pública.
    """
    d = _env_float("WEATHER_INTER_ZONE_DELAY_SEC", 0.45, min_v=0.0, max_v=3.0)
    if d > 0:
        time.sleep(d)


def max_precip_in_window(series: HourlyPrecip, start_idx: int, window_h: int) -> float:
    end = min(len(series.precipitation_mm), start_idx + window_h)  # No pasar del final de la lista
    if start_idx >= end:
        return 0.0  # Ventana vacía
    return max(series.precipitation_mm[start_idx:end])  # Pico en las próximas window_h horas


def fetch_archive_hourly_precipitation(
    latitude: float,
    longitude: float,
    start_d: date,
    end_d: date,
    *,
    timezone: str = "America/Monterrey",
    timeout: int = 30,
) -> HourlyPrecip:
    """Precipitación horaria del archivo (reanálisis) con los mismos reintentos que forecast."""
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": start_d.isoformat(),  # API espera YYYY-MM-DD
        "end_date": end_d.isoformat(),
        "hourly": "precipitation",
        "timezone": timezone,
    }
    ctx = f"archive lat={latitude:.4f} lon={longitude:.4f} {start_d}..{end_d}"
    # timeout del requests lo toma _request_json desde env; el parámetro legacy se ignora en favor de env
    _ = timeout
    data = _request_json(OPEN_METEO_ARCHIVE, params, context=ctx)
    return _hourly_precip_from_forecast_payload(data, context=ctx)


def archive_daily_max_precip_mm_hr(
    latitude: float,
    longitude: float,
    day: date,
    *,
    timezone: str = "America/Monterrey",
) -> float:
    hp = fetch_archive_hourly_precipitation(
        latitude, longitude, day, day, timezone=timezone
    )  # Un solo día de archivo
    if not hp.precipitation_mm:
        return 0.0  # Sin datos → máximo 0
    return float(max(hp.precipitation_mm))  # Pico horario del día
