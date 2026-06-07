"""Rutas al dataset y artefactos del caso (fuera de django_viz/)."""

import sys
from pathlib import Path

from django.conf import settings


def project_root() -> Path:
    return Path(settings.PROJECT_ROOT)


def data_xlsx() -> Path:
    # Misma lógica que ``modulo2_motor_alertas.src.zones.default_data_path`` (RAPPI_DATA_PATH / CASO_DATA_XLSX).
    _viz_dir = Path(__file__).resolve().parent
    _repo_root = _viz_dir.parent.parent
    _src = _repo_root / "modulo2_motor_alertas" / "src"
    if str(_src) not in sys.path:
        sys.path.insert(0, str(_src))
    from zones import default_data_path  # noqa: E402

    return default_data_path()


def calibration_json() -> Path:
    return project_root() / "modulo2_motor_alertas" / "calibration.json"


def figures_dir() -> Path:
    return project_root() / "modulo1_diagnostico" / "figures"


def modulo2_dir() -> Path:
    return project_root() / "modulo2_motor_alertas"


def monitor_status_json() -> Path:
    return modulo2_dir() / ".monitor_status.json"


def monitor_ticks_jsonl() -> Path:
    return modulo2_dir() / ".monitor_ticks.jsonl"


def alert_events_jsonl() -> Path:
    return modulo2_dir() / ".alert_events.jsonl"


def ops_audit_jsonl() -> Path:
    """Eventos granulares del motor / pipeline (debounce, decisiones, fallos clima)."""
    return modulo2_dir() / ".ops_audit.jsonl"
