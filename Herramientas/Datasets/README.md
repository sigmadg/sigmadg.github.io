# Generador de dataset desde transcripciones de YouTube

Página web para generar un dataset en formato JSONL a partir de las transcripciones (subtítulos/CC) de una lista de reproducción de YouTube. Las transcripciones se descargan, se limpian y se normalizan con la misma lógica que en `normalize_hf_jsonl.py` (detección de idioma, pista regional es-MX, limpieza de PII, etc.).

## Requisitos

- Python 3.9+
- Dependencias en `requirements.txt`

## Instalación

```bash
cd /home/sigmadg/Documentos/Proyectos_Gaby/Datasets
python -m venv .venv
source .venv/bin/activate   # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Uso rápido (desarrollo)

```bash
python app.py
```

Abre **http://127.0.0.1:5000** y usa el formulario. Al cerrar la terminal, la app se apaga.

En la página puedes pegar la URL de una playlist, elegir máximo de videos y rango (desde/hasta), y **Descargar JSONL** o **Ver en página web** (con log en vivo).

4. Pulsar **“Generar y descargar dataset (JSONL)”**. Se descargará un archivo `dataset_transcripciones.jsonl` con un documento por video (cada línea es un JSON con `text`, `source_url`, `language`, `regional_hint`, `chunk_id`, etc.).

## Formato del JSONL

Cada línea del archivo generado es un objeto JSON con campos como:

- `text`: transcripción limpia (PII sustituido por placeholders).
- `source_url`: enlace al video de YouTube.
- `language`: idioma detectado (`es` / `en`).
- `regional_hint`: pista regional es-MX (`high` / `med` / `low`).
- `license`: `youtube-terms`.
- `chunk_id`, `source`, `timestamp`, `video_id`, `video_title`, etc.

La normalización replica la lógica de `normalize_hf_jsonl.py` (detección de idioma con `langdetect`, etiquetado regional por palabras clave mexicanas, limpieza de emails y teléfonos).

---

## Ejecución continua (siempre en marcha)

Para que la página esté disponible todo el tiempo (incluso al cerrar la sesión o reiniciar el equipo), usa un servidor de producción y, en Linux, un servicio. **No hace falta Django**: Flask con gunicorn o waitress es suficiente.

### Opción 1: Script con Gunicorn (Linux / macOS)

```bash
source .venv/bin/activate
./run.sh
```

La app queda en **http://0.0.0.0:5000** (accesible desde la red local). Para dejarla en segundo plano:

```bash
nohup ./run.sh > logs.txt 2>&1 &
```

### Opción 2: Servicio systemd (Linux, se inicia al arrancar)

1. Edita `datasets-generator.service` y ajusta `User`, `Group`, `WorkingDirectory` y las rutas de `PATH` y `ExecStart` a tu usuario y carpeta del proyecto.
2. Instala el servicio:

```bash
sudo cp datasets-generator.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable datasets-generator
sudo systemctl start datasets-generator
```

3. Comandos útiles:

```bash
sudo systemctl status datasets-generator   # Estado
sudo systemctl stop datasets-generator     # Parar
sudo systemctl start datasets-generator    # Arrancar
journalctl -u datasets-generator -f        # Ver logs en vivo
```

La app estará en **http://tu-ip:5000** y se reiniciará sola si se cae o al reiniciar el PC.

### Opción 3: Windows (siempre en marcha)

Instala **waitress** y arranca la app con él:

```bash
pip install waitress
waitress-serve --listen=0.0.0.0:5000 app:app
```

Para que siga al cerrar la terminal, ejecútalo como servicio o con el Programador de tareas de Windows.

---

## Subir la página sin tener un servidor activo

**Django no hace falta**: la lógica puede estar en **JavaScript** (normalización en el navegador) o en **funciones serverless** (Vercel/Netlify), sin máquina 24/7.

### Opción A: 100 % en el navegador (sin backend)

En la misma página hay una sección **“Solo normalizar (100% en el navegador)”**. Subes un archivo JSONL (líneas con `{"text": "..."}`) y el navegador limpia PII y calcula `regional_hint` en JavaScript. No se envía nada a ningún servidor. Sirve para normalizar datos que ya tengas.

### Opción B: Desplegar en Vercel (sin servidor 24/7)

Puedes subir el proyecto a **Vercel** y que la lógica de “descargar transcripciones de YouTube” corra solo cuando alguien use la página (funciones serverless). No hay servidor encendido todo el tiempo.

1. Crea una cuenta en [vercel.com](https://vercel.com) y conecta el repositorio (o sube la carpeta).
2. En la raíz del proyecto están `vercel.json`, `api/generate_stream.py`, `core.py`, `normalize.py` y `requirements.txt`. Vercel usará la API en `/api/generate_stream` (máx. 30 videos por petición en el plan gratuito).
3. El build copia `templates/index.html` a `public/index.html`. La página llama a `/api/generate-stream`; en Vercel esa ruta ejecuta la función serverless.

Tras el despliegue, la URL será algo como `https://tu-proyecto.vercel.app`. La sección “Solo normalizar” sigue funcionando 100 % en el navegador.

### GitHub Pages (solo estático, sin servidor)

En GitHub Pages solo se sirve contenido estático. En esta versión **solo funciona la sección «Solo normalizar»** (100 % en el navegador). La generación desde playlist de YouTube no está disponible ahí; para eso usa la app en local o Vercel.

**Configuración:**

1. El proyecto ya incluye la carpeta **`docs/`** con:
   - `docs/index.html` — página estática (copia de la plantilla).
   - `docs/.nojekyll` — evita que GitHub use Jekyll.

2. En tu repositorio de GitHub:
   - **Settings** → **Pages**.
   - En **Build and deployment**, **Source**: “Deploy from a branch”.
   - **Branch**: `main` (o la que uses), **Folder**: `/docs`.
   - Guardar. En unos minutos la página estará en `https://<usuario>.github.io/<repo>/`.

3. Si cambias la plantilla (`templates/index.html`), vuelve a copiarla a `docs/`:
   ```bash
   ./scripts/sync-docs.sh
   ```
   y haz commit de `docs/index.html`.
