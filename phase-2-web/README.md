# Hackathon II - Phase 2: Todo Web Application

**Spec-Driven Development Demo** | Next.js 14 + FastAPI + TypeScript + Tailwind CSS

---

## Overview

Phase 2 transforms the console todo app into a full-featured web application following hackathon requirements and spec-driven development principles.

### Hackathon Requirements

- ✅ **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- ✅ **Backend:** FastAPI with REST API
- ✅ **Database:** In-memory (demo) → Neon PostgreSQL (production)
- ⏭️ **Authentication:** Better Auth with JWT (TODO - post-demo)
- ✅ **Features:** All 5 basic task features as web interface
- ✅ **Spec-Driven:** Following @specs/features/task-crud.md

---

## Quick Start (90-Second Demo Ready!)

### Prerequisites

- Python 3.11+
- Node.js 18+
- Terminal (2 tabs needed)

### Step 1: Start Backend (Terminal 1)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Verify:** http://localhost:8000/docs (Swagger UI should load)

### Step 2: Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

**Verify:** http://localhost:3000 (Todo app should load)

### Step 3: Demo!

1. Add a task via the form
2. Mark it complete
3. Delete it
4. Show the live updates

**Done!** You have a working web app in 3 commands.

---

## Project Structure

```
phase-2-web/
├── backend/
│   ├── main.py                 # FastAPI app (200 lines, well-commented)
│   ├── requirements.txt        # 3 dependencies only
│   └── CLAUDE.md              # Backend development guide
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Main todo page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Tailwind styles
│   ├── components/
│   │   ├── TaskForm.tsx       # Add task form
│   │   └── TaskList.tsx       # Task list with filters
│   ├── package.json           # Next.js 14 dependencies
│   └── tsconfig.json          # TypeScript config
│
└── README.md                  # This file
```

---

## Features

### All 5 Basic Level Features (Following @specs/features/task-crud.md)

| Feature | Spec Reference | Status |
|---------|---------------|--------|
| 1. List Tasks | task-crud.md - Feature 1 | ✅ With filters |
| 2. Add Task | task-crud.md - Feature 2 | ✅ With form |
| 3. Update Task | task-crud.md - Feature 3 | ✅ Via UI |
| 4. Delete Task | task-crud.md - Feature 4 | ✅ With confirmation |
| 5. Mark Complete | task-crud.md - Feature 5 | ✅ One-click |

### Additional Features

- **Priority Levels:** Low, Medium, High (color-coded)
- **Status Tracking:** Pending, In Progress, Completed
- **Due Dates:** Optional deadline for tasks
- **Filters:** View by status (All, Pending, In Progress, Completed)
- **Real-time Updates:** UI refreshes after actions
- **Responsive Design:** Works on mobile and desktop

---

## API Endpoints

### Backend (FastAPI)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks (with filters) |
| POST | `/api/tasks` | Create new task |
| GET | `/api/tasks/{id}` | Get specific task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |
| PATCH | `/api/tasks/{id}/complete` | Mark as completed |
| GET | `/health` | Health check |

**API Documentation:** http://localhost:8000/docs

---

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **Next.js 14** - React framework (App Router)
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS

---

## Development

### Backend Development

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn main:app --reload --port 8000

# View API docs
open http://localhost:8000/docs
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
npm start
```

---

## Spec-Driven Development

This project demonstrates spec-driven development:

### 1. Specifications First
- Read: `@specs/features/task-crud.md`
- Follow: `@specs/api/rest-endpoints.md`
- Reference: `@specs/architecture.md`

### 2. Reusable Intelligence
- Task models from: `@skills/models/task.py`
- Patterns from: `@skills/spec-writer-skill.md`

### 3. Claude Integration
- Backend guide: `backend/CLAUDE.md`
- Follow conventions in: `@specs/constitution.md`

---

## Demo Script (90 Seconds)

### Introduction (15s)
> "This is Phase 2 of our Todo application. We've evolved from a CLI to a full web app using Next.js and FastAPI, following spec-driven development."

### Backend (20s)
> "Our FastAPI backend provides a REST API with all CRUD operations. Here's the Swagger UI showing our endpoints. We're using in-memory storage for this demo, but it's ready for Neon PostgreSQL."

**Show:** http://localhost:8000/docs

### Frontend (30s)
> "The frontend is built with Next.js 14, TypeScript, and Tailwind CSS. Let me add a task... mark it complete... and delete it. Notice the real-time updates and clean UI."

**Demo:** Add/Complete/Delete tasks at http://localhost:3000

### Spec-Driven (15s)
> "Everything follows our specifications in the specs folder. The code references the exact features from task-crud.md, making it maintainable and collaborative."

**Show:** Code comments referencing @specs

### Next Phase (10s)
> "This architecture is ready for Phase 3, where we'll add a chatbot interface using Claude's MCP."

---

## Production Readiness

### Current (Demo)
- ✅ In-memory storage
- ✅ No authentication
- ✅ Single instance
- ✅ Development mode

### Production Upgrades (TODO)

1. **Database**
   ```bash
   # Add Neon PostgreSQL
   pip install sqlmodel asyncpg
   # Follow @specs/database/schema.md
   ```

2. **Authentication**
   ```bash
   # Add Better Auth
   pip install python-jose passlib
   # Implement JWT tokens
   ```

3. **Deployment**
   - Frontend: Vercel
   - Backend: Railway/Render
   - Database: Neon
   - Environment variables for config

---

## Testing

### Manual Testing

**Backend:**
```bash
# Health check
curl http://localhost:8000/health

# Create task
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "priority": "high"}'
```

**Frontend:**
1. Open http://localhost:3000
2. Add task → Verify in list
3. Complete task → Verify status change
4. Delete task → Verify removal

### Automated Testing (TODO)
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

---

## Troubleshooting

### Backend Won't Start

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### Frontend Won't Start

**Problem:** `'next' is not recognized`

**Solution:**
```bash
cd frontend
npm install
```

### Can't Connect to Backend

**Problem:** Frontend shows network errors

**Solutions:**
1. Verify backend is running: http://localhost:8000/health
2. Check CORS settings in `backend/main.py`
3. Ensure using correct port (8000)

### Port Already in Use

**Backend (8000):**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

**Frontend (3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## Next Steps

### Phase 3 Preview
- Add MCP (Model Context Protocol) chatbot
- Natural language task management
- Voice-to-task conversion
- Smart task suggestions

### Production Checklist
- [ ] Integrate Neon PostgreSQL
- [ ] Implement Better Auth
- [ ] Add automated tests
- [ ] Set up CI/CD
- [ ] Deploy to production
- [ ] Add monitoring

---

## Resources

- **API Docs:** http://localhost:8000/docs
- **Frontend:** http://localhost:3000
- **Specs:** `../specs/features/task-crud.md`
- **Skills:** `../skills/` directory
- **Backend Guide:** `backend/CLAUDE.md`

---

## Support

For issues or questions:
1. Check this README
2. Review `backend/CLAUDE.md`
3. Check specs in `@specs/` directory
4. Review code comments (all reference specs)

---

## License

Hackathon II Project - Spec-Driven Development Demo

**Built with:**
- ❤️ Spec-driven development
- 🚀 Modern web technologies
- 🤖 Ready for AI integration (Phase 3)
