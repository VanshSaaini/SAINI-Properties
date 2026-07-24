# Saini Properties

A full-stack real estate listing platform: a React + Vite frontend for browsing properties and submitting inquiries, backed by a Java Spring Boot REST API with PostgreSQL.

```
saini-properties/
├── saini-properties-backend/   # Spring Boot REST API (Java 21)
└── saini-properties-frontend/  # React 19 + Vite SPA
```

**Live:** frontend on [Vercel](https://vercel.com), backend on [Render](https://render.com) (Docker deploy).

---

## 📋 Prerequisites

- Node.js v18+ and npm
- Java JDK 21
- Apache Maven (or use the bundled `./mvnw` — no local install needed)
- A PostgreSQL database (local, or a hosted instance e.g. Render/Supabase/Neon)
- A [Brevo](https://www.brevo.com) account (free tier) for the inquiry-email feature
- Git

---

## 📥 Clone the Repository

```bash
git clone https://github.com/<your-username>/saini-properties.git
cd saini-properties
```

---

## ☕ Backend

`saini-properties-backend/` — a Spring Boot 3.5 REST API.

### Tech stack

| Layer | Technology |
|---|---|
| Language / runtime | Java 21 |
| Framework | Spring Boot 3.5.5 |
| Security | Spring Security (BCrypt password hashing) |
| Persistence | Spring Data JPA + **PostgreSQL** |
| Boilerplate reduction | Lombok |
| Email delivery | [Brevo](https://www.brevo.com) transactional email HTTP API |
| Build | Maven (`./mvnw`) |
| Deployment | Docker → Render |

### Project layout

```
src/main/java/com/sainiproperties/saini_properties_backend/
├── SainiPropertiesBackendApplication.java   # entry point
├── config/
│   └── SecurityConfig.java                  # security filter chain, CORS
├── controller/
│   ├── userAuth.java                        # /auth/register, /auth/login
│   └── QueryController.java                 # /api/contact-query
├── DTO/
│   ├── UserDto.java
│   ├── LoginRequest.java
│   └── QueryRequest.java
├── entity/
│   └── User.java                            # `users` table
├── repository/
│   └── UserRepo.java                        # Spring Data JPA repository
├── services/
│   ├── authService.java  (+ impl)           # registration + login used by userAuth controller
│   └── userService.java  (+ impl)           # standalone create-user logic; not currently wired to any controller
└── helper/
    └── UserMapper.java                      # entity ↔ DTO mapping
```

### Database setup

The app uses PostgreSQL via environment variables (not hardcoded credentials). Create a database, then set:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/saini_properties
export DB_USERNAME=your_pg_username
export DB_PASSWORD=your_pg_password
```

`spring.jpa.hibernate.ddl-auto=update` is set, so tables are created/updated automatically on startup — no manual schema needed for local dev.

### Email: why an HTTP API instead of SMTP

The property inquiry form emails the admin for every submitted query. This was originally built with `JavaMailSender` over SMTP (`smtp.gmail.com:587`), which works locally but **fails in production**: Render's free-tier web services block outbound traffic on SMTP ports (25, 465, 587) to prevent spam abuse — so the app would throw a connection error / 500 for every inquiry once deployed. To avoid needing a paid Render plan, `QueryController` instead sends mail over plain HTTPS via Brevo's transactional email API (`POST https://api.brevo.com/v3/smtp/email`), which isn't affected by that block and has a generous free tier (300 emails/day).

**Setup:**
1. Create a free account at [brevo.com](https://www.brevo.com).
2. Go to **Senders, Domains & Dedicated IPs → Senders**, add the admin email address, and verify it via the confirmation email Brevo sends to that inbox. (Brevo will reject sends from an unverified address.)
3. Go to **SMTP & API → API Keys** and generate a **v3 API key** (starts with `xkeysib-`) — this is different from the "SMTP key" shown on the same page; make sure you copy the API key, not the SMTP credential.
4. Set it as an environment variable: `BREVO_API_KEY=xkeysib-...`

### REST API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Authenticate a user; returns the user profile (no JWT is issued — see [Authentication](#-authentication) below) |
| `POST` | `/api/contact-query` | Public | Submit a property inquiry; emails the admin via Brevo |

`SecurityConfig` permits `/error`, `/auth/**`, `/api/contact-query`, `/api/inquiries`, and `/api/properties/**` without authentication; every other route requires it. `/error` is explicitly permitted so unmatched routes return a clean `404` instead of Spring Security turning them into a misleading `403`.

CORS is configured centrally in `SecurityConfig` (`corsConfigurationSource` bean), allowing `localhost:5173`, `localhost:3000`, and any `*.vercel.app` origin.

> **Note:** there is currently no backend endpoint or entity for property *listings* — `/api/properties/**` has no controller and returns `404`. The frontend already handles this by falling back to its local `propertiesData.js` file (see [Frontend](#-frontend) below).

### Data model

**`users`** (`entity/User.java`)

| Column | Type | Notes |
|---|---|---|
| `id` | `BIGINT` | Primary key, auto-generated |
| `full_name` | `VARCHAR(100)` | Not null |
| `email` | `VARCHAR(150)` | Not null, unique |
| `password` | `VARCHAR` | BCrypt hash, not null |

### Environment variables

| Variable | Purpose |
|---|---|
| `DB_URL` | PostgreSQL JDBC URL |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `BREVO_API_KEY` | Brevo transactional email API key (v3) |
| `PORT` | Server port (Render sets this automatically; defaults to `8080` locally) |

### Running locally

```bash
cd saini-properties-backend

export DB_URL=jdbc:postgresql://localhost:5432/saini_properties
export DB_USERNAME=your_pg_username
export DB_PASSWORD=your_pg_password
export BREVO_API_KEY=xkeysib-your-key

./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`.

### Build for production

```bash
cd saini-properties-backend
./mvnw clean package
java -jar target/saini-properties-backend-0.0.1-SNAPSHOT.jar
```

### Deployment

A multi-stage `Dockerfile` builds the jar with Maven on `eclipse-temurin:21`, then runs it on a slim `eclipse-temurin:21-jre` image. On Render, this is deployed as a **Docker web service** with the environment variables above configured in the dashboard.

---

## ⚛️ Frontend

`saini-properties-frontend/` — a React 19 + Vite single-page app.

### Tech stack

React 19 · React Router 7 · Axios · Tailwind CSS 4 · react-icons

### Routes

| Path | Page | Protected? |
|---|---|---|
| `/` | `Home.jsx` | No |
| `/login` | `Login.jsx` | No |
| `/register` | `Register.jsx` | No |
| `/properties` | `Properties.jsx` | No |
| `/property-layout/:id` | `PropertyDetails.jsx` | **Yes** (redirects to `/login` if not "authenticated") |
| `/services` | `Services.jsx` | No |
| `/reviews` | `Reviews.jsx` | No |

### Key pieces

- `src/services/authService.js` — shared Axios instance (`API`), base URL from `VITE_API_BASE_URL`
- `src/pages/PropertyDetails.jsx` — property detail page with the inquiry form; POSTs to `/api/contact-query`; fetches `/api/properties/:id` and falls back to `src/data/propertiesData.js` if that 404s
- `src/data/propertiesData.js` — static property listings used as the current source of truth for listing content
- `src/routes/AppRoutes.jsx` — route definitions
- `src/components/ProtectedRoute.jsx` — route guard that checks for a `token` key in `localStorage`

### ⚙️ API base URL configuration

If the backend runs on a different host/port, update the Vite env files (not the Axios call directly):

| File | `VITE_API_BASE_URL` |
|---|---|
| `.env` (local dev) | `http://localhost:8080` |
| `.env.production` (deployed) | your Render backend URL |

`src/services/authService.js` reads this automatically via `import.meta.env.VITE_API_BASE_URL`.

### Running locally

```bash
cd saini-properties-frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

### Build for production

```bash
cd saini-properties-frontend
npm run build
```

Output goes to `dist/`.

### Deployment

Deployed on Vercel; `vercel.json` rewrites all routes to `index.html` for client-side routing.

---

## ▶️ Running the complete app locally

**Terminal 1 — backend**
```bash
cd saini-properties-backend
./mvnw spring-boot:run
```
→ `http://localhost:8080`

**Terminal 2 — frontend**
```bash
cd saini-properties-frontend
npm install
npm run dev
```
→ `http://localhost:5173`

---

## 🔑 Authentication

- Registration (`/auth/register`) and login (`/auth/login`) are handled by Spring Security + BCrypt password hashing on the backend.
- **There is no JWT or session token issued.** On successful login, the frontend stores the raw user profile response (from `/auth/login`) under `localStorage["token"]` and treats its mere presence as "logged in" — `ProtectedRoute.jsx` only checks that this key exists, it does not verify anything with the backend. This means:
  - Protected routes (`/property-layout/:id`) are a client-side UX gate only, not a real access control mechanism — the underlying API endpoints they call are already public.
  - There's no logout-everywhere, expiry, or server-side session invalidation.
  - If you need real protected resources later, this is the first thing to replace (e.g. issue a JWT from `/auth/login` and validate it in `SecurityConfig`).

---

## 🌍 Deployment summary

| Component | Platform | Notes |
|---|---|---|
| Frontend | Vercel | SPA rewrite via `vercel.json` |
| Backend | Render | Docker web service; SMTP ports blocked on free tier, hence Brevo HTTP email |
| Database | PostgreSQL | Any managed Postgres (Render, Supabase, Neon, etc.) works via `DB_URL` |

---

## 🧭 Known gaps / next steps

- No `Property` entity or `/api/properties` CRUD endpoints — listings are static on the frontend (`propertiesData.js`).
- Authentication has no real token/session mechanism (see [Authentication](#-authentication)) — `ProtectedRoute` is cosmetic, not a security boundary.
- `userService.java` / `userServiceImpl.java` implement a `createUser` flow that duplicate-checks email, but nothing currently calls it — `userAuth` controller uses `authService.registerUser` instead, which doesn't duplicate-check email before insert (relies on the DB's `unique` constraint to reject it).
- No automated tests beyond the default Spring Boot test scaffold (`SainiPropertiesBackendApplicationTests.java`).

---

## 📞 Contact

**Developer:** Vansh Saini
GitHub: https://github.com/<your-username>
Email: vs7579030670@gmail.com