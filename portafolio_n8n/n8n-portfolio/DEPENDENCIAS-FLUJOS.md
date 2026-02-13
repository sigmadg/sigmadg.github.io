# Dependencias de los flujos (workflows)

Cada workflow del portafolio depende de **credenciales** y, en algunos casos, de **servicios externos** (APIs, bases de datos, etc.). Aquí se listan todas para que puedas configurarlas en n8n.

---

## Resumen por flujo

| Flujo | Credenciales en n8n | Servicios / APIs externos | Notas |
|-------|---------------------|---------------------------|--------|
| **Aeroespacial** | HTTP Header Auth, Slack | API de telemetría (URL configurable) | Sustituir URL y header en el nodo HTTP |
| **Fintech** | PostgreSQL, SMTP | API de pagos (URL configurable) | Tabla `transactions`; HTTP sin auth o con Header Auth si la API lo exige |
| **Salud** | PostgreSQL, SMTP | — | Tablas `appointments` y campos indicados en el README |
| **Retail** | PostgreSQL, Slack | — | Tabla `inventory` (sku, quantity) |
| **Logística** | PostgreSQL, SMTP | API del transportista (URL configurable) | Tabla `shipments` |
| **Educación** | PostgreSQL, SMTP | API generación PDF (URL configurable) | Tablas `users`, `courses`, `completions` |
| **Energía** | HTTP (opcional auth), PostgreSQL, Slack | API lecturas medidores | Tabla `meter_readings` |
| **Agricultura** | Slack | APIs sensores IoT y clima (OpenWeather u otra) | Sustituir URLs y, si aplica, API key de clima |
| **Gobierno** | PostgreSQL, SMTP | — | Tablas `tramites`, `auditoria_tramites` |
| **Media** | PostgreSQL, Slack, OAuth2 (LinkedIn) | — | Tabla `scheduled_posts`; LinkedIn opcional |
| **Inmobiliario** | PostgreSQL, Slack | — | Tabla `leads` |
| **Automotriz** | PostgreSQL, SMTP | — | Tablas `vehicles`, `customers`, `reminder_log` |

---

## 1. Aeroespacial – Telemetría y alertas

