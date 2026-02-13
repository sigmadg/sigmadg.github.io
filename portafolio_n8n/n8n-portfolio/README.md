# Portafolio de implementaciones n8n por industria

Colección de ejemplos de workflows n8n diseñados para distintos sectores. Cada carpeta contiene workflows importables (JSON) y documentación del caso de uso.

## Configuración para n8n local

Para **instalar n8n**, **normalizar los workflows** (para que abran sin error) y **configurar credenciales**, sigue la guía:

- **[SETUP-N8N.md](./SETUP-N8N.md)** — Instalación, dependencias e importación en http://localhost:5678
- **[DEPENDENCIAS-FLUJOS.md](./DEPENDENCIAS-FLUJOS.md)** — Credenciales y servicios externos que necesita **cada flujo** (PostgreSQL, SMTP, Slack, APIs, tablas, webhooks)
- **[docs/POSTGRES-LOCAL.md](./docs/POSTGRES-LOCAL.md)** — Cómo instalar y configurar **PostgreSQL en local** y usarlo con n8n

Resumen rápido:

1. Instalar n8n: `npm install -g n8n` (requiere Node.js 20+).
2. Los JSON del repo están ya **normalizados** (sin referencias a credenciales ni webhookId), listos para importar.
3. En n8n: **Menú (⋯) → Import from File** y elige cada `workflow-*.json`. Luego configura las credenciales en cada nodo que lo pida.

## Cómo usar (después de importar)

1. Abre tu instancia de n8n (local o cloud).
2. **Importar**: Menú → Workflows → Import from File, o arrastra el `.json` al editor.
3. Configura las credenciales que cada workflow requiera (APIs, BD, etc.).
4. Ajusta triggers, webhooks o cron según tu entorno.

## Rubros incluidos

| # | Rubro | Carpeta | Descripción principal |
|---|--------|---------|------------------------|
| 1 | **Aeroespacial** | `aeroespacial` | Monitoreo de telemetría y alertas de mantenimiento |
| 2 | **Fintech** | `fintech` | Conciliación de pagos y detección de anomalías |
| 3 | **Salud** | `salud` | Recordatorios de citas y flujo de consentimientos |
| 4 | **Retail / E-commerce** | `retail` | Sincronización inventario y notificaciones de pedidos |
| 5 | **Logística** | `logistica` | Tracking de envíos y actualización de estados |
| 6 | **Educación (EdTech)** | `educacion` | Inscripciones y envío de certificados |
| 7 | **Energía** | `energia` | Lecturas de medidores y alertas de consumo |
| 8 | **Agricultura (AgTech)** | `agricultura` | Sensores de suelo y pronóstico para riego |
| 9 | **Gobierno (GovTech)** | `gobierno` | Trámites ciudadanos y notificaciones oficiales |
| 10 | **Media / Entretenimiento** | `media` | Publicación programada y métricas de contenido |
| 11 | **Inmobiliario (Real Estate)** | `inmobiliario` | Lead scoring y seguimiento de visitas |
| 12 | **Automotriz** | `automotriz` | Recordatorios de servicio y feedback post-venta |

## Estructura por rubro

Cada rubro contiene:

- `workflow-*.json` — Workflow listo para importar en n8n.
- `README.md` — Objetivo del flujo, nodos principales y cómo configurarlo.

## Requisitos generales

- n8n 1.x (recomendado última estable).
- Credenciales según cada workflow: APIs externas, bases de datos, email, Slack, etc.
- Para webhooks: URL pública o túnel (ngrok, cloudflare tunnel) si usas n8n self-hosted.

## Licencia

Ejemplos de uso libre para aprendizaje y portafolio. Ajusta y redistribuye según tu necesidad.
