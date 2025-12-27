# Phase 2: Web Application - Claude Guide

## Overview
Modern web app with Next.js frontend and FastAPI backend.

## Before You Start
1. Read: `@specs/phases/phase-2-web.md`
2. Read: `@specs/features/task-crud.md` + `@specs/features/authentication.md`
3. Read: `@specs/api/rest-endpoints.md`
4. Read: `@specs/database/schema.md`
5. Read: `@specs/ui/components.md` + `@specs/ui/pages.md`

## Implementation Order

### Backend
1. Set up FastAPI project
2. Reuse models from `@skills/models/`
3. Implement authentication (JWT)
4. Create REST API endpoints
5. Set up Alembic migrations
6. Write tests

### Frontend
1. Set up Next.js project
2. Create layout and components
3. Implement authentication pages
4. Build dashboard and task pages
5. Connect to API
6. Write tests

## Run Locally
```bash
# Backend
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn src.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Key Differences from Phase 1
- Multi-user (authentication required)
- PostgreSQL instead of SQLite
- Web UI instead of CLI
- RESTful API

## Next Phase
Phase 3 adds chatbot interface using MCP.
