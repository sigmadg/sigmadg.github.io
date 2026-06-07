"""
Puente HTTP para n8n: mismo pipeline que el monitor (POST /tick).
Métricas Prometheus en GET /metrics (proceso uvicorn).
"""

from __future__ import annotations

import sys
from pathlib import Path

from contextlib import asynccontextmanager

from fastapi import FastAPI, Query
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from prometheus_client import make_asgi_app
from starlette.concurrency import run_in_threadpool

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "modulo3_agente_telegram" / "src"))
sys.path.insert(0, str(ROOT / "modulo2_motor_alertas" / "src"))

from env_bootstrap import load_repo_dotenv, normalize_ollama_for_docker_container  # noqa: E402

load_repo_dotenv(ROOT)
normalize_ollama_for_docker_container()

from ops_logging import get_ops_logger  # noqa: E402
from pipeline_core import run_operational_tick  # noqa: E402

_LOG = get_ops_logger("n8n_bridge")


@asynccontextmanager
async def _lifespan(_app: FastAPI):
    from ops_prometheus import ensure_metrics_registered_for_scrape

    ensure_metrics_registered_for_scrape()
    yield


app = FastAPI(title="n8n bridge", version="1.0", lifespan=_lifespan)
app.mount("/metrics", make_asgi_app())


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/tick")
async def tick(
    dry_run: bool = Query(False),
    demo: bool = Query(False),
    validate: bool = Query(False),
    force_send: bool = Query(False),
) -> JSONResponse:
    """
    Ejecuta el pipeline en un hilo (no bloquea el event loop de uvicorn).
    Peticiones largas (Open-Meteo + LLM) + keep-alive corto del servidor causaban
    a veces «Empty reply from server» en clientes HTTP.
    """
    try:
        result = await run_in_threadpool(
            run_operational_tick,
            demo=demo,
            dry_run=dry_run,
            validate=validate,
            force_send=force_send,
        )
        try:
            from monitor_tick_log import record_pipeline_tick_for_dashboard

            record_pipeline_tick_for_dashboard(
                ROOT / "modulo2_motor_alertas",
                result,
                demo=demo,
                dry_run=dry_run,
                force_send=force_send,
                source="n8n_bridge",
            )
        except OSError:
            pass
        return JSONResponse(content=jsonable_encoder(result))
    except Exception as e:  # noqa: BLE001 — devolver JSON 500 en lugar de cortar TCP sin cuerpo
        _LOG.exception("POST /tick failed")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "detail": str(e)[:1200]},
        )
