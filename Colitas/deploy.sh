#!/bin/bash

# Script para compilar y desplegar Colitas Abandonadas a GitHub Pages

echo "🚀 Iniciando despliegue de Colitas Abandonadas..."

# Ir al directorio de Colitas
cd "$(dirname "$0")"

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Compilar Nuxt
echo "🔨 Compilando Nuxt..."
npm run generate

# Verificar que la compilación fue exitosa
if [ ! -d ".output/public" ]; then
    echo "❌ Error: La compilación falló"
    exit 1
fi

echo "✅ Compilación exitosa"
echo "📝 Los archivos estáticos están en: .output/public/"
echo ""
echo "Para desplegar manualmente:"
echo "1. Copia los archivos de .output/public/ a la carpeta Colitas/ en la raíz del repositorio"
echo "2. Haz commit y push de los cambios"
echo ""
echo "O ejecuta:"
echo "  cp -r .output/public/* ../Colitas/"
echo "  cd .."
echo "  git add Colitas/"
echo "  git commit -m 'Deploy Colitas'"
echo "  git push"

