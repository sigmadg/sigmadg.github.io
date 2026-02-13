# Cómo configurar PostgreSQL local para n8n

Guía para instalar PostgreSQL en tu máquina, crear una base de datos y conectarla desde n8n para los workflows del portafolio.

---

## 1. Instalar PostgreSQL

### En Ubuntu / Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

Comprueba que esté en marcha:

```bash
sudo systemctl status postgresql
# Si no está activo:
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### En Fedora / RHEL

```bash
sudo dnf install postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Con Docker (cualquier SO)

```bash
docker run -d --name postgres-n8n \
  -e POSTGRES_USER=n8n \
  -e POSTGRES_PASSWORD=n8n_local \
  -e POSTGRES_DB=n8n_workflows \
  -p 5432:5432 \
  -v postgres_n8n_data:/var/lib/postgresql/data \
  postgres:16
```

En ese caso:
- **Host:** `localhost`
- **Puerto:** `5432`
- **Usuario:** `n8n`
- **Contraseña:** `n8n_local`
- **Base de datos:** `n8n_workflows`

Puedes seguir al apartado **3. Crear tablas** y **4. Configurar en n8n**.

---

## 2. Crear usuario y base de datos (instalación nativa)

Por defecto PostgreSQL crea el usuario `postgres`. Puedes usarlo o crear uno solo para n8n.

### Opción A: Usar el usuario `postgres`

```bash
sudo -u postgres psql
```

Dentro de `psql`:

```sql
CREATE DATABASE n8n_workflows;
\q
```

Para que n8n se conecte con usuario `postgres` necesitas una contraseña. Así la asignas (sustituye `TU_PASSWORD`):

```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'TU_PASSWORD';"
```

Configuración típica en n8n:
- **Host:** `localhost`
- **Puerto:** `5432`
- **Usuario:** `postgres`
- **Contraseña:** la que hayas puesto
- **Base de datos:** `n8n_workflows`

### Opción B: Crear usuario solo para n8n

```bash
sudo -u postgres psql
```

En `psql`:

```sql
CREATE USER n8n WITH PASSWORD 'n8n_local';
CREATE DATABASE n8n_workflows OWNER n8n;
GRANT ALL PRIVILEGES ON DATABASE n8n_workflows TO n8n;
\q
```

En n8n usarías:
- **Usuario:** `n8n`
- **Contraseña:** `n8n_local`
- **Base de datos:** `n8n_workflows`

---

## 3. Crear tablas para los workflows

Cada flujo que use Postgres espera ciertas tablas. Puedes crear solo las del flujo que vayas a probar, o todas de golpe.

Conéctate a la base de datos:

```bash
# Si usas usuario postgres:
sudo -u postgres psql -d n8n_workflows

# Si creaste usuario n8n (y tienes peer auth en pg_hba o contraseña):
psql -h localhost -U n8n -d n8n_workflows
```

Pega y ejecuta el SQL que necesites según el flujo.

### Salud (recordatorios de citas)

```sql
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  patient_email VARCHAR(255),
  patient_phone VARCHAR(50),
  appointment_at TIMESTAMP,
  reminder_sent BOOLEAN DEFAULT FALSE,
  consent_sent BOOLEAN DEFAULT FALSE
);

-- Dato de prueba
INSERT INTO appointments (patient_email, appointment_at, reminder_sent)
VALUES ('paciente@ejemplo.com', CURRENT_DATE + 1 + TIME '09:00', FALSE);
```

### Retail (inventario y pedidos)

```sql
CREATE TABLE inventory (
  sku VARCHAR(100) PRIMARY KEY,
  quantity INTEGER DEFAULT 0
);

INSERT INTO inventory (sku, quantity) VALUES ('SKU001', 10), ('SKU002', 5);
```

### Fintech (conciliación)

```sql
CREATE TABLE transactions (
  id VARCHAR(100) PRIMARY KEY,
  amount DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT NOW(),
  date DATE
);
```

### Logística (tracking)

```sql
CREATE TABLE shipments (
  id SERIAL PRIMARY KEY,
  tracking_number VARCHAR(100),
  customer_email VARCHAR(255),
  status VARCHAR(50)
);
```

### Educación (certificados)

