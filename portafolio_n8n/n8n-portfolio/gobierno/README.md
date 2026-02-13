# Gobierno (GovTech)

## Workflow: Trámites ciudadanos y notificaciones oficiales

**Archivo:** `workflow-tramites-notificaciones.json`

### Objetivo

Cuando un trámite cambia de estado (en ventanilla, aprobado, rechazado), actualizar el expediente, registrar el evento en bitácora y notificar al ciudadano por email o SMS con el resultado y los siguientes pasos.

### Flujo

1. **Webhook / Polling** — Recibir actualización de estado desde el sistema de ventanilla única o consultar API de trámites.
2. **Validar** — Comprobar que el expediente existe y el estado es válido.
3. **BD** — Actualizar estado del trámite y escribir en tabla de auditoría (quién, cuándo, estado anterior/nuevo).
4. **Set** — Preparar texto del mensaje según tipo de trámite y estado (plantillas).
5. **Email / SMS** — Enviar notificación al ciudadano (email registrado o teléfono).
6. **Opcional** — Enviar resumen a canal interno (Slack/Teams) para seguimiento.

### Configuración

- Credenciales: API del sistema de trámites, BD gubernamental, SMTP, proveedor SMS (Twilio, etc.).
- Cumplimiento: no incluir datos sensibles en asuntos de email; guardar log de notificaciones enviadas.

### Extensión posible

- Firma electrónica o enlace a portal del ciudadano para descargar resolución o certificado.
