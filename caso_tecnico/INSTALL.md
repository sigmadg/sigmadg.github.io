# Instalación y ejecución — Caso técnico Rappi

Guía **paso a paso** para preparar el entorno, configurar **Telegram**, **Ollama**, **Django** y el stack **Docker** (Grafana / Prometheus). La raíz del proyecto se asume como `caso_tecnico/`.

Para contexto del producto y arquitectura, ver [`README.md`](README.md). Detalle Docker adicional: [`docker/README.md`](docker/README.md).

---

## 0. Requisitos previos

| Componente | Obligatorio | Notas |
|--------------|-------------|--------|
| **Git** | Sí | Para clonar el repositorio. |
| **Python 3.11+** | Sí (desarrollo local) | Alineado con el `Dockerfile`. |
| **pip + venv** | Sí (local) | `python3 -m venv .venv` |
| **Docker** + **Docker Compose v2** | Opcional | Para imagen única + stack con Grafana. Comprueba: `docker compose version`. |
| **Ollama** | Opcional | Solo si quieres LLM local (`LLM_PROVIDER=ollama`). |
| **Jupyter** | Opcional | Módulo 1 (notebook de diagnóstico). |

---

## 1. Clonar e instalar dependencias Python

```bash
cd ~/Documentos   # o la carpeta que uses
git clone <URL_DEL_REPO> caso_tecnico
cd caso_tecnico

python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

Comprueba:

```bash
python -c "import django; print('Django OK')"
```

---

## 2. Datos del caso (Excel)

Por defecto el fichero del caso es **`data/rappi_delivery_case_data.xlsx`** (raíz del repo). Puedes fijar otra ruta en **`.env`** (relativa a la raíz o absoluta):

```env
RAPPI_DATA_PATH=data/rappi_delivery_case_data.xlsx
# Alias equivalente (misma prioridad secundaria si RAPPI_DATA_PATH está vacío):
# CASO_DATA_XLSX=data/mi_dataset.xlsx
```

La resolución está centralizada en `modulo2_motor_alertas/src/zones.py` (`default_data_path`). Sin un fichero válido, el dashboard mostrará advertencias y el motor puede fallar al validar zonas.

---

## 3. Variables de entorno (`.env`)

1. Copia la plantilla:

   ```bash
   cp .env.example .env
   ```

2. Edita **`.env`** en la raíz `caso_tecnico/` (no lo subas a git).

Las secciones importantes están comentadas en [`.env.example`](.env.example). Resumen:

| Bloque | Propósito |
|--------|-----------|
| `TELEGRAM_*` | Envío de alertas al canal (Módulo 3). |
| `LLM_PROVIDER`, `OLLAMA_*`, `OPENAI_*` | Redacción de mensajes con LLM. |
| `MONITOR_*`, `TELEGRAM_MONITOR_PING` | Monitor continuo y pings opcionales. |
| `CASO_HOST_HTTP` | Solo si el puerto 8000 del host está ocupado (Docker). |

---

## 4. Telegram — configuración detallada

### 4.1 Crear el bot

1. Abre Telegram y habla con **[@BotFather](https://t.me/BotFather)**.
2. Envía `/newbot`, sigue los pasos y **guarda el token** (forma `123456789:AAH...`).
3. En **`.env`**:

   ```env
   TELEGRAM_BOT_TOKEN=<tu_token_real>
   ```

No uses los placeholders del `.env.example`; el código los rechaza.

### 4.2 Canal o grupo destino

- **Canal público:** puedes usar `@nombre_del_canal` como `TELEGRAM_CHAT_ID`.
- **Canal privado o grupo:** suele hacer falta el id numérico (p. ej. `-100xxxxxxxxxx`). Puedes obtenerlo con bots de utilidad, o añadiendo el bot al canal y revisando actualizaciones de la API.

El **bot debe ser administrador del canal** con permiso de **publicar mensajes**.

```env
TELEGRAM_CHAT_ID=@tu_canal
# o
TELEGRAM_CHAT_ID=-1001234567890
```

### 4.3 Probar sin Docker

Con el venv activado y desde la raíz del repo:

```bash
python modulo3_agente_telegram/run_agent.py --test-telegram
```

Debe llegar un mensaje corto al chat/canal configurado. Si falla, revisa token, `chat_id` y permisos del bot.

### 4.4 Probar con Docker

El `docker-compose.yml` monta `./.env` en `/app/.env`. Para **envío real** desde el monitor (no solo dry-run), en `.env` del host:

```env
MONITOR_DRY_RUN=0
```

(Por defecto en Compose suele ser `1` = no envía alertas largas; ajusta según tu `docker-compose.yml`.)

---

## 5. Ollama (LLM local)

### 5.1 Instalar en el host

Sigue la instalación oficial: [https://ollama.com](https://ollama.com) (Linux/macOS/Windows).

### 5.2 Escuchar en todas las interfaces (necesario si la app va en Docker)

En el **host**, Ollama debe ser alcanzable desde contenedores vía `host.docker.internal:11434`. En Linux suele bastar:

```bash
OLLAMA_HOST=0.0.0.0 ollama serve
```

(o el servicio systemd equivalente con esa variable).

Comprueba:

```bash
curl -sS http://127.0.0.1:11434/api/version
```

### 5.3 Descargar el modelo del caso

Por defecto el proyecto usa un modelo tipo Mixtral (ver `OLLAMA_MODEL` en `.env`). Ejemplo:

```bash
ollama pull mixtral:8x7b-instruct-v0.1-q4_0
```

Ajusta el nombre si cambias `OLLAMA_MODEL` en `.env`.

### 5.4 Variables en `.env` (local)

```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=mixtral:8x7b-instruct-v0.1-q4_0
```

### 5.5 Docker + Ollama en el host

El `docker-compose.yml` suele definir `OLLAMA_BASE_URL` / `CASO_OLLAMA_URL` apuntando a `http://host.docker.internal:11434`. El **entrypoint** también reescribe loopback si hace falta.

