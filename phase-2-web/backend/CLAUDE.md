# Phase 2 Backend - Claude Guide

## Overview
FastAPI backend for Hackathon II - Phase 2 Web Application

## Hackathon Requirements
- **Framework:** FastAPI
- **Data Layer:** SQLModel (production) / In-memory (demo)
- **Database:** Neon Serverless PostgreSQL (production)
- **Authentication:** Better Auth with JWT (TODO - skipped for demo)

## Spec-Driven Development

### Required Reading (Before Making Changes)
1. **Task Features:** `@specs/features/task-crud.md`
2. **API Endpoints:** `@specs/api/rest-endpoints.md`
3. **Architecture:** `@specs/architecture.md`
4. **Development Guidelines:** `@specs/constitution.md`

### Reusable Intelligence
- Use patterns from: `@skills/models/task.py`
- Follow conventions in: `@skills/spec-writer-skill.md`

## Current Implementation

### Storage (Demo Mode)
```python
# In-memory dictionary
tasks_storage: dict[str, dict] = {}

# TODO: Replace with Neon PostgreSQL
# Follow @specs/database/schema.md for migrations
```

### API Endpoints (Following @specs/api/rest-endpoints.md)

| Method | Endpoint | Status | Spec Reference |
|--------|----------|--------|----------------|
| GET | `/api/tasks` | ✅ Working | task-crud.md - Feature 1 |
| POST | `/api/tasks` | ✅ Working | task-crud.md - Feature 2 |
| PUT | `/api/tasks/{id}` | ✅ Working | task-crud.md - Feature 3 |
| DELETE | `/api/tasks/{id}` | ✅ Working | task-crud.md - Feature 4 |
| PATCH | `/api/tasks/{id}/complete` | ✅ Working | task-crud.md - Feature 5 |
| GET | `/health` | ✅ Working | - |

### Authentication (TODO)
```python
# TODO: Implement Better Auth with JWT
# Requirements:
# 1. User registration
# 2. User login
# 3. JWT token generation
# 4. Protected routes
# 5. Token refresh

# Placeholder for hackathon demo
# Will be implemented before production
```

## Running the Backend

### Quick Start
```bash
# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload --port 8000

# Access API docs
# http://localhost:8000/docs
```

### Development Commands
```bash
# Run with auto-reload (development)
uvicorn main:app --reload --port 8000

# Run in production mode
uvicorn main:app --host 0.0.0.0 --port 8000

# Run from Python
python main.py
```

## Testing

### Manual Testing
1. Open Swagger UI: http://localhost:8000/docs
2. Test each endpoint:
   - Create task
   - List tasks
   - Update task
   - Complete task
   - Delete task

### Health Check
```bash
curl http://localhost:8000/health
```

### CRUD Operations
```bash
# Create task
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "priority": "high"
  }'

# List tasks
curl http://localhost:8000/api/tasks

# Complete task (use ID from create)
curl -X PATCH http://localhost:8000/api/tasks/{task-id}/complete

# Delete task
curl -X DELETE http://localhost:8000/api/tasks/{task-id}
```

## Architecture Notes

### Current (Demo)
```
Frontend (Next.js) → FastAPI → In-memory Dict
```

### Production (To Be Implemented)
```
Frontend (Next.js) → Better Auth → FastAPI → SQLModel → Neon PostgreSQL
```

## Upgrading to Production

### 1. Add Neon PostgreSQL
```python
# Install
pip install sqlmodel asyncpg

# Configure
DATABASE_URL = "postgresql+asyncpg://..."

# Migrate
# Follow @specs/database/schema.md
```

### 2. Add Better Auth
```python
# Install
pip install python-jose passlib bcrypt

# Implement
# - User model
# - JWT utilities
# - Auth routes
# - Protected endpoints
```

### 3. Add SQLModel
```python
# Replace dict storage with:
from sqlmodel import SQLModel, create_engine

# Follow patterns in @skills/models/
```

## CORS Configuration

Currently allowing:
- http://localhost:3000 (Next.js default)
- http://127.0.0.1:3000

Update in production for deployment URLs.

## Next Steps

1. ✅ Basic CRUD working
2. ⏭️ Add Better Auth (post-demo)
3. ⏭️ Integrate Neon PostgreSQL (post-demo)
4. ⏭️ Add validation & error handling
5. ⏭️ Add automated tests
6. ⏭️ Prepare for Phase 3 (Chatbot)

## Phase 3 Preparation

This backend is designed to work with Phase 3 MCP chatbot:
- Keep endpoints RESTful
- Maintain clear API contracts
- Document all changes in specs
- Use reusable patterns from /skills/

## Support

- API Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health
- Specs: `@specs/` directory
- Skills: `@skills/` directory
