# API Contracts — Farley Portfolio

Documento vivo con la definición de endpoints, modelos de datos y flujos de integración. Última actualización: Sprint 1 finalizado (anti-spam + SMTP + scroll-spy).

---

## 1. Alcance

La web es mayormente **estática**. El backend cubre solo:

1. **Contacto** — persistir mensajes del formulario + enviar email a `CONTACT_TO_EMAIL`.
2. **Stats de visitas** — contador simple.
3. **Health** — ping de MongoDB.

El contenido del portafolio (perfil, skills, proyectos, experiencia, certificaciones) vive en `frontend/src/data/mock.js`. Cambios se hacen en ese archivo — no hay CMS.

---

## 2. API Endpoints

Base URL: `${REACT_APP_BACKEND_URL}/api`

### 2.1 `GET /api/`

Root health check mínimo.

**Response 200**
```json
{ "message": "Farley Portfolio API", "status": "ok" }
```

---

### 2.2 `GET /api/health`

Ping a MongoDB.

**Response 200 (healthy)**
```json
{ "status": "ok", "db": "connected" }
```

**Response 200 (degraded)**
```json
{ "status": "degraded", "db": "disconnected", "error": "..." }
```

---

### 2.3 `POST /api/contact`

Crea un mensaje de contacto, lo guarda en Mongo y envía un email al propietario del portafolio.

**Request body**
```json
{
  "name": "string (1..100)",
  "email": "EmailStr",
  "subject": "string (0..200, optional)",
  "message": "string (1..5000)",
  "website": "string (optional; honeypot — legitimate users send empty)"
}
```

**Response 201**
```json
{
  "id": "uuid",
  "name": "...",
  "email": "...",
  "subject": "...",
  "message": "...",
  "created_at": "ISO8601",
  "email_sent": true
}
```

**Errores**
- `422 Unprocessable Entity` — validación (email inválido, campos requeridos, límites de longitud).
- `429 Too Many Requests` — rate limit excedido (5/hora/IP). Body: `{ "detail": "Has enviado demasiados mensajes. Intenta de nuevo en una hora." }`
- `500 Internal Server Error` — fallo al guardar en Mongo.

**Comportamientos especiales**
- **Honeypot**: si `website` viene con valor, la respuesta es `201` con el cuerpo esperado pero el mensaje no se guarda ni se envía (y `email_sent: false`, `message: ""`). No se informa al cliente que fue detectado.
- **Rate limit**: basado en el header `X-Forwarded-For` (o `X-Real-IP`, o `request.client.host` como fallback). In-memory con deque. Se cuenta por IP y ventana de 1 hora.
- **Email**: si SMTP falla, la request devuelve 201 igualmente con `email_sent: false`. El mensaje queda persistido.

---

### 2.4 `GET /api/contact`

Lista paginada de mensajes (sin auth — **no exponer en UI pública**; útil para debug/dev).

**Query params**
- `limit` — int, 1..200, default 50
- `skip` — int, >=0, default 0

**Response 200**
```json
{
  "total": 123,
  "items": [
    {
      "id": "uuid",
      "name": "...",
      "email": "...",
      "subject": "...",
      "message": "...",
      "created_at": "ISO8601",
      "email_sent": true
    }
  ]
}
```

Orden: `created_at` descendente.

---

### 2.5 `GET /api/stats/ping`

Incrementa en 1 el contador de visitas y lo devuelve.

**Response 200**
```json
{ "visits": 1234 }
```

Implementación: upsert en `stats` con `_id: "visits"`, `$inc: { count: 1 }`.

---

## 3. Data Models

### 3.1 `ContactMessage` (MongoDB `contact_messages`)

```python
class ContactMessage(BaseModel):
    id: str          # uuid4
    name: str
    email: str
    subject: str     # can be ""
    message: str
    created_at: datetime  # UTC
    email_sent: bool      # true si SMTP envió OK
```

Collection schema equivalente:
```json
{
  "_id": "uuid4",
  "id": "uuid4 (duplicated for pydantic)",
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "created_at": "datetime",
  "email_sent": true
}
```

### 3.2 `stats` (MongoDB `stats`)

Documento único:
```json
{ "_id": "visits", "count": 1234 }
```

---

## 4. Frontend ↔ Backend Integration

### `Contact.jsx`
Envía `POST /api/contact` vía Axios con timeout de 10s. Si falla, guarda el mensaje en `localStorage` bajo `farley_messages` como fallback.

```js
await axios.post(`${API}/contact`, form, { timeout: 10000 });
```

- `form.website` (honeypot) siempre viene como `""` para usuarios reales.
- En error 429 el toast cambia su título a "Demasiados mensajes".

### Otras secciones
No hay integración backend. Todo el contenido viene de `frontend/src/data/mock.js`.

---

## 5. Environment Variables

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGO_URL` | Connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Nombre de la DB | `test_database` |
| `CORS_ORIGINS` | CORS allowed | `*` |
| `SMTP_HOST` | Gmail SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | 465 (SSL) o 587 (STARTTLS) | `465` |
| `SMTP_USER` | Email remitente (debe ser el Gmail con app password) | `frlpiedrahita@gmail.com` |
| `SMTP_PASSWORD` | App password de Gmail (sin espacios) | `infwmmgpgcydbepu` |
| `SMTP_FROM_NAME` | Nombre mostrado en el "From" | `Farley Portfolio` |
| `CONTACT_TO_EMAIL` | Dirección destino | `frlpiedrahita@gmail.com` |

### Frontend (`frontend/.env`)

| Variable | Descripción |
|----------|-------------|
| `REACT_APP_BACKEND_URL` | Base URL pública del backend (ruteo k8s ingress: `/api` → :8001) |

---

## 6. Fuera de alcance (actual)

- Auth / admin panel.
- Notificaciones push / Slack webhook.
- Rate limit persistente entre reinicios (se perderá estado al reiniciar backend — aceptable para MVP).
- Tests automatizados formales.
- i18n backend (los mensajes de error están hardcodeados en español).