Desde **dentro** del contenedor (opcional, diagnóstico):

```bash
docker compose exec caso-tecnico curl -sS http://host.docker.internal:11434/api/version
```

Si falla: Ollama no escucha donde el contenedor puede llegar → revisa `OLLAMA_HOST=0.0.0.0` en el host.

---

## 6. Django (panel local, sin Docker)

Desde la raíz, con venv activado:

```bash
cd django_viz
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Abre en el navegador: **http://127.0.0.1:8000/**

Rutas útiles: inicio, monitor M3, pipeline (ver `django_viz/README.md` si existe).

---

## 7. Docker — solo la app (sin Grafana)

Build + run con el script (no requiere plugin Compose):

```bash
./scripts/docker_up.sh
```

- Publica **8000** (Django), **8090** (puente `/tick`), **9108** (métricas del monitor) en el host si están libres; si no, el script busca el siguiente trío libre e **imprime las URLs**.
- Monta `data/` y, si existe, `.env`.

Stack **completo** (misma app + Prometheus + Grafana):

```bash
./scripts/docker_stack.sh -d
```

o:

```bash
./scripts/docker_up.sh stack -d
```

Stack **con n8n** (lo anterior + automatización HTTP al `/tick`; ver [`docker/README.md`](docker/README.md)):

```bash
./scripts/docker_full_stack.sh -d
```

o manualmente:

```bash
docker compose --profile n8n up --build -d
```

Por defecto la UI de n8n queda en **http://127.0.0.1:15678** (variable `CASO_HOST_N8N` si cambias el puerto).

### 7.1 Puertos típicos en el host (después de `docker compose up`)

| Servicio | Puerto host (por defecto) | Uso |
|----------|---------------------------|-----|
| Django | **8000** | Panel web `http://127.0.0.1:8000/` |
| Puente FastAPI | **8090** | `POST http://127.0.0.1:8090/tick` |
| Métricas monitor | **9108** | `/metrics` |
| Prometheus | **9090** | UI Prometheus |
| Grafana | **3000** | `http://127.0.0.1:3000/` |
| n8n (solo perfil `n8n`) | **15678** (host) → 5678 en el contenedor | `http://127.0.0.1:15678/` |

