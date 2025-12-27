# Phase 2: Web Application - Specification

## Overview
Transform the CLI application into a modern web application with a React frontend and FastAPI backend.

## Goals
- Build a responsive web interface
- Create a RESTful API
- Implement user authentication
- Support multiple users
- Migrate from SQLite to PostgreSQL

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, TypeScript
- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **Database**: PostgreSQL 15+
- **Authentication**: JWT
- **Testing**: pytest (backend), Jest + React Testing Library (frontend)

## Features

### User Authentication
- User registration
- Login/logout
- JWT token-based auth
- Password hashing (bcrypt)
- Protected routes

### Task Management
- All Phase 1 features
- Task filtering and search
- Task sorting
- Pagination
- Tags support
- Due dates

### User Interface
- Dashboard with task overview
- Task list with filters
- Task creation form
- Task editing modal
- Responsive design (mobile-friendly)
- Dark mode toggle

## API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
```

### Tasks
```
GET    /api/tasks              # List tasks (with filters)
POST   /api/tasks              # Create task
GET    /api/tasks/:id          # Get task details
PUT    /api/tasks/:id          # Update task
DELETE /api/tasks/:id          # Delete task
PATCH  /api/tasks/:id/complete # Mark complete
```

### Tags
```
GET    /api/tags               # List tags
POST   /api/tags               # Create tag
PUT    /api/tags/:id           # Update tag
DELETE /api/tags/:id           # Delete tag
```

## Project Structure

```
phase-2-web/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── dashboard/
│   │   │   ├── tasks/
│   │   │   └── auth/
│   │   ├── components/
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   └── lib/
│   │       ├── api.ts
│   │       ├── auth.ts
│   │       └── types.ts
│   ├── package.json
│   └── README.md
├── backend/
│   ├── src/
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── tasks.py
│   │   │   └── tags.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── task.py
│   │   │   └── tag.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── task.py
│   │   │   └── tag.py
│   │   ├── database.py
│   │   └── auth.py
│   ├── alembic/
│   │   └── versions/
│   ├── requirements.txt
│   └── README.md
└── docker-compose.yml
```

## Database Schema

See `@specs/database/schema.md` for complete schema.

## Authentication Flow

1. User registers → password hashed → stored in DB
2. User logs in → credentials validated → JWT generated
3. JWT sent to client → stored in httpOnly cookie
4. Subsequent requests include JWT → validated by backend
5. Protected routes check JWT validity

## UI Components

See `@specs/ui/components.md` and `@specs/ui/pages.md` for details.

## Implementation Checklist

### Backend
- [ ] Set up FastAPI project
- [ ] Configure PostgreSQL connection
- [ ] Implement User model
- [ ] Migrate Task model from Phase 1
- [ ] Implement Tag model
- [ ] Create Pydantic schemas
- [ ] Implement authentication endpoints
- [ ] Implement task CRUD endpoints
- [ ] Implement tag endpoints
- [ ] Add middleware (CORS, auth)
- [ ] Set up Alembic for migrations
- [ ] Write API tests

### Frontend
- [ ] Set up Next.js project
- [ ] Configure Tailwind CSS
- [ ] Create layout components
- [ ] Implement authentication pages
- [ ] Implement dashboard
- [ ] Create task components
- [ ] Implement task list with filters
- [ ] Implement task creation/editing
- [ ] Add form validation
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Write component tests

### Integration
- [ ] Test end-to-end flows
- [ ] Verify authentication
- [ ] Test CRUD operations
- [ ] Check responsive design
- [ ] Verify accessibility

## Success Criteria
- [ ] User registration and login work
- [ ] All task operations functional
- [ ] Responsive design on mobile/tablet/desktop
- [ ] API tests pass
- [ ] Frontend tests pass
- [ ] WCAG 2.1 AA compliant
- [ ] Documentation complete

## Next Phase
Phase 3 will add a chatbot interface using MCP, allowing natural language task management.
