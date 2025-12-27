# Phase 2: Web Application

Next.js + FastAPI todo application.

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
alembic upgrade head
uvicorn src.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with API URL
npm run dev
```

### Using Docker Compose
```bash
docker-compose up
```

## URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Auth**: JWT

## Specs
See `@specs/phases/phase-2-web.md`
