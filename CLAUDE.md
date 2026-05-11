# TodoSaaS — Claude Code Guide

## Project Overview
Full-stack Todo SaaS MVP.
- **api/** — FastAPI + SQLAlchemy (async) + PostgreSQL
- **web/** — React 18 + Vite + Tailwind CSS (dark mode via `class` strategy)
- Deploy: Railway (API) + Vercel (web)

## Stack Quick Reference

| Layer | Key Libraries |
|---|---|
| Backend | FastAPI, SQLAlchemy 2 (async), asyncpg, Alembic, python-jose, passlib |
| Frontend | React 18, Vite, Tailwind 3, Zustand, react-hook-form, axios, react-hot-toast |
| Auth | JWT (Bearer token), stored in Zustand + localStorage via persist middleware |

## Dev Setup

### Backend
```bash
cd api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in DATABASE_URL, SECRET_KEY
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend
```bash
cd web
npm install
cp .env.example .env   # set VITE_API_URL if not using vite proxy
npm run dev
```

## Architecture Decisions

- **Async SQLAlchemy** — all DB calls are `async/await`; use `AsyncSession` everywhere
- **JWT in Authorization header** — `Bearer <token>`; no cookies (easier for Vercel/Railway CORS)
- **Zustand** — lightweight state; `persist` middleware for auth token; no Redux
- **Tailwind dark mode** — `darkMode: "class"` in `tailwind.config.ts`; toggled by ThemeStore on `<html>`
- **Alembic** — generate migrations: `alembic revision --autogenerate -m "description"`

## API Routes

```
POST   /api/v1/auth/register   → { access_token, user }
POST   /api/v1/auth/login      → { access_token, user }
GET    /api/v1/auth/me         → User

GET    /api/v1/todos/          → Todo[]
POST   /api/v1/todos/          → Todo
PATCH  /api/v1/todos/:id       → Todo
DELETE /api/v1/todos/:id       → 204
```

## MCP Servers (AI Workflow)

Configure env vars before using:
- **GitHub MCP** — `GITHUB_TOKEN` — create/manage issues, PRs
- **Figma MCP** — `FIGMA_API_KEY` — read designs and generate components
- **Linear MCP** — `LINEAR_API_KEY` — sync tasks with Linear issues

## Common Tasks for Claude Code

### Add a new feature
1. Create Linear issue (via Linear MCP or manually)
2. Check Figma design (via Figma MCP)
3. Add DB model in `api/app/models/`
4. Add schema in `api/app/schemas/`
5. Add service in `api/app/services/`
6. Add router in `api/app/routers/` and register in `main.py`
7. Run `alembic revision --autogenerate -m "add feature"`
8. Add frontend API call in `web/src/api/`
9. Update Zustand store if needed
10. Add/update component

### Generate migration
```bash
cd api && alembic revision --autogenerate -m "describe change"
```

### Deploy
- **API**: push to `main` → Railway auto-deploys via `railway.toml`
- **Web**: push to `main` → Vercel auto-deploys; set `VITE_API_URL` in Vercel env vars

## Environment Variables

### api/.env
```
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname
SECRET_KEY=<32+ random chars>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### web/.env
```
VITE_API_URL=https://your-api.railway.app/api/v1
```
