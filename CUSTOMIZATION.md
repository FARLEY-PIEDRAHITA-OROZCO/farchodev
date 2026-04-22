# Customization Guide

> Cómo editar contenido, colores, email, y demás aspectos del portafolio sin romper nada.

---

## 1. Editar contenido (lo más común)

Todo el contenido está centralizado en:

```
frontend/src/data/mock.js
```

Se exportan 5 objetos clave:

### 1.1 `profile`
Info personal, redes, y stats del hero.

```js
export const profile = {
  name: "Farley Piedrahita Orozco",
  role: "QA Software Developer & Cybersecurity Student",
  tagline: "Breaking software to make it stronger...",
  location: "Colombia",
  email: "frlpiedrahita@gmail.com",
  phone: "+57 300 000 0000",
  bio: "...",
  social: {
    github: "https://github.com/...",
    linkedin: "https://linkedin.com/in/...",
    twitter: "https://twitter.com/...",
    tryhackme: "https://tryhackme.com/p/..."
  },
  stats: [
    { label: "Test Cases Automated", value: "420+" },
    // ...
  ]
};
```

### 1.2 `skills`
Tres categorías: `qa`, `security`, `languages`. Cada item tiene `name` y `level` (0..100).

### 1.3 `projects`
Array de proyectos. Cada uno:
```js
{
  id: 1,
  title: "...",
  category: "QA Automation" | "Cybersecurity",
  description: "...",
  tags: ["Playwright", "..."],
  image: "https://...",        // URL de imagen (Unsplash, tu CDN, etc.)
  github: "#",                  // link al repo
  demo: "#"                     // link demo
}
```
El filtro automático de la UI usa `category`. Añadir/quitar proyectos o categorías es seguro.

### 1.4 `experience`
Array para el timeline zigzag. Cada trabajo:
```js
{
  id: 1,
  company: "...",
  role: "...",
  period: "2023 — Present",
  location: "Remote",
  description: "...",
  achievements: ["logro 1", "logro 2"]
}
```

### 1.5 `certifications`
Array de credenciales:
```js
{
  id: 1,
  name: "ISTQB Foundation",
  issuer: "ISTQB",
  year: "2023",
  credentialId: "CTFL-XXX" | "In Progress",
  icon: "ShieldCheck"   // nombre de ícono de lucide-react
}
```
Los íconos válidos están registrados en `Certifications.jsx` → `iconMap`. Si necesitas más, aíúdelos al import.

---

## 2. Cambiar colores / tema

### 2.1 Paleta general
Definida con variables CSS en `frontend/src/index.css` dentro de `@layer base :root`. Cambiar ahí afecta los componentes shadcn.

### 2.2 Overrides de modo día
En el mismo `index.css`, dentro de `html.theme-day ...` hay selectores que mapean las clases oscuras a sus equivalentes claros. Si añades una clase nueva (`bg-[#XXXXXX]`) puede que necesites un override específico para light mode.

### 2.3 Acento cyan
El acento primario es `cyan-400` (`#22D3EE`) de Tailwind. Si cambia, busca y reemplaza en:
- Componentes JSX (`text-cyan-400`, `bg-cyan-400`, `border-cyan-400/*`)
- `index.css` overrides
- `HackerRoom.jsx` (colores hex de materiales Three.js)

---

## 3. Modo día/noche en la escena 3D

La lámpara del escritorio es clicable vía raycaster. El estado se lee del `ThemeContext` y sincroniza:
- Iluminación (ambient, point lights, luz de lámpara y lámpara colgante)
- Colores de paredes, piso, cielo
- Cortina enrollable (sube en día, baja en noche)
- Opacidad del skyline y estrellas
- Sol vs luna con cráteres

Ajustes disponibles en `HackerRoom.jsx` → función `getTargets(theme)`.

---

## 4. Cambiar proveedor de email

El backend usa Gmail SMTP via `smtplib` (stdlib). Cambiar proveedor:

### 4.1 SMTP compatible (Outlook, Zoho, SendGrid SMTP, etc.)
Edita `backend/.env`:
```env
SMTP_HOST="smtp.provider.com"
SMTP_PORT="587"                   # 465 (SSL) o 587 (STARTTLS)
SMTP_USER="tu-user"
SMTP_PASSWORD="tu-password"
```
No requiere cambios de código. `mail.py` maneja ambos puertos.