```sql
CREATE TABLE users (
  id VARCHAR(100) PRIMARY KEY,
  email VARCHAR(255),
  full_name VARCHAR(255)
);

CREATE TABLE courses (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255)
);

CREATE TABLE completions (
  user_id VARCHAR(100),
  course_id VARCHAR(100),
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_issued_at TIMESTAMP,
  PRIMARY KEY (user_id, course_id)
);

-- Ejemplo
INSERT INTO users (id, email, full_name) VALUES ('u1', 'alumno@ejemplo.com', 'Juan Pérez');
INSERT INTO courses (id, title) VALUES ('c1', 'Curso n8n');
INSERT INTO completions (user_id, course_id) VALUES ('u1', 'c1');
```

### Energía (lecturas)

```sql
CREATE TABLE meter_readings (
  id SERIAL PRIMARY KEY,
  meter_id VARCHAR(100),
  kwh DECIMAL(10,2),
  read_at TIMESTAMP
);
```

### Gobierno (trámites)

```sql
CREATE TABLE tramites (
  expediente_id VARCHAR(100) PRIMARY KEY,
  estado VARCHAR(50),
  ciudadano_email VARCHAR(255),
  ciudadano_phone VARCHAR(50),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE auditoria_tramites (
  id SERIAL PRIMARY KEY,
  expediente_id VARCHAR(100),
  estado VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Media (posts programados)

```sql
CREATE TABLE scheduled_posts (
  id SERIAL PRIMARY KEY,
  content TEXT,
  channel VARCHAR(100),
  image_url TEXT,
  scheduled_for TIMESTAMP,
  published BOOLEAN DEFAULT FALSE,
  external_id VARCHAR(100),
  published_at TIMESTAMP,
  author_urn VARCHAR(255)
);
```

### Inmobiliario (leads)

```sql
CREATE TABLE leads (
  id VARCHAR(100) PRIMARY KEY,
  visit_count INTEGER DEFAULT 0,
  budget DECIMAL(12,2),
  agent_id VARCHAR(100),
  score INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Automotriz (recordatorios)

```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  name VARCHAR(255)
);

CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  plate VARCHAR(20),
  model VARCHAR(100),
  current_km INTEGER,
  next_service_km INTEGER,
  next_service_date DATE,
  customer_id INTEGER REFERENCES customers(id)
);

CREATE TABLE reminder_log (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER,
  sent_at TIMESTAMP DEFAULT NOW()
);
```

Si quieres **todas las tablas de una vez**, puedes concatenar los bloques anteriores en un solo script y ejecutarlo.

---

## 4. Configurar la credencial en n8n

1. Abre n8n → **Settings** (engranaje abajo a la izquierda) → **Credentials**.
2. **Add credential** → busca **Postgres**.
3. Rellena:
   - **Host:** `localhost` (o `127.0.0.1`)
   - **Database:** `n8n_workflows`
   - **User:** `postgres` o `n8n` (según lo que hayas creado)
   - **Password:** la contraseña del usuario
   - **Port:** `5432` (por defecto)
   - **SSL:** desactivado para local
4. **Save**.
5. En cada workflow que use Postgres, abre el nodo de base de datos y selecciona esta credencial.

---

## 5. Permitir conexión desde n8n (instalación nativa)

Si n8n y Postgres están en la misma máquina, `localhost` suele bastar. Si n8n corre en Docker y Postgres en el host:

- Usa **host.docker.internal** (en Docker Desktop) o la IP de la máquina.
- En PostgreSQL asegúrate de que acepte conexiones TCP: en `postgresql.conf` (`listen_addresses = '*'` o `'localhost'`) y en `pg_hba.conf` una línea como:
  ```
  host    n8n_workflows    n8n    127.0.0.1/32    scram-sha-256
  ```
  Luego reinicia Postgres: `sudo systemctl restart postgresql`.

---

## Resumen rápido

| Paso | Comando / Acción |
|------|-------------------|
| Instalar (Ubuntu) | `sudo apt install postgresql postgresql-contrib` |
| Crear BD y usuario | `sudo -u postgres psql` → `CREATE USER n8n WITH PASSWORD 'n8n_local';` `CREATE DATABASE n8n_workflows OWNER n8n;` |
| Crear tablas | Conectarte a `n8n_workflows` y ejecutar el SQL del flujo que uses (arriba). |
| En n8n | Settings → Credentials → Postgres → Host `localhost`, DB `n8n_workflows`, User `n8n`, Password `n8n_local`, Port `5432`. |

Si indicas qué flujo quieres probar primero (Salud, Retail, Fintech, etc.), se puede reducir a solo los pasos y la tabla de ese flujo.