Si **8000** está ocupado por otro proceso, usa `CASO_HOST_HTTP=8001` (o deja que `./scripts/docker_stack.sh` lo detecte) y abre **http://127.0.0.1:8001/** — no confundas con el otro servicio en 8000.

También puedes fijar a mano el trío de puertos si chocan:

```bash
CASO_HOST_HTTP=8001 CASO_HOST_BRIDGE=8091 CASO_HOST_METRICS=9109 docker compose up --build
```

### 7.2 Grafana — primer acceso

- URL: **http://127.0.0.1:3000/** (o `CASO_HOST_GRAFANA` si lo cambias).
- Usuario / contraseña por defecto en Compose: **`admin` / `admin`** (definidos en `docker-compose.yml` como `GF_SECURITY_ADMIN_USER` / `GF_SECURITY_ADMIN_PASSWORD`). Para otro usuario/clave en el arranque:

  ```bash
  GRAFANA_ADMIN_USER=ops GRAFANA_ADMIN_PASSWORD=tu_secreto ./scripts/docker_stack.sh -d
  ```

Dashboards: carpeta **Caso tecnico Rappi** (ver `docker/README.md`).

### 7.3 Prometheus

- UI: **http://127.0.0.1:9090/**
- Scrape configurado en `docker/prometheus.yml` hacia el servicio `caso-tecnico` (puertos internos 8090 y 9108).

### 7.4 Qué arranca dentro del contenedor `caso-tecnico`

El script **`docker/entrypoint.sh`** lanza (según variables):

| Proceso | Variable típica |
|---------|-------------------|
| Recalibración en background | `ENABLE_RECALIBRATE_ON_START=1` |
| Puente uvicorn :8090 | `ENABLE_N8N_BRIDGE=1` |
| Django :8000 | siempre |
| Bucle `run_alert_engine.py` (M2) | `ENABLE_M2_ENGINE_LOOP=1` |
| `monitor_loop.py` (M3) | `ENABLE_MONITOR=1` |

---

## 8. Comandos rápidos de verificación

| Qué probar | Comando |
|------------|---------|
| Motor M2 (demo simulada) | `python modulo2_motor_alertas/run_alert_engine.py --demo` |
| Agente M3 (demo, sin enviar) | `python modulo3_agente_telegram/run_agent.py --demo --dry-run` |
| Telegram | `python modulo3_agente_telegram/run_agent.py --test-telegram` |
| Front Docker | `./scripts/status_front.sh` |
| Ollama | `curl -sS http://127.0.0.1:11434/api/version` |

---

## 9. Problemas frecuentes

1. **`Connection refused` al LLM desde Docker**  
   Ollama en el host solo en `127.0.0.1` → usar `OLLAMA_HOST=0.0.0.0` y URL `http://host.docker.internal:11434` en el contenedor.

2. **`{"detail":"Invalid token"}` en el navegador**  
   Suele ser **otro servicio en el puerto** (p. ej. abres 8000 pero Django está mapeado a **8001**). Revisa la consola del script y `CASO_HOST_HTTP`.

3. **`DisallowedHost` (Django)**  
   Amplía `DJANGO_ALLOWED_HOSTS` en `.env` o variables de Compose.

4. **Telegram: Forbidden / no publica**  
   Bot no admin del canal o `TELEGRAM_CHAT_ID` incorrecto.

5. **Compose no reconoce `docker compose`**  
   Usa `./scripts/docker_up.sh` o instala el [plugin Compose v2](https://docs.docker.com/compose/install/linux/).

---

## 10. Documentación relacionada

- [`README.md`](README.md) — visión general, variables, módulos.
- [`docker/README.md`](docker/README.md) — Docker en profundidad, n8n, troubleshooting de red.
- [`modulo2_motor_alertas/README.md`](modulo2_motor_alertas/README.md) — motor de alertas.
- [`modulo3_agente_telegram/README.md`](modulo3_agente_telegram/README.md) — agente y monitor.
