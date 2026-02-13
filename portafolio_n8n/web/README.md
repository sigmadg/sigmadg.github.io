# Portafolio web · Integración con n8n local

Esta carpeta contiene una **página web estática** que muestra los workflows del portafolio n8n y permite descargarlos para importarlos en tu **n8n local**.

## Cómo ver la página

### Opción 1: Servir la carpeta raíz del proyecto (recomendado)

Desde la carpeta **Portafolio** (la que contiene `n8n-portfolio` y `web`):

```bash
# Con Node.js
npx serve .

# O con Python 3
python3 -m http.server 8000
```

Luego abre en el navegador:

- **Con `serve`:** la URL que muestre (ej. `http://localhost:3000`). Entra a `/web/` → `http://localhost:3000/web/`
- **Con Python:** `http://localhost:8000/web/`

Así los enlaces de **Descargar workflow** apuntan bien a `n8n-portfolio/.../workflow-*.json`.

### Opción 2: Solo la carpeta web

Si sirves solo la carpeta `web`:

```bash
cd web
npx serve .
```

En ese caso, en `scripts.js` las rutas ya usan `n8n-portfolio/...` pensando en que el servidor tenga la raíz en la carpeta que contiene tanto `web` como `n8n-portfolio`. Si sirves desde dentro de `web`, los JSON no estarán disponibles a menos que copies o enlaces `n8n-portfolio` dentro de `web`, o que sirvas desde la raíz del proyecto (Opción 1).

**Recomendación:** sirve siempre desde la **raíz de Portafolio** (`Portafolio/`) con `npx serve .` y accede a la página por `http://localhost:XXXX/web/`.

## Integrar la página con n8n local

1. **Ten n8n corriendo en tu máquina**
   - Por ejemplo: `n8n start` → suele quedar en `http://localhost:5678`

2. **Abre el portafolio web**
   - Sirve la carpeta como arriba y entra a `/web/`.

3. **Descarga el workflow que quieras**
   - Clic en **«Descargar workflow (.json)»** en la tarjeta del rubro. Se descargará el `.json`.

4. **Importa en n8n**
   - En n8n: menú **⋯** (arriba a la derecha) → **Import from File** (o **Import from URL** si subes el JSON a una URL).
   - Selecciona el archivo descargado.
   - n8n creará un nuevo workflow con los nodos y conexiones. Solo tendrás que **configurar las credenciales** (API, BD, Slack, email, etc.) según indique cada flujo.

5. **Activa y prueba**
   - Activa el workflow en n8n y ajústalo a tu entorno (triggers, webhooks, variables).

No hace falta que la página web y n8n “hablen” entre sí: la web solo sirve para **mostrar el portafolio y descargar los JSON**; la integración es **tú importando ese JSON en tu n8n local**.

## Publicar el portafolio en internet

Si quieres que el portafolio sea público (por ejemplo en GitHub Pages, Netlify o Vercel):

1. Sube el repositorio (carpeta **Portafolio** con `n8n-portfolio` y `web`).
2. Configura el sitio estático con **raíz del proyecto** = carpeta del repo (donde está `web/` y `n8n-portfolio/`).
3. La página de inicio puede ser `web/index.html` (o configura la raíz como `web` y en ese caso tendrías que asegurar que los enlaces a los JSON sigan siendo correctos; lo más simple es publicar todo el repo y usar como URL base la que incluya `web/`).

Así cualquiera puede ver el portafolio y descargar los workflows para importarlos en su propia instancia de n8n.
