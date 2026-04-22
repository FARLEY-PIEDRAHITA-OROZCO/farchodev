# Farley Piedrahita Orozco — Portfolio

> Portafolio interactivo 3D para un QA Software Developer y estudiante junior de ciberseguridad.

![Dark mode hero](docs/preview-night.png)

---

## ✨ Features

- **Escena 3D isométrica** (Three.js puro) con una habitación de hacker: escritorio, monitor, laptop, biblioteca, cortina enrollable, reloj, partículas de código y más.
- **Click interactivo en la lámpara** que alterna **modo día/noche** en toda la página (lerp suave de luces, paredes, cielo, cortina y skyline).
- **Dark mode + Light mode** global sincronizado con la escena (persistido en localStorage).
- **Scroll-spy navbar** que resalta la sección activa al hacer scroll.
- **Scroll-reveal animations** (IntersectionObserver, respeta `prefers-reduced-motion`).
- **Mobile hero** con visual alternativo tipo terminal (la escena 3D se oculta en \<lg).
- **Contact form** con backend real:
  - Persistencia en MongoDB
  - Envío de email via Gmail SMTP
  - **Rate limiting** (5 requests/hora/IP)
  - **Honeypot** anti-spam
  - Fallback a localStorage si falla la red
- **SEO-ready**: meta tags, Open Graph, Twitter Cards, JSON-LD `Person` schema, favicon custom.

---

## 🏗 Tech Stack

| Capa | Stack |
|------|-------|
| Frontend | React 19 · React Router 7 · Tailwind CSS · shadcn/ui · lucide-react · Three.js · Axios |
| Backend | FastAPI · Pydantic 2 · Motor (MongoDB async) · smtplib (stdlib) |
| Database | MongoDB |
| Build | CRA + CRACO · Yarn |

---

## 📁 Project Structure

```
/app
├── backend/                 # FastAPI API
│   ├── server.py           # Routes, models, rate limiter
│   ├── mail.py             # SMTP helper for contact emails
│   ├── requirements.txt
│   └── .env                # SMTP + Mongo credentials (NOT committed)
│
├── frontend/                # React app
│   ├── public/
│   │   ├── index.html      # SEO meta, OG tags, JSON-LD schema
│   │   └── favicon.svg     # Custom terminal icon
│   └── src/
│       ├── App.js           # Router + theme provider
│       ├── App.css          # Reveal CSS, scrollbar
│       ├── index.css        # Tailwind base + day-mode overrides
│       ├── context/
│       │   └── ThemeContext.jsx
│       ├── hooks/
│       │   └── useActiveSection.js  # Scroll-spy hook
│       ├── data/
│       │   └── mock.js          # Portfolio content (edit here!)
│       └── components/
│           ├── Navbar.jsx
│           ├── Hero.jsx
│           ├── HackerRoom.jsx   # 3D scene (pure Three.js)
│           ├── MobileHeroVisual.jsx
│           ├── About.jsx
│           ├── Skills.jsx
│           ├── Projects.jsx
│           ├── Experience.jsx
│           ├── Certifications.jsx
│           ├── Contact.jsx
│           ├── Footer.jsx
│           ├── Reveal.jsx       # Scroll-reveal wrapper
│           └── ui/              # shadcn components
│
├── contracts.md             # API contracts + data shapes
├── CUSTOMIZATION.md         # How to edit content, colors, email provider
└── README.md                # (this file)
```

---

## 🚀 Setup & Run (Emergent environment)

El proyecto ya está configurado en este entorno y corre bajo `supervisor`. Los .env NO deben modificarse manualmente en producción.

### Prerequisites
- Python 3.11+
- Node 18+
- MongoDB corriendo localmente (ya provisionado en `mongodb://localhost:27017`)

### Environment variables

