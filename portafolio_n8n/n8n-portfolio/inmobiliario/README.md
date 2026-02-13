# Inmobiliario (Real Estate)

## Workflow: Lead scoring y seguimiento de visitas

**Archivo:** `workflow-lead-scoring-visitas.json`

### Objetivo

Cuando un lead completa una visita a una propiedad (formulario o CRM), calcular un score según interés, poder adquisitivo y frecuencia de contacto, y asignar seguimiento (agente, tarea en CRM o recordatorio).

### Flujo

1. **Webhook / Formulario** — Recibir “visita realizada” (propiedad_id, lead_id, valoración, notas).
2. **BD** — Obtener historial del lead (visitas anteriores, origen, presupuesto).
3. **Code** — Calcular score: puntos por número de visitas, por valoración alta, por presupuesto alineado con el precio.
4. **IF** — Si score > umbral → “caliente”: crear tarea de seguimiento en CRM y notificar al agente por Slack/Email.
5. **BD** — Actualizar lead (última visita, score, fecha_actualización).
6. **Opcional** — Enviar email al lead con propiedades similares o siguiente cita.

### Configuración

- Credenciales: API del CRM (HubSpot, Pipedrive, etc.), BD, Slack o SMTP.
- Ajustar pesos del score según tu negocio (visitas, valoración, presupuesto).

### Extensión posible

- Integración con calendario para proponer siguiente visita automáticamente.

### Si no abre en n8n

- Usa n8n 1.x (versión reciente). En **Menú (⋯) → Import from File** selecciona el JSON.
- Si n8n muestra error al importar, revisa que el archivo no se haya cortado o corrupto; vuelve a descargarlo desde el portafolio web.
- La tabla `leads` debe tener al menos: `id`, `visit_count`, `score`, `updated_at` (y opcionalmente `budget`, `agent_id`). El nodo «Actualizar lead» hace `RETURNING id`; el resto de datos se toma de pasos anteriores.
