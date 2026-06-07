#!/usr/bin/env bash
# Levanta solo el puente HTTP POST /tick (FastAPI) para n8n u otros clientes.
# Uso desde la raíz del repo: ./scripts/run_n8n_bridge.sh
#
# N8N_BRIDGE_HOST:
#   127.0.0.1 (defecto) — solo conexiones desde la misma máquina.
#   0.0.0.0 — necesario si n8n va en Docker (Linux) y llega vía host.docker.internal al puerto publicado.
#
# N8N_BRIDGE_PORT: por defecto 8090. Si está ocupado (p. ej. Docker publica :8090 en caso-tecnico),
#   sin definir N8N_BRIDGE_PORT se prueba 8091–8099 automáticamente.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

HOST="${N8N_BRIDGE_HOST:-127.0.0.1}"

_tcp_port_in_use() {
  local p="$1"
  command -v ss >/dev/null 2>&1 && ss -tln 2>/dev/null | grep -qE ":${p}[[:space:]]"
}

_pick_port() {
  local want="${N8N_BRIDGE_PORT:-}"
  if [ -n "$want" ]; then
    if _tcp_port_in_use "$want"; then
      echo "[n8n_bridge] ERROR: el puerto ${want} ya está en uso." >&2
      echo "  Suele ser el contenedor caso-tecnico (docker compose) u otra instancia del puente." >&2
      echo "  Ver: ss -tlnp | grep -E ':809[0-9]'" >&2
      echo "  Opciones: para el stack Docker, o: N8N_BRIDGE_PORT=8091 $0" >&2
      exit 1
    fi
    echo "$want"
    return
  fi
  if ! _tcp_port_in_use 8090; then
    echo "8090"
    return
  fi
  echo "[n8n_bridge] AVISO: el puerto 8090 está ocupado (¿Docker?). Buscando 8091–8099…" >&2
  local p
  for p in 8091 8092 8093 8094 8095 8096 8097 8098 8099; do
    if ! _tcp_port_in_use "$p"; then
      echo "[n8n_bridge] Usando puerto ${p}. Para fijarlo: export N8N_BRIDGE_PORT=${p}" >&2
      echo "$p"
      return
    fi
  done
  echo "[n8n_bridge] ERROR: no hay puerto libre en 8090–8099." >&2
  exit 1
}

PORT="$(_pick_port)"

export PYTHONPATH="${ROOT}/modulo3_agente_telegram/src:${ROOT}/modulo2_motor_alertas/src:${PYTHONPATH:-}"

echo "[n8n_bridge] uvicorn n8n_bridge.app:app --host ${HOST} --port ${PORT}"
echo "[n8n_bridge] Health: curl -sS 'http://127.0.0.1:${PORT}/health'"
echo "[n8n_bridge] Tick:  curl -sS -X POST 'http://127.0.0.1:${PORT}/tick?dry_run=true' | head -c 400"
# --timeout-keep-alive alto: POST /tick puede tardar minutos (clima + Ollama); el default 5s
# provoca cierre de conexión y «curl: (52) Empty reply from server» en algunos clientes.
exec python3 -m uvicorn n8n_bridge.app:app --host "${HOST}" --port "${PORT}" --timeout-keep-alive "${UVICORN_TIMEOUT_KEEP_ALIVE:-600}"
