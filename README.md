# AI Startup Idea Validator

Full-stack MVP that evaluates startup ideas and returns a structured AI-generated validation report.

## Live Links

- Frontend (Vercel): `add-your-link-here`
- Backend (Render): `add-your-link-here`

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- AI Integration: Groq API
- Database: PostgreSQL (Neon) + Prisma ORM
- Export: jsPDF

## Core Features

- Submit startup ideas (`title`, `description`)
- Generate structured AI report with:
  - problem summary
  - customer persona
  - market overview
  - competitor list (exactly 3)
  - suggested tech stack
  - risk level
  - profitability score (0-100)
  - justification
- Dashboard with search and status filtering
- Detail page with regenerate, copy summary, and PDF export
- Mobile responsive layout + dark/light theme toggle

## Project Structure

- `frontend/` - React client UI
- `backend/` - Express API + Prisma + Groq service
- `render.yaml` - Render deployment blueprint

## Environment Variables

Copy examples and fill values:

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`

Backend (`backend/.env`):

```env
PORT=4000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require&schema=idea_validator
GROQ_API_KEY=<your_groq_api_key>
```

Frontend (`frontend/.env`):

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## Local Development

### 1) Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## API Endpoints

- `GET /api/health` - service and DB health
- `POST /api/ideas` - create idea + generate report
- `GET /api/ideas` - list all ideas
- `GET /api/ideas/:id` - get full report by idea id
- `POST /api/ideas/:id/regenerate` - regenerate report
- `DELETE /api/ideas/:id` - delete idea

## Deployment Guide

### A) Deploy Backend to Render

1. Push repo to GitHub.
2. Create a new **Web Service** in Render.
3. Connect your GitHub repo.
4. Set root directory to `backend` (or use `render.yaml` at repo root).
5. Set environment variables in Render:
   - `PORT=4000`
   - `CLIENT_URL=https://<your-vercel-domain>`
   - `DATABASE_URL=<your-neon-postgres-url>`
   - `GROQ_API_KEY=<your-groq-key>`
6. Deploy and confirm health endpoint:
   - `https://<render-domain>/api/health`

### B) Deploy Frontend to Vercel

1. Import the same GitHub repo in Vercel.
2. Set project root to `frontend`.
3. Add environment variable:
   - `VITE_API_BASE_URL=https://<your-render-domain>/api`
4. Deploy.
5. `frontend/vercel.json` handles SPA route rewrites.

## Prompt Strategy

The backend sends a strict JSON-only prompt to Groq with fixed output fields and validates model output using Zod. Invalid output is rejected and reported as generation failure, improving response consistency for the assignment rubric.

## Testing Checklist

- Submit a new idea and receive generated report
- View ideas in dashboard and test search/filter
- Open idea detail page and confirm all sections render
- Click regenerate and confirm report updates
- Export PDF and verify downloadable file

## Notes

- Do not commit `.env` files.
- Rotate credentials if secrets are ever exposed.

