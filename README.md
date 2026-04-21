# AI Experience Assistance

Aplicacion web full-stack para generar briefs de marca con IA.  
El usuario completa un formulario de estrategia, el backend construye un brief creativo en JSON, genera imagenes (logo + mockup), guarda todo en base de datos y presenta un resultado visual listo para exportar a PDF.

## Que hace la app

- Genera un brief creativo usando IA (Groq).
- Propone paleta de colores, tipografias y user persona.
- Genera assets visuales (logo y mockup) con Pollinations.
- Guarda cada brief en base de datos MySQL.
- Permite descargar el resultado como PDF.

## Stack y arquitectura

### Frontend (`/frontend`)
- React + Vite
- React Router
- Axios
- CSS custom (estilo dark + cards)
- Pantallas principales:
  - `Home`: formulario para definir marca.
  - `Result`: visualizacion completa del brief y descarga de PDF.
  - `Wait`: overlay de carga con estados de progreso.

### Backend (`/backend`)
- Node.js + Express
- MySQL (`mysql2`)
- Puppeteer para generacion de PDF
- Endpoints principales:
  - `POST /api/generar`: crea brief + imagenes + persistencia.
  - `GET /api/brief/:id`: recupera brief por id.
  - `GET /api/generar-pdf?id=...`: renderiza pagina de resultado y exporta PDF.

## Flujo funcional

1. El usuario completa el formulario en `Home`.
2. Frontend envia datos a `POST /api/generar`.
3. Backend:
   - construye prompt y llama a Groq,
   - parsea JSON del brief,
   - genera logo/mockup,
   - guarda brief en DB y responde `{ id, brief }`.
4. Frontend navega a `/resultado` y muestra el brief.
5. Al descargar PDF, se llama a `/api/generar-pdf?id=<id>`.

## Variables de entorno

Actualmente `backend/db.js` tiene credenciales hardcodeadas para entorno local:

- host: `127.0.0.1`
- user: `root`
- password: `""`
- database: `ux_brief`

Para produccion o equipo, conviene moverlo a `backend/.env` con este formato:

```env
GROQ_API_KEY=tu_api_key
PORT=4000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=tu_base
```

> Tambien tendrias que actualizar `backend/db.js` para leer `process.env`.

## Instalacion y ejecucion local

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

## Estructura del repositorio

```text
ux/
├─ backend/
│  ├─ App.js
│  ├─ db.js
│  ├─ package.json
│  └─ uploads/ (ignorado por git)
├─ frontend/
│  ├─ src/
│  ├─ public/
│  └─ package.json
└─ README.md
```

## Preparado para GitHub

- `node_modules` ignorados globalmente.
- `.env` y archivos locales fuera del versionado.
- `backend/uploads/` ignorado para no subir imagenes generadas.
- README documentado con producto, arquitectura y pasos de setup.