### 4.2 Cambiar a API HTTP (SendGrid API, Resend, Mailgun)
Agregar lib (`pip install sendgrid` o `requests`) y reemplazar `mail._send_sync` por la llamada HTTP. Mantener la misma firma `send_contact_email(...) -> bool`.

### 4.3 Gmail app password nuevo
1. Entra a https://myaccount.google.com/apppasswords
2. Genera uno para "Mail" o "Other".
3. Copia sin espacios al `.env`:
   ```env
   SMTP_PASSWORD="infwmmgpgcydbepu"  # 16 chars, sin espacios
   ```
4. Reiniciar backend: `sudo supervisorctl restart backend`.

---

## 5. Ajustar anti-spam

En `backend/server.py`:
```python
_RATE_LIMIT_MAX = 5       # max requests
_RATE_LIMIT_WINDOW = 3600 # ventana en segundos
```
Cambia los números a tu gusto (ej: 20 req/h para testing).

**Honeypot**: el campo hidden está en `Contact.jsx` dentro de un div con clase `sr-only`. Los bots lo llenan automáticamente.

---

## 6. Añadir nuevas secciones

1. Crear `frontend/src/components/MySection.jsx` con `id="my-section"` en la `<section>`.
2. Importar en `App.js` dentro del `<Portfolio />`.
3. Añadir un link al `links[]` en `Navbar.jsx`:
   ```js
   { label: "Mi sección", href: "#my-section", id: "my-section" }
   ```
4. El scroll-spy detectará automáticamente la nueva sección.

---

## 7. SEO y meta tags

Archivo: `frontend/public/index.html`

- `<title>` y `<meta name="description">`: personaliza a tu preferencia.
- Open Graph (`og:title`, `og:description`, `og:image`): útil para previews en LinkedIn/Twitter. Añade una imagen próxima en `public/og.jpg` y confígurala.
- JSON-LD `Person`: actualiza con tus datos reales (sameAs para redes).

Favicon en `public/favicon.svg`. Para dashes/iOS puedes añadir un `favicon.ico` clásico.

---

## 8. Animaciones

- **Scroll-reveal**: usa el componente `<Reveal>`. Acepta `delay` (ms) y `threshold`.
- **Tilt cards**: en `Projects.jsx`, función `TiltCard` — ajustar `rotY`/`rotX` factor para más/menos intensidad.
- **3D scene**: framerate 60 con `requestAnimationFrame`. Para low-end devices, considera bajar el `STAR_COUNT` y `PARTICLE_COUNT`.

Honor `prefers-reduced-motion`:
- `index.css` tiene una regla que desactiva transiciones en la reveal.
- También `Reveal.jsx` detecta la preferencia y salta la animación.

---

## 9. Deployment checklist

- [ ] Rotar `SMTP_PASSWORD` si fue expuesto.
- [ ] Cambiar `CORS_ORIGINS` de `*` al dominio definitivo.
- [ ] Servir HTTPS (Let's Encrypt o provider).
- [ ] Minify: `yarn build` genera `frontend/build/`.
- [ ] Configurar mongo con auth real + backups.
- [ ] (opcional) Migrar rate limiter a Redis para múltiples instancias.
- [ ] Añadir analytics (Plausible, Umami) en `index.html`.
- [ ] Añadir `og:image` real con una imagen del portafolio.

---

## 10. Troubleshooting

| Problema | Solución |
|----------|---------|
| Email no llega | Revisar `tail -n 100 /var/log/supervisor/backend.*.log`, verificar app password de Gmail, que el puerto 465 no esté bloqueado. |
| 3D scene no renderiza | Inspeccionar consola, puede ser conflicto con el plugin `visual-edits` si se modifica código JSX de Three.js. Mantener `HackerRoom.jsx` con API imperativa (pure three.js en useEffect). |
| Hot reload no refresca | `sudo supervisorctl restart frontend`. Si persiste, `rm -rf frontend/node_modules/.cache`. |
| 422 validation error | Ver mensaje del backend en los logs. Campos: name 1..100, email válido, message 1..5000. |
| 429 Too Many Requests | Esperar 1 hora o reducir `_RATE_LIMIT_MAX` temporalmente. |
