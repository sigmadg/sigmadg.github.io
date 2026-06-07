#!/usr/bin/env bash
# Levanta **todos** los servicios definidos en docker-compose.yml de la raíz:
#   - caso-tecnico: Django (front), monitor M3, bucle M2, puente POST /tick
#   - Prometheus + Grafana
#   - n8n (perfil n8n)
#
# El LLM (Ollama) no va en este compose: debe estar en el host u otro servicio
# (ver docker/README.md: OLLAMA_HOST=0.0.0.0 ollama serve).
#
# Uso desde la raíz del repo:
#   ./scripts/docker_full_stack.sh          # primer plano
#   ./scripts/docker_full_stack.sh -d       # segundo plano
# Puertos ocupados (p. ej. 8000): ver comentarios en docker-compose.yml y CASO_HOST_*.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

_caso_port_busy() {
  local p="$1"
  command -v ss >/dev/null 2>&1 && ss -tln 2>/dev/null | grep -qE ":${p}[[:space:]]"
}
if [ -z "${CASO_HOST_HTTP:-}" ] && _caso_port_busy 8000; then
  export CASO_HOST_HTTP=8001
  echo "[docker_full_stack] Puerto host 8000 ocupado → CASO_HOST_HTTP=8001" >&2
  echo "[docker_full_stack] NO uses http://127.0.0.1:8000/ para este proyecto (otro servicio). Panel Django:" >&2
  echo "[docker_full_stack]   → http://127.0.0.1:8001/" >&2
fi
docker compose rm -f caso-tecnico >/dev/null 2>&1 || true

if ! docker compose version >/dev/null 2>&1; then
  echo "[docker_full_stack] ERROR: hace falta Docker Compose v2." >&2
  exit 1
fi

H="${CASO_HOST_HTTP:-8001}"
B="${CASO_HOST_BRIDGE:-8090}"
M="${CASO_HOST_METRICS:-9108}"
P="${CASO_HOST_PROMETHEUS:-9090}"
G="${CASO_HOST_GRAFANA:-3000}"
N="${CASO_HOST_N8N:-15678}"

echo "[docker_full_stack] docker compose --profile n8n up --build $*"
echo "[docker_full_stack] Servicios: app + Prometheus + Grafana + n8n"
echo ""
echo "  Panel Django (HTML): http://127.0.0.1:${H}/"
echo "  Puente API (JSON):   http://127.0.0.1:${B}/tick  (POST; no es el panel)"
echo "  Métricas monitor:  http://127.0.0.1:${M}/metrics"
echo "  Prometheus:      http://127.0.0.1:${P}/"
echo "  Grafana:           http://127.0.0.1:${G}/  (admin/admin por defecto)"
echo "  n8n (UI):          http://127.0.0.1:${N}/"
echo ""
echo "  LLM (Ollama): fuera de Compose — en el host: OLLAMA_HOST=0.0.0.0 ollama serve"
echo "                La app usa OLLAMA_BASE_URL=http://host.docker.internal:11434"
echo ""

exec docker compose --profile n8n up --build "$@"
