# Automotriz

## Workflow: Recordatorios de servicio y feedback post-venta

**Archivo:** `workflow-servicio-feedback.json`

### Objetivo

Enviar recordatorios de mantenimiento según kilometraje o tiempo desde la última revisión, y tras la visita de taller solicitar feedback (encuesta NPS o satisfacción) por email.

### Flujo

1. **Schedule** — Semanal (ej. lunes 08:00).
2. **BD** — Consultar vehículos con próxima revisión en los próximos 30 días (por km o por fecha última revisión).
3. **Split** — Un ítem por vehículo/cliente.
4. **Set** — Preparar mensaje personalizado (nombre, modelo, km actual, recomendación de servicio).
5. **Email / SMS** — Enviar recordatorio al cliente con enlace a agendar cita.
6. **Opcional (segundo flujo)** — Webhook “revisión completada”: al salir del taller, programar envío de encuesta 24 h después (Schedule + delay o cola) o llamar a API de email con plantilla de feedback.

### Configuración

- Credenciales: BD (clientes, vehículos, historial de servicios), SMTP o Twilio.
- Reglas de “próxima revisión”: ej. cada 15.000 km o cada 12 meses.

### Extensión posible

- Integrar con sistema de citas del concesionario para que el cliente reserve directamente desde el enlace.
