# Media / Entretenimiento

## Workflow: Publicación programada y métricas de contenido

**Archivo:** `workflow-publicacion-metricas.json`

### Objetivo

Programar publicaciones en redes (LinkedIn, Twitter/X, Facebook) y recopilar métricas (likes, shares, comentarios) para guardarlas en BD o enviar un resumen al equipo.

### Flujo

1. **Schedule** — Diario a hora fija (ej. 09:00) o según calendario de contenidos.
2. **BD / Google Sheets** — Obtener posts programados para hoy con estado “pendiente”.
3. **Split** — Un ítem por post.
4. **HTTP / Nodo nativo** — Publicar en API de la red social (LinkedIn, Twitter, etc.).
5. **Set** — Guardar post_id, red, fecha_publicacion.
6. **BD** — Actualizar registro: publicado = true, post_id_externo.
7. **Schedule (segundo flujo o subworkflow)** — Cada noche: consultar APIs de insights de cada post reciente, guardar métricas en BD y opcionalmente enviar resumen por Slack/Email.

### Configuración

- Credenciales: OAuth o API keys de cada red social, BD o Google Sheets.
- Campos en BD/Sheet: contenido, red, fecha_programada, imagen_url, etc.

### Extensión posible

- A/B test: variantes de texto por canal y comparar métricas después de 24 h.