**`backend/.env`** (ya configurado):
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="frlpiedrahita@gmail.com"
SMTP_PASSWORD="<app password, no spaces>"
SMTP_FROM_NAME="Farley Portfolio"
CONTACT_TO_EMAIL="frlpiedrahita@gmail.com"
```

**`frontend/.env`** (no tocar):
```env
REACT_APP_BACKEND_URL=<provisionado por Emergent>
```

### Commands (dev)

```bash
# Restart services after env or dependency changes
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
sudo supervisorctl restart all

# Tail logs
tail -n 100 /var/log/supervisor/backend.*.log
tail -n 100 /var/log/supervisor/frontend.*.log

# Install new deps
cd /app/backend && pip install <pkg> && pip freeze > requirements.txt
cd /app/frontend && yarn add <pkg>
```

Los servicios tienen **hot reload** activado. Solo hace falta reiniciar al:
- Instalar dependencias
- Modificar archivos `.env`

---

## 🌐 API Quick Reference

Todas las rutas llevan prefijo `/api`. Base URL: `REACT_APP_BACKEND_URL`.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/` | Root — status check |
| GET | `/api/health` | Mongo ping |
| POST | `/api/contact` | Create contact message + send email |
| GET | `/api/contact` | List messages (paginated, dev-only) |
| GET | `/api/stats/ping` | Increment visit counter |

Ver [`contracts.md`](./contracts.md) para request/response detallado.

---

## 🎨 Design System

- **Tipografías**: Inter (body) + JetBrains Mono (mono/accentos)
- **Paleta base**:
  - Night bg: `#05070E` · `#070A14`
  - Day bg: `#F5F1E8` · `#EDE7D7`
  - Primary accent: Cyan `#22D3EE`
  - Secondary: Royal Blue `#3B82F6`
  - Foreground night: `#E2E8F0` · Foreground day: `#1E293B`
- **Radii**: `0.75rem` (base) · `1.5rem` (cards)
- **Shadows/Glass**: `bg-white/[0.03]` + `border-white/10` + `backdrop-blur-md`

Ver [`CUSTOMIZATION.md`](./CUSTOMIZATION.md) para cambiar colores, textos o proveedor de email.

---

## 🔒 Security & Anti-spam

- **Rate limit**: 5 requests/hora/IP en `/api/contact` (in-memory, basado en `X-Forwarded-For`).
- **Honeypot**: campo `website` oculto visualmente (sr-only). Si lo llenan, se responde 201 pero **no** se guarda ni se envía email.
- **Validación pydantic**: longitud de campos, email válido (`EmailStr`), strip de espacios.
- **CORS**: abierto a `*` (ajustar para producción si se requiere).

---

## 🧪 Testing

No hay suite formal de tests. Se recomienda usar el testing agent interno (`deep_testing_backend_v2`) antes de modificar endpoints:

```
Focus: POST /api/contact (honeypot, rate limit, email send)
Other endpoints to regress: GET /api/contact, /api/stats/ping, /api/health.
```

---

## 🚀 Deployment Notes

- Frontend: build con `yarn build` → servir estático (Vercel / Netlify / Nginx).
- Backend: uvicorn con gunicorn en producción; **cambiar** `SMTP_PASSWORD` a secrets seguros (no commitear).
- MongoDB: usar MongoDB Atlas o instancia auto-hospedada con backups.
- Rate limiter actual es in-memory → para múltiples instancias migrar a Redis.

---

## 📌 Roadmap (backlog)

- [ ] Contenido real (CV PDF, foto, links reales)
- [ ] Sección de blog / CTF writeups
- [ ] i18n (ES / EN)
- [ ] GitHub stats widget en vivo
- [ ] Easter egg terminal interactivo
- [ ] Analytics (Plausible)
- [ ] Admin dashboard para ver mensajes de contacto

---

## 👤 Author

**Farley Piedrahita Orozco**  
QA Software Developer · Cybersecurity Student  
📧 frlpiedrahita@gmail.com

---

## 📄 License

MIT (o la que prefieras establecer).