| Dependencia | Tipo en n8n | Qué necesitas |
|-------------|-------------|----------------|
| API de telemetría | **HTTP Request** (opcional: HTTP Header Auth) | URL del endpoint (en el nodo está un ejemplo). Si la API exige header (ej. `Authorization: Bearer XXX`), crea credencial **HTTP Header Auth** con nombre y valor. |
| Slack | **Slack** | Crear app en [api.slack.com](https://api.slack.com), instalar en workspace y usar **Bot User OAuth Token**. En n8n: credencial **Slack API**. |

---

## 2. Fintech – Conciliación de pagos

| Dependencia | Tipo en n8n | Qué necesitas |
|-------------|-------------|----------------|
| API transacciones proveedor | **HTTP Request** | URL de la API (ej. tu processor o banco). Añadir **HTTP Header Auth** o **Generic Credential** si la API requiere autenticación. |
| Base de datos interna | **PostgreSQL** | Host, puerto, base de datos, usuario, contraseña. Tabla con al menos: `id`, `amount`, `created_at`, `date` (o ajustar la query del nodo). |
| Email | **SMTP** | Servidor SMTP, puerto (ej. 587), usuario y contraseña (o “App Password” si es Gmail/Outlook). |

---

## 3. Salud – Recordatorios de citas

| Dependencia | Tipo en n8n | Qué necesitas |
|-------------|-------------|----------------|
| Base de datos | **PostgreSQL** | Tabla `appointments` con: `id`, `patient_email`, `patient_phone`, `appointment_at`, `reminder_sent`, `consent_sent`. |
| Email | **SMTP** | Para enviar recordatorios a los pacientes. |

---

## 4. Retail – Inventario y pedidos

| Dependencia | Tipo en n8n | Qué necesitas |
|-------------|-------------|----------------|
| Base de datos | **PostgreSQL** | Tabla `inventory` con `sku`, `quantity` (ajustar query si tu esquema es distinto). |
| Slack | **Slack API** | Canales `#pedidos` y `#alertas` (o cambiar en los nodos). |

**Webhook:** al activar el workflow, n8n te dará una URL. Esa URL es la que debe llamar tu tienda (e-commerce) cuando haya un nuevo pedido, con body tipo: `{ "order_id", "items": [{ "sku", "quantity" }], "total" }`.

---

## 5. Logística – Tracking de envíos

| Dependencia | Tipo en n8n | Qué necesitas |
|-------------|-------------|----------------|
| Base de datos | **PostgreSQL** | Tabla `shipments` con: `id`, `tracking_number`, `customer_email`, `status`. |
| API transportista | **HTTP Request** | URL del API de tracking (DHL, Correos, etc.) y parámetro de consulta (ej. `tracking`). Ajustar URL y query en el nodo. |
| Email | **SMTP** | Para notificar al cliente cuando el envío esté entregado. |

---

## 6. Educación – Inscripciones y certificados

| Dependencia | Tipo en n8n | Qué necesitas |
|-------------|-------------|----------------|
| Base de datos | **PostgreSQL** | Tablas: `users` (id, email, full_name), `courses` (id, title), `completions` (user_id, course_id, certificate_issued, certificate_issued_at). |
| Generación PDF | **HTTP Request** | URL de un servicio que genere el certificado (ej. API propia o tercero). El nodo envía `template`, `student_name`, `course_name`; adaptar al formato que espere tu API. |
| Email | **SMTP** | Para enviar el certificado al alumno. |

**Webhook:** la URL que n8n asigne al activar el workflow debe recibir `user_id` y `course_id` (body) cuando se complete un curso.

---

## 7. Energía – Lecturas y alertas de consumo

| Dependencia | Tipo en n8n | Qué necesitas |
|-------------|-------------|----------------|
| API lecturas | **HTTP Request** | URL de la API de medidores (smart meters). Parámetro `since` en query; el nodo usa `$now.minus(1, 'hour')`. Añadir auth si la API lo requiere. |
| Base de datos | **PostgreSQL** | Tabla `meter_readings` (meter_id, kwh, read_at). Opcional: tabla o lógica para “consumo medio” si el Code usa `avg_consumption`. |
| Slack | **Slack API** | Canal para alertas (ej. `#energia-alertas`). |

---

## 8. Agricultura – Sensores y riego

| Dependencia | Tipo en n8n | Qué necesitas |
|-------------|-------------|----------------|
| API sensores | **HTTP Request** | URL que devuelva lecturas (ej. humedad, sector_id, lat, lon). Sustituir la URL del nodo “Lecturas sensores”. |
| API clima | **HTTP Request** | Ej. OpenWeather: `https://api.openweathermap.org/data/2.5/forecast?lat=...&lon=...&appid=TU_API_KEY`. Sustituir en el nodo “Pronóstico tiempo”. |
| API riego (opcional) | **HTTP Request** | Si tienes API para activar válvulas, URL y body (ej. `sector_id`). Si no, puedes dejar el nodo o quitarlo. |
| Slack | **Slack API** | Canal para notificar al agricultor (ej. `#agtech`). |

---

## 9. Gobierno – Trámites y notificaciones

| Dependencia | Tipo en n8n | Qué necesitas |
|-------------|-------------|----------------|
| Base de datos | **PostgreSQL** | Tablas: `tramites` (expediente_id, estado, ciudadano_email, ciudadano_phone, updated_at), `auditoria_tramites` (expediente_id, estado, created_at). |
| Email | **SMTP** | Para notificar al ciudadano. |

**Webhook:** la URL de n8n debe recibir (body) `expediente_id`, `estado`, `tipo` cuando cambie el estado del trámite en tu sistema.

---

## 10. Media – Publicación programada

| Dependencia | Tipo en n8n | Qué necesitas |
|-------------|-------------|----------------|
| Base de datos | **PostgreSQL** | Tabla `scheduled_posts` con: id, content, channel, image_url, scheduled_for, published, external_id, published_at, author_urn. |
| LinkedIn | **OAuth2** (LinkedIn) | Crear app en [LinkedIn Developers](https://www.linkedin.com/developers/), configurar OAuth2 en n8n. El nodo “Publicar LinkedIn” usa la API de UGC Posts. |
| Slack | **Slack API** | Canal (ej. `#social`) para avisar al equipo. |

Puedes sustituir el nodo LinkedIn por otro **HTTP Request** con la API de la red que uses (Twitter, Facebook, etc.).

---

## 11. Inmobiliario – Lead scoring

| Dependencia | Tipo en n8n | Qué necesitas |
|-------------|-------------|----------------|
| Base de datos | **PostgreSQL** | Tabla `leads` con: id, visit_count, budget, agent_id, score, updated_at. |
| Slack | **Slack API** | Canal (ej. `#ventas-inmobiliario`) para notificar al agente. |

**Webhook:** la URL de n8n debe recibir (body) `lead_id`, `property_id`, `rating` cuando se complete una visita.

---

## 12. Automotriz – Recordatorios de servicio

| Dependencia | Tipo en n8n | Qué necesitas |
|-------------|-------------|----------------|
| Base de datos | **PostgreSQL** | Tablas: `vehicles` (id, plate, model, current_km, next_service_km, next_service_date, customer_id), `customers` (id, email, name), `reminder_log` (vehicle_id, sent_at). |
| Email | **SMTP** | Para enviar el recordatorio al cliente. |

---

## Configurar PostgreSQL en local

Para instalar PostgreSQL en tu máquina, crear la base de datos, las tablas que piden los flujos y la credencial en n8n:

- **[docs/POSTGRES-LOCAL.md](./docs/POSTGRES-LOCAL.md)** — Instalación (Ubuntu/Debian, Fedora, Docker), usuario, BD, SQL de todas las tablas y configuración en n8n.

---

## Cómo crear cada credencial en n8n

1. En n8n: **Settings** (engranaje) → **Credentials** → **Add credential**.
2. Elige el tipo según la tabla (PostgreSQL, SMTP, Slack API, HTTP Header Auth, OAuth2 API, etc.).
3. Rellena los campos (host, usuario, token, etc.) y guarda.
4. En cada nodo del workflow que lo pida, selecciona esa credencial.

No hace falta instalar **nodos extra**: todos los tipos anteriores son nodos **core** de n8n. Si usas una versión reciente de n8n (1.x), estarán disponibles.

---

## Orden recomendado para probar

Si quieres probar con el mínimo de dependencias:

1. **Solo Schedule + lógica (sin BD ni email):** por ejemplo **Energía** o **Agricultura** usando solo el nodo HTTP con una URL de prueba (ej. [reqres.in](https://reqres.in)) y sin conectar PostgreSQL/Slack al principio.
2. **Con PostgreSQL:** monta una BD local (Docker o instalada) y crea las tablas indicadas para **Salud**, **Retail** o **Automotriz**; así puedes probar flujos completos con BD.
3. **Con SMTP:** usa una cuenta de correo (Gmail con “App Password”, SendGrid, etc.) para **Salud**, **Fintech** o **Automotriz**.
4. **Con Slack:** crea una app en Slack y usa el token para **Aeroespacial**, **Retail** o **Inmobiliario**.

Con esto tienes todas las **dependencias de los flujos** listadas y listas para configurar en tu n8n local.
