#!/usr/bin/env bash
# Instala n8n globalmente para usar los workflows del portafolio.
# Requiere Node.js 20+ (https://nodejs.org)

set -e

echo "Comprobando Node.js..."
if ! command -v node &>/dev/null; then
  echo "Node.js no está instalado. Instálalo desde https://nodejs.org (versión 20 o 24)."
  exit 1
fi

VER=$(node -p "process.versions.node.split('.')[0]")
if [ "$VER" -lt 20 ]; then
  echo "Se recomienda Node.js 20 o superior. Tienes: $(node -v)"
  read -p "¿Continuar de todos modos? (s/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[sS]$ ]]; then
    exit 1
  fi
fi

echo "Instalando n8n globalmente..."
npm install -g n8n

echo ""
echo "Listo. Inicia n8n con:"
echo "  n8n start"
echo ""
echo "Luego abre http://localhost:5678 e importa los workflows desde"
echo "Menú (⋯) → Import from File (carpeta n8n-portfolio)."
echo "Guía completa: SETUP-N8N.md"
