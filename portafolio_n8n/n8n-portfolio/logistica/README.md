# Logística

## Workflow: Tracking de envíos y actualización de estados

**Archivo:** `workflow-tracking-envios.json`

### Objetivo

Consultar el estado de envíos en la API del transportista y actualizar el sistema interno (BD/ERP) y opcionalmente notificar al cliente por email cuando el estado cambie a “en reparto” o “entregado”.

### Flujo

1. **Schedule** — Cada hora (o cada 15 min en pico).
2. **BD** — Obtener envíos en estado “en tránsito” o “reparto”.
3. **HTTP Request** — Llamar API del transportista (DHL, Correos, etc.) con IDs de envío.
4. **Code / Set** — Mapear respuesta a estados internos (entregado, en reparto, incidencia).
5. **Loop** — Por cada envío con cambio de estado: actualizar BD y, si aplica, enviar email al cliente.

### Configuración

- Credenciales: API del transportista, PostgreSQL/MySQL, SMTP o API de notificaciones.
- Ajustar mapeo de códigos de estado según la documentación del transportista.

### Extensión posible

- Webhook del transportista (si existe) para actualizaciones en tiempo real sin polling.
