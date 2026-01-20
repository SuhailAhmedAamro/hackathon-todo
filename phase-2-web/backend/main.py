"""
Hackathon II - Phase 2: Todo Web Application Backend
FastAPI backend with PostgreSQL database and JWT authentication

Spec Reference: @specs/features/task-crud.md, @specs/features/authentication.md
API Spec: @specs/api/rest-endpoints.md

Usage:
    uvicorn main:app --reload --port 8000

Setup:
    1. Create .env file (see .env.example)
    2. Set up PostgreSQL database (Neon recommended)
    3. Install dependencies: pip install -r requirements.txt
    4. Run migrations: alembic upgrade head
    5. Start server: uvicorn main:app --reload
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager
import json

from src.config import settings
from src.database import create_db_and_tables, close_db
from src.api.auth import router as auth_router
from src.api.tasks import router as tasks_router
from src.api.tags import router as tags_router


# ============================================================================
# APPLICATION LIFECYCLE
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events.

    Startup: Create database tables
    Shutdown: Close database connections
    """
    # Startup
    print("\n" + "="*70)
    print("Hackathon II - Phase 2: Todo Web Application Backend")
    print("="*70)
    print(f"App Name: {settings.APP_NAME}")
    print(f"Auth: JWT (Access: {settings.ACCESS_TOKEN_EXPIRE_MINUTES}min, Refresh: {settings.REFRESH_TOKEN_EXPIRE_DAYS}d)")
    print(f"Database: PostgreSQL (SQLModel + Async)")
    print(f"CORS Origins: {', '.join(settings.CORS_ORIGINS)}")
    print(f"Debug Mode: {settings.DEBUG}")
    print("="*70)
    print("API Docs: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    print("="*70 + "\n")

    # Create database tables (if they don't exist)
    await create_db_and_tables()
    print("Database tables ready\n")

    yield

    # Shutdown
    print("\nShutting down application...")
    await close_db()
    print("Database connections closed\n")


# ============================================================================
# FASTAPI APP
# ============================================================================

app = FastAPI(
    title="Hackathon II - Phase 2 Todo API",
    description="""
    Production-ready Todo Application API with:
    - 🔐 JWT Authentication (register, login, refresh)
    - 📝 Task CRUD operations (user-specific)
    - 🏷️ Tags system with colors
    - 🔍 Search & filtering (full-text + advanced)
    - 📄 Pagination (configurable page size)

    Following spec-driven development from @specs/
    """,
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# ============================================================================
# MIDDLEWARE
# ============================================================================

# Session middleware (required for OAuth) - skip for WebSocket
from starlette.middleware.base import BaseHTTPMiddleware

class WebSocketSkipSessionMiddleware(SessionMiddleware):
    async def __call__(self, scope, receive, send):
        if scope["type"] == "websocket":
            await self.app(scope, receive, send)
        else:
            await super().__call__(scope, receive, send)

app.add_middleware(
    WebSocketSkipSessionMiddleware,
    secret_key=settings.SECRET_KEY,
    max_age=3600  # 1 hour session timeout
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,  # Required for cookies/auth
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# ============================================================================
# ROUTERS
# ============================================================================

# Authentication endpoints
app.include_router(auth_router)

# Task CRUD endpoints
app.include_router(tasks_router)

# Tags endpoints
app.include_router(tags_router)

# ============================================================================
# WEBSOCKET CHAT ENDPOINT (Phase 3 Integration)
# ============================================================================

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    """
    WebSocket endpoint for AI chatbot.
    Simple echo bot with task management hints.
    """
    # Accept connection from any origin (for local development)
    origin = websocket.headers.get("origin", "")
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            user_message = message_data.get("message", "").lower()
            lang = message_data.get("language", "en")

            # Send typing indicator
            await websocket.send_json({"type": "typing", "is_typing": True})

            # Simple response logic
            if "create" in user_message or "add" in user_message or "new" in user_message:
                response = "To create a task, use the '+ New Task' button on the dashboard! 📝" if lang == "en" else "ٹاسک بنانے کے لیے ڈیش بورڈ پر '+ New Task' بٹن استعمال کریں! 📝"
            elif "list" in user_message or "show" in user_message or "all" in user_message:
                response = "Your tasks are displayed on the dashboard. Use filters to find specific tasks! 📋" if lang == "en" else "آپ کے ٹاسک ڈیش بورڈ پر دکھائے گئے ہیں۔ مخصوص ٹاسک تلاش کرنے کے لیے فلٹرز استعمال کریں! 📋"
            elif "delete" in user_message or "remove" in user_message:
                response = "Click the delete button (🗑️) on any task to remove it." if lang == "en" else "کسی بھی ٹاسک کو ہٹانے کے لیے ڈیلیٹ بٹن (🗑️) پر کلک کریں۔"
            elif "complete" in user_message or "done" in user_message or "finish" in user_message:
                response = "Click the checkbox next to a task to mark it complete! ✅" if lang == "en" else "ٹاسک مکمل کرنے کے لیے اس کے ساتھ والے چیک باکس پر کلک کریں! ✅"
            elif "help" in user_message or "مدد" in user_message:
                response = "I can help with: creating tasks, listing tasks, completing tasks, and more! Try saying 'create a task' or 'show my tasks'." if lang == "en" else "میں مدد کر سکتا ہوں: ٹاسک بنانا، ٹاسک دکھانا، ٹاسک مکمل کرنا۔ 'ٹاسک بنائیں' یا 'میرے ٹاسک دکھائیں' کہیں۔"
            elif "hello" in user_message or "hi" in user_message or "سلام" in user_message:
                response = "Hello! 👋 How can I help you manage your tasks today?" if lang == "en" else "السلام علیکم! 👋 آج میں آپ کے ٹاسک میں کیسے مدد کر سکتا ہوں?"
            else:
                response = "I'm your task assistant! Try: 'create task', 'show tasks', 'help' 🤖" if lang == "en" else "میں آپ کا ٹاسک اسسٹنٹ ہوں! کوشش کریں: 'ٹاسک بنائیں'، 'ٹاسک دکھائیں'، 'مدد' 🤖"

            # Send response
            await websocket.send_json({
                "type": "message",
                "content": response
            })

    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket error: {e}")


# ============================================================================
# HEALTH & INFO ENDPOINTS
# ============================================================================

@app.get("/health", tags=["System"])
async def health_check():
    """
    Health check endpoint.
    Returns application status and configuration.
    """
    return {
        "status": "healthy",
        "phase": "Phase 2 - Web Application",
        "version": "2.0.0",
        "features": {
            "authentication": "JWT (30min access, 7d refresh)",
            "database": "PostgreSQL (SQLModel + Async)",
            "task_crud": "User-specific tasks",
            "tags": "Tag system with colors",
            "search": "Full-text search + advanced filters",
            "pagination": "Paginated responses (20/page, max 100)"
        },
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
            "auth": "/api/auth/*",
            "tasks": "/api/tasks",
            "tags": "/api/tags"
        }
    }


@app.get("/", tags=["System"])
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "message": "Hackathon II - Phase 2 Todo API",
        "version": "2.0.0",
        "documentation": "/docs",
        "health": "/health",
        "features": [
            "JWT Authentication",
            "User Registration & Login",
            "Task CRUD (user-specific)",
            "Priority levels (low, medium, high)",
            "Status tracking (pending, in_progress, completed)",
            "Due dates",
            "Timestamps"
        ],
        "search_filters": [
            "Full-text search (title & description)",
            "Filter by status, priority, tags",
            "Date range filtering",
            "Sort by: created_at, due_date, priority, title, status",
            "Sort order: asc, desc"
        ],
        "pagination": {
            "default_limit": 20,
            "max_limit": 100,
            "features": ["Total count", "Page metadata", "Total pages calculation"]
        },
        "next_features": [
            "Frontend React/Next.js implementation",
            "Dark mode",
            "Real-time updates (optional)"
        ]
    }


# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
