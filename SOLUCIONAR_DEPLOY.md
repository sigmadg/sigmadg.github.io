# Solucionar Fallos de Despliegue en GitHub Pages

## Problema
Los despliegues de "pages build and deployment" están fallando (todos muestran X roja).

## Pasos para Diagnosticar

### 1. Revisar los Logs de Error Específicos
1. Ve a: https://github.com/sigmadg/sigmadg.github.io/actions
2. Haz clic en el workflow más reciente que falló (por ejemplo, "pages-build-deployment #84")
3. Expande los pasos que fallaron para ver el error específico
4. Copia el mensaje de error completo

### 2. Verificar Configuración de GitHub Pages
1. Ve a: https://github.com/sigmadg/sigmadg.github.io/settings/pages
2. Verifica:
   - **Source**: Debe ser "Deploy from a branch"
   - **Branch**: Debe ser `master` (no `main`)
   - **Folder**: Debe ser `/ (root)`
3. Si está configurado en `main`, cámbialo a `master`

### 3. Verificar Archivo .nojekyll
El archivo `.nojekyll` debe existir en la raíz para deshabilitar Jekyll.
- Verifica: https://github.com/sigmadg/sigmadg.github.io/blob/master/.nojekyll
- Si no existe, créalo (ya existe localmente)

### 4. Verificar Tamaño de Archivos
GitHub Pages tiene límites:
- Archivos individuales: máximo 100MB
- Repositorio total: máximo 1GB

Verifica si hay archivos muy grandes:
```bash
find . -type f -size +10M
```

### 5. Verificar Errores en HTML
A veces errores de sintaxis en HTML pueden causar fallos. Verifica:
- Que todos los tags estén cerrados
- Que no haya caracteres especiales problemáticos
- Que las rutas de archivos sean correctas

### 6. Intentar Re-ejecutar el Despliegue
1. Ve a: https://github.com/sigmadg/sigmadg.github.io/actions
2. Haz clic en el workflow más reciente
3. Busca el botón "Re-run all jobs" o "Re-run failed jobs"
4. Haz clic para re-ejecutar

### 7. Verificar Permisos
1. Ve a: https://github.com/sigmadg/sigmadg.github.io/settings/actions
2. En "Workflow permissions", verifica que esté habilitado
3. Selecciona "Read and write permissions"

## Soluciones Comunes

### Solución 1: Forzar Re-despliegue
```bash
# Crear un commit vacío para forzar re-despliegue
git commit --allow-empty -m "Forzar re-despliegue de GitHub Pages"
git push origin master
```

### Solución 2: Verificar y Corregir .nojekyll
```bash
# Asegurar que .nojekyll existe
touch .nojekyll
git add .nojekyll
git commit -m "Asegurar que .nojekyll existe"
git push origin master
```

### Solución 3: Limpiar y Reconstruir
Si hay problemas con archivos grandes o estructura:
1. Verifica los logs de error específicos
2. Identifica qué archivo o paso está causando el problema
3. Corrige el problema específico

### Solución 4: Cambiar a GitHub Actions (Alternativa)
Si el despliegue automático sigue fallando, puedes usar GitHub Actions manualmente.

## Próximos Pasos

1. **Revisa los logs de error** en Actions para ver el mensaje específico
2. **Comparte el error** para poder ayudarte mejor
3. **Verifica la configuración** de Pages en Settings

## Contacto
Si el problema persiste después de revisar los logs, comparte el mensaje de error específico que aparece en los logs del workflow fallido.

