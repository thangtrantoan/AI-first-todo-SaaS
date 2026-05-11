# TodoSaaS

A full-stack Todo SaaS MVP built with FastAPI, React 18, and PostgreSQL.

## Stack

| Layer    | Tech                                              |
| -------- | ------------------------------------------------- |
| Backend  | FastAPI · SQLAlchemy 2 (async) · Alembic · asyncpg |
| Frontend | React 18 · Vite · Tailwind CSS · Zustand          |
| Auth     | JWT (Bearer token)                                |
| Deploy   | Railway (API) · Vercel (web)                      |

## Quick Start

### Backend

```bash
cd api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in DATABASE_URL and SECRET_KEY
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```bash
cd web
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev
```

## API

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me

GET    /api/v1/todos/
POST   /api/v1/todos/
PATCH  /api/v1/todos/:id
DELETE /api/v1/todos/:id
```

## Environment Variables

**api/.env**
```
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname
SECRET_KEY=<32+ random chars>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**web/.env**
```
VITE_API_URL=https://your-api.railway.app/api/v1
```
