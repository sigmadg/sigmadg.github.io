# Agricultura (AgTech)

## Workflow: Sensores de suelo y pronóstico para riego

**Archivo:** `workflow-sensores-riego.json`

### Objetivo

Combinar datos de sensores (humedad, temperatura de suelo) con pronóstico del tiempo para recomendar o activar riego en momentos óptimos (evitar riego si llueve pronto).

### Flujo

1. **Schedule** — Cada 6 horas (o según frecuencia de sensores).
2. **HTTP / MQTT** — Obtener lecturas de sensores por parcela/sector.
3. **HTTP** — Llamar API de pronóstico (OpenWeather, AEMET, etc.) para la ubicación de la parcela.
4. **Code** — Regla: si humedad < X % y no llueve en próximas 12 h → recomendar riego; si llueve en < 6 h → no regar.
5. **Set** — Preparar mensaje o payload para actuador.
6. **Slack / Email / API** — Enviar recomendación al agricultor o comando a sistema de riego (API/IoT).

### Configuración

- Credenciales: API de sensores (o broker MQTT), API de clima, opcional API del sistema de riego.
- Coordenadas de parcelas y umbrales de humedad por cultivo en BD o en variables.

### Extensión posible

- Integración con válvulas IoT para riego automático cuando la recomendación sea “regar ahora”.
