# Forzar Actualización de GitHub Pages

## Métodos para forzar la actualización:

### 1. Commit vacío (ya aplicado)
Se ha creado un commit vacío que debería forzar la actualización.

### 2. Verificar en GitHub
1. Ve a: https://github.com/sigmadg/sigmadg.github.io/settings/pages
2. Verifica que la rama sea `master` y la carpeta `/ (root)`
3. Si hay un botón "Re-run deployment" o "Retry", úsalo

### 3. Limpiar caché del navegador
- **Chrome/Edge**: `Ctrl + Shift + Delete` → Limpiar caché
- **Firefox**: `Ctrl + Shift + Delete` → Limpiar caché
- **Safari**: `Cmd + Option + E`
- O usar modo incógnito/privado

### 4. Verificar el estado del despliegue
Ve a: https://github.com/sigmadg/sigmadg.github.io/actions
- Revisa si hay workflows ejecutándose
- Si hay errores, corrígelos

### 5. Esperar
GitHub Pages puede tardar hasta 10 minutos en actualizarse después de un push.

### 6. Verificar directamente
Abre: https://sigmadg.github.io/?v=$(date +%s)
El parámetro `?v=` fuerza la recarga sin caché.

