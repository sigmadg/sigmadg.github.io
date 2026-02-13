# Configuración de n8n local para el portafolio

Guía para instalar n8n en tu máquina, instalar dependencias y abrir todos los workflows del portafolio en `http://localhost:5678/home/workflows`.

---

## 1. Requisitos

- **Node.js** 20.x o 24.x ([nodejs.org](https://nodejs.org))
- **npm** (viene con Node)

Comprueba versiones:

```bash
node -v   # debe ser v20.x o v24.x
npm -v
```

---

## 2. Instalar n8n

### Opción A: Instalación global (recomendada)

```bash
npm install -g n8n
```

Luego inicia n8n:

```bash
n8n start
```

Se abrirá en **http://localhost:5678**. La primera vez te pedirá crear un usuario (email y contraseña).

### Opción B: Con npx (sin instalar global)

```bash
npx n8n start
```

### Opción C: Docker

```bash
docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n
```

---

## 3. Dependencias (nodos)

Todos los workflows del portafolio usan **nodos incluidos en n8n** (core nodes). No hace falta instalar nodos comunitarios.

Resumen de nodos usados:

| Nodo | Uso |
|------|-----|
| **Schedule Trigger** | Ejecución por tiempo (cada X min, diario, etc.) |
| **Webhook** | Recibir peticiones HTTP |
| **HTTP Request** | Llamar APIs externas |
| **Postgres** | Consultas a base de datos PostgreSQL |
| **Set** | Preparar datos |
| **Code** | JavaScript personalizado |
| **IF** | Condiciones |
| **Slack** | Enviar mensajes a Slack |
| **Email (SMTP)** | Enviar correos |
| **Respond to Webhook** | Respuesta al webhook |

Si en el futuro añades workflows con **nodos comunitarios**, instálalos desde n8n:

- **Settings** (engranaje) → **Community nodes** → **Install** → buscar el paquete (ej. `n8n-nodes-base.notion`).

O por línea de comandos en la carpeta de datos de n8n:

```bash
cd ~/.n8n
npm install <nombre-paquete>
```

y reiniciar n8n.

---

## 4. Importar los workflows

1. Abre **http://localhost:5678** e inicia sesión.
2. Ve a **Workflows** (o **http://localhost:5678/home/workflows**).
3. Para cada workflow:
   - Menú **⋯** (arriba derecha) → **Import from File**.
   - Elige el `.json` de la carpeta correspondiente en este repo, por ejemplo:
     - `aeroespacial/workflow-telemetria-mantenimiento.json`
     - `fintech/workflow-conciliacion-pagos.json`
     - … (todos en `n8n-portfolio/<rubro>/workflow-*.json`).

Los JSON están **normalizados**: no incluyen referencias a credenciales existentes, así que cada nodo que necesite credenciales aparecerá con “No credential selected”. Así evitas errores al abrir.

---

## 5. Dependencias de cada flujo (credenciales y servicios)

Para ver **qué credenciales y servicios externos** necesita cada workflow (PostgreSQL, SMTP, Slack, APIs, tablas, webhooks), usa:

- **[DEPENDENCIAS-FLUJOS.md](./DEPENDENCIAS-FLUJOS.md)** — Listado flujo a flujo con tipo de credencial en n8n y qué debes tener (BD, tablas, URLs, etc.).

## 6. Configurar credenciales por workflow

Después de importar, en cada workflow:

1. Abre el workflow.
2. Haz clic en los nodos que muestren **“No credential selected”** o un aviso de credencial.
3. Elige **Create new credential** y rellena los datos según el tipo:

| Tipo | Dónde se usa | Qué necesitas |
|------|----------------|----------------|
| **PostgreSQL** | Varios (Fintech, Salud, Retail, etc.) | Host, puerto, base de datos, usuario, contraseña |
| **SMTP** | Email (Fintech, Salud, Educación, etc.) | Host, puerto, usuario, contraseña (o app password) |
| **Slack** | Aeroespacial, Retail, Media, etc. | Token de Slack (crear app en api.slack.com) |
| **HTTP Header Auth** | Aeroespacial (telemetría) | Nombre y valor del header (ej. `Authorization: Bearer xxx`) |
| **OAuth2** | Media (LinkedIn) | Client ID, Client Secret, etc. según LinkedIn |

Puedes usar **bases de datos y cuentas de prueba**; los flujos están pensados para que solo tengas que conectar tus credenciales y ajustar URLs o consultas si hace falta.

---

## 7. Normalizar de nuevo los workflows (opcional)

Si vuelves a tocar los JSON a mano y quieres quitar otra vez credenciales y `webhookId` para compartir o reimportar:

```bash
cd /home/sigmadg/Documentos/Proyectos_Gaby/Portafolio/n8n-portfolio
python3 normalize-workflows.py
```

Esto sobrescribe los JSON en su sitio; haz commit solo si quieres guardar ese estado.

---

## 8. Resumen de workflows por rubro

| Carpeta | Archivo | Credenciales típicas |
|---------|---------|----------------------|
| aeroespacial | workflow-telemetria-mantenimiento.json | HTTP Header Auth, Slack |
| fintech | workflow-conciliacion-pagos.json | (ninguna en HTTP), Postgres, SMTP |
| salud | workflow-recordatorios-consentimientos.json | Postgres, SMTP |
| retail | workflow-inventario-pedidos.json | Postgres, Slack |
| logistica | workflow-tracking-envios.json | Postgres, SMTP |
| educacion | workflow-inscripciones-certificados.json | Postgres, SMTP |
| energia | workflow-lecturas-alertas-consumo.json | (HTTP), Postgres, Slack |
| agricultura | workflow-sensores-riego.json | (HTTP), Slack |
| gobierno | workflow-tramites-notificaciones.json | Postgres, SMTP |
| media | workflow-publicacion-metricas.json | Postgres, OAuth2 (LinkedIn), Slack |
| inmobiliario | workflow-lead-scoring-visitas.json | Postgres, Slack |
| automotriz | workflow-servicio-feedback.json | Postgres, SMTP |

---

## 9. Si un workflow no abre

- **Asegúrate de importar un JSON ya normalizado** (el que está en el repo después de `normalize-workflows.py`).
- **Versión de n8n**: se recomienda la última estable (p. ej. `n8n@latest`).
- Si n8n muestra un error concreto (nodo desconocido, versión de nodo, etc.), actualiza n8n: `npm update -g n8n` y vuelve a importar el JSON.

Con esto deberías poder tener **todos los workflows abiertos y configurados** en tu n8n local en **http://localhost:5678/home/workflows**.
