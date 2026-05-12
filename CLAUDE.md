# TodoSaaS — Claude Code Guide

## Project Overview
Full-stack Todo SaaS MVP.
- **api/** — FastAPI + SQLAlchemy (async) + PostgreSQL
- **web/** — React 18 + Vite + Tailwind CSS (dark mode via `class` strategy)
- Deploy: Railway (API) + Vercel (web)

## Workflow Rules
### Before Coding
Read the entire task carefully
Identify affected backend/frontend layers
Search existing implementation patterns first
Create a short implementation plan
Do NOT start coding immediately for large changes
Ask questions if requirements are ambiguous
### During Coding
Make the smallest reasonable change
Reuse existing utilities/components/hooks first
Follow existing folder structure and patterns
Preserve current architecture consistency
Prefer simple and maintainable solutions
Avoid unnecessary abstraction
### After Coding
Run lint/typecheck/tests
Review edge cases and error handling
Summarize changed files
Generate commit message
Mention migrations/env changes if any

## Backend Rules
### Stack
FastAPI
SQLAlchemy 2 async
PostgreSQL
Alembic
### Conventions
Always use AsyncSession
Keep routers thin
Business logic belongs in services/
Schemas belong in schemas/
DB models belong in models/
Avoid raw SQL unless necessary
### Errors
Use HTTPException
Return clear API errors
Avoid generic 500 errors
### Database
All DB changes require Alembic migration
Use async/await consistently

## Frontend Rules
### Stack
React 18
Zustand
react-hook-form
Tailwind CSS
axios
### Conventions
Reuse shared components first
Keep business logic separated from UI
Use react-hook-form + zod
Use Zustand only for shared client state
Avoid introducing new state libraries
### API
Centralize API logic in web/src/api/
Do not use raw fetch directly
### Styling
Use existing Tailwind patterns
Preserve dark mode compatibility
Avoid inline styles unless necessary

## Folder Responsibilities
### Backend
models/ → database models
schemas/ → request/response schemas
services/ → business logic
routers/ → API endpoints
### Frontend
components/ → reusable UI
pages/ → route-level pages
stores/ → Zustand stores
api/ → API clients
hooks/ → reusable hooks

## Testing Rules
Add/update tests for business logic
Cover auth and permission edge cases
Do not add snapshot tests
Prefer focused unit tests

## Git Rules
### Commit Format
feat: add forgot password flow
fix: handle expired token redirect
refactor: simplify todo service
### PR Summary
Include:
- changed files
- migrations
- env changes
- breaking changes
- follow-up work

## Avoid
Do not refactor unrelated files
Do not rename files unnecessarily
Do not introduce new libraries without request
Do not create duplicate hooks/utilities/components
Do not change architecture without approval
Do not over-engineer small features

## MCP Workflow
### Linear MCP
When task ID is provided:

Fetch issue from Linear
Read acceptance criteria carefully
Follow implementation plan workflow
### Figma MCP
If Figma link exists:

Inspect target frame
Match spacing/layout/components closely
Reuse existing design system
### GitHub MCP
Before PR:

Review diff
Check for edge cases
Generate clean PR summary

## Task Execution Strategy
For every task:

Understand requirement
Inspect related code
Identify affected files
Create implementation plan
Implement incrementally
Run validation/tests
Review final diff

## Priority Order
When making decisions prioritize:

Existing project consistency
Simplicity
Maintainability
Performance
Cleverness last

## Important
If information is missing or ambiguous:

ask concise clarification questions
do not guess business logic
do not invent APIs or DB fields

## Stack Quick Reference

| Layer | Key Libraries |
|---|---|
| Backend | FastAPI, SQLAlchemy 2 (async), asyncpg, Alembic, python-jose, passlib |
| Frontend | React 18, Vite, Tailwind 3, Zustand, react-hook-form, zod, axios, react-hot-toast |
| Auth | JWT (Bearer token), stored in Zustand + localStorage via persist middleware |

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

### .env (root) — MCP tokens only, never commit
```
GITHUB_TOKEN=ghp_xxx
FIGMA_API_KEY=figd_xxx
LINEAR_API_KEY=lin_xxx
```
Load before starting Claude Code: `source .env`

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
