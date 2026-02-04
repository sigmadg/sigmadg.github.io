#!/usr/bin/env bash
# Arranca la app para que quede en ejecución (producción).
# Uso: ./run.sh   o   bash run.sh
# Requiere: venv activado o gunicorn instalado

set -e
cd "$(dirname "$0")"

if [ -d ".venv" ]; then
  source .venv/bin/activate
fi

# Gunicorn: varios workers, escucha en todas las interfaces, timeout alto por las transcripciones
exec gunicorn \
  --bind "0.0.0.0:5000" \
  --workers 1 \
  --threads 4 \
  --timeout 300 \
  --access-logfile - \
  --error-logfile - \
  "app:app"
