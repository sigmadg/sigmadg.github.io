#!/usr/bin/env bash
# Copia la plantilla actual a docs/ para GitHub Pages.
# Uso: ./scripts/sync-docs.sh   (desde la raíz del repo)
set -e
cd "$(dirname "$0")/.."
cp templates/index.html docs/index.html
echo "Hecho: templates/index.html → docs/index.html"
