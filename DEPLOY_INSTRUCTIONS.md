# Instrucciones para Desplegar Colitas Abandonadas

## Problema Actual

GitHub está rechazando el workflow automático porque el token OAuth no tiene permisos de `workflow`. 

## Solución 1: Habilitar Permisos de Workflow en GitHub

1. Ve a tu repositorio en GitHub: `https://github.com/sigmadg/sigmadg.github.io`
2. Ve a **Settings** → **Actions** → **General**
3. En la sección **Workflow permissions**, selecciona:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
4. Guarda los cambios
5. Intenta hacer push nuevamente del workflow

## Solución 2: Despliegue Manual (Temporal)

Si no puedes habilitar los permisos ahora, puedes desplegar manualmente:

```bash
# 1. Compilar el proyecto
cd Colitas
npm install
npm run generate

# 2. Copiar archivos estáticos a la carpeta Colitas
cp -r .output/public/* ../Colitas/

# 3. Hacer commit y push
cd ..
git add Colitas/
git commit -m "Deploy Colitas - $(date +'%Y-%m-%d')"
git push origin master
```

O usa el script incluido:

```bash
cd Colitas
./deploy.sh
```

## Solución 3: Usar Personal Access Token (PAT)

1. Crea un Personal Access Token en GitHub:
   - Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Selecciona el scope `workflow`
2. Agrega el token como secreto en tu repositorio:
   - Settings → Secrets and variables → Actions
   - New repository secret
   - Nombre: `GITHUB_TOKEN`
   - Valor: tu token
3. El workflow debería funcionar automáticamente

## Acceso desde el Portafolio

Una vez desplegado, el proyecto estará disponible en:
- `https://sigmadg.github.io/Colitas/`

Los enlaces en `index.html` ya están configurados para apuntar a `Colitas/index.html`, así que funcionarán automáticamente.

