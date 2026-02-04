# Verificar Configuración de GitHub Pages

## Pasos para verificar y solucionar problemas

### 1. Verificar configuración en GitHub
1. Ve a: https://github.com/sigmadg/sigmadg.github.io/settings/pages
2. Verifica que:
   - **Source**: Esté configurado como "Deploy from a branch"
   - **Branch**: Sea `master` (o `main` si es tu rama principal)
   - **Folder**: Sea `/ (root)`
3. Si hay un botón "Re-run deployment" o "Retry", haz clic en él

### 2. Verificar que los archivos estén en GitHub
1. Ve a: https://github.com/sigmadg/sigmadg.github.io/tree/master
2. Verifica que existan:
   - `index.html`
   - `assets/images/programming.png`
   - `assets/css/modern-enhancements.css`

### 3. Verificar el estado del despliegue
1. Ve a: https://github.com/sigmadg/sigmadg.github.io/actions
2. Busca workflows de "pages build and deployment"
3. Si hay errores, revísalos y corrígelos

### 4. Limpiar caché del navegador
**Chrome/Edge:**
- Presiona `Ctrl + Shift + Delete`
- Selecciona "Imágenes y archivos en caché"
- Período: "Todo el tiempo"
- Haz clic en "Borrar datos"

**Firefox:**
- Presiona `Ctrl + Shift + Delete`
- Selecciona "Caché"
- Período: "Todo"
- Haz clic en "Limpiar ahora"

**Safari:**
- Presiona `Cmd + Option + E` para limpiar caché

### 5. Probar en modo incógnito
1. Abre una ventana de incógnito/privado
2. Visita: https://sigmadg.github.io/
3. Si ves los cambios aquí pero no en modo normal, es un problema de caché

### 6. Verificar directamente el archivo en GitHub
1. Ve a: https://github.com/sigmadg/sigmadg.github.io/blob/master/index.html
2. Busca la línea con `programming.png`
3. Verifica que tenga `?v=2` al final

### 7. Forzar recarga con parámetro
Visita: https://sigmadg.github.io/?nocache=$(date +%s)

### 8. Verificar que GitHub Pages esté habilitado
1. Ve a: https://github.com/sigmadg/sigmadg.github.io/settings/pages
2. Si dice "Your site is ready to be published", haz clic en "Choose a theme" o configura la fuente
3. Si ya está publicado, verifica la URL: debería ser `https://sigmadg.github.io/`

### 9. Esperar tiempo suficiente
- GitHub Pages puede tardar hasta 10 minutos en actualizarse
- Después de hacer push, espera al menos 5 minutos antes de verificar

### 10. Verificar el archivo .nojekyll
El archivo `.nojekyll` debe existir en la raíz del repositorio para deshabilitar Jekyll.
Verifica que exista: https://github.com/sigmadg/sigmadg.github.io/blob/master/.nojekyll

## Si nada funciona

1. **Verifica la rama correcta**: Asegúrate de que GitHub Pages esté configurado para usar la rama `master`
2. **Revisa los logs de despliegue**: Ve a Actions y revisa si hay errores
3. **Contacta a GitHub Support**: Si el problema persiste, puede ser un problema del lado de GitHub

## Cambios recientes que deberían verse

- ✅ Imagen de perfil: `programming.png` (con `?v=2`)
- ✅ Pie de página completo con redes sociales
- ✅ Dado y tablero de lotería siempre visibles
- ✅ Secciones de datos personales y académicos como viñetas simples
- ✅ Sección de experiencia reorganizada por empresa

