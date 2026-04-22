# Farley Portfolio - Backend Contracts

## Scope
El portafolio es mayormente estático (contenido en `frontend/src/data/mock.js`). El backend cubre:
1. **Contacto** — guardar mensajes recibidos desde el formulario.
2. **Stats / visitas** — contador simple de visitas (opcional, utilitario).

Todo lo demás (profile, skills, projects, experience, certifications) permanece en `mock.js` para facilitar edición por el propietario.

## Mock actualmente
- `Contact.jsx` → guarda en `localStorage` bajo `farley_messages`.
- Toast local.

## Cambios frontend tras integración
- `Contact.jsx` hará `POST ${REACT_APP_BACKEND_URL}/api/contact` con el payload.
- Si falla red, mantiene toast de error y guarda en localStorage como fallback.
- Eliminar `localStorage.setItem(...)` como único canal.

## API Contracts

### 1. POST /api/contact
Crea un nuevo mensaje de contacto.

**Request body**
```json
{
  "name": "string (1..100)",
  "email": "email",
  "subject": "string (0..200, optional)",
  "message": "string (1..5000)"
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
  "created_at": "ISO8601"
}
```

**Errors**
- 422 validación (campos faltantes o email inválido).
- 500 error DB.

### 2. GET /api/contact (admin/dev util)
Lista mensajes (no expuesto en UI, solo para verificación). Paginado simple.

**Query params**
- `limit` (int, default 50, max 200)
- `skip` (int, default 0)

**Response 200**
```json
{
  "total": 0,
  "items": [ { "id": "...", "name": "...", ... } ]
}
```

### 3. GET /api/stats/ping
Registra una visita sumando 1 a un contador e devuelve el total. Útil para demo de conexión frontend↔backend.

**Response 200**
```json
{ "visits": 1234 }
```

## MongoDB Collections

### `contact_messages`
```
{
  _id: string (uuid4),
  name: string,
  email: string,
  subject: string | "",
  message: string,
  created_at: datetime (UTC),
  ip: string | null   // opcional, no usado en MVP
}
```

### `stats`
Documento único con `_id: "visits"`:
```
{ _id: "visits", count: int }
```

## Validación backend (pydantic)
- `name`: min 1, max 100, strip
- `email`: EmailStr
- `subject`: optional, max 200
- `message`: min 1, max 5000, strip

## Integración Frontend
Archivo: `frontend/src/components/Contact.jsx`
```js
await axios.post(`${API}/contact`, payload);
```
`API = ${REACT_APP_BACKEND_URL}/api` (ya presente en App.js).

## Fuera de alcance MVP
- Auth/admin dashboard.
- Envío de email real (SendGrid/SMTP) — el mensaje solo se persiste en MongoDB por ahora.
- Rate limiting.
