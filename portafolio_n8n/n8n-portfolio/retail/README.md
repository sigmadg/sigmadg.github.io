# Retail / E-commerce

## Workflow: Sincronización de inventario y notificaciones de pedidos

**Archivo:** `workflow-inventario-pedidos.json`

### Objetivo

Sincronizar stock entre canal de ventas (e-commerce, marketplace) y almacén, y notificar al equipo cuando un pedido nuevo requiera preparación.

### Flujo

1. **Webhook** — Recibe evento “nuevo pedido” desde la tienda (Shopify, WooCommerce, API propia).
2. **Validar payload** — Comprobar que tenga items y total.
3. **HTTP / BD** — Consultar stock actual por SKU.
4. **IF** — ¿Hay stock suficiente? Si no, rama “sin stock” → Slack + marcar pedido en espera.
5. **Rama “con stock”** — Actualizar reserva de inventario, enviar notificación a almacén (Slack/Email) y opcionalmente al cliente (Email “pedido recibido”).

### Configuración

- Credenciales: Webhook (URL en tu tienda), API o BD de inventario, Slack, SMTP.
- Mapear campos del webhook (product_id, quantity) a tu modelo de inventario.

### Extensión posible

- Integrar con sistema de picking (crear orden de preparación) o con pasarela de envíos para etiquetas.
