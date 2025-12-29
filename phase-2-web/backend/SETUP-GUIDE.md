# Phase 2 Backend - Setup Guide

## Quick Start (3 Steps)

### Step 1: Set Up Database (Choose One Option)

#### Option A: Neon PostgreSQL (Recommended - Free & Easy)

1. **Create Neon Account**:
   - Go to https://neon.tech
   - Click "Sign up" (free account, no credit card needed)
   - Sign in with GitHub/Google/Email

2. **Create New Project**:
   - Click "New Project"
   - Project name: `todo-app-phase2`
   - Region: Choose closest to you
   - PostgreSQL version: 16 (latest)
   - Click "Create Project"

3. **Get Connection String**:
   - After project creation, you'll see the connection string
   - Click "Copy" next to the connection string
   - It looks like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

4. **Important**: Change `postgresql://` to `postgresql+asyncpg://` for async support

#### Option B: Local PostgreSQL

1. **Install PostgreSQL**:
   - Download from https://www.postgresql.org/download/
   - Install with default settings
   - Remember the password you set for postgres user

2. **Create Database**:
   ```bash
   # Open PostgreSQL command line (psql)
   createdb todo_app
   ```

3. **Connection String**:
   ```
   postgresql+asyncpg://postgres:your_password@localhost/todo_app
   ```

### Step 2: Configure Environment

1. **Navigate to backend directory**:
   ```bash
   cd "D:\ALL IN ONE\TODO APP\phase-2-web\backend"
   ```

2. **Create .env file** (copy from .env.example):
   ```bash
   copy .env.example .env
   ```

3. **Edit .env file** with your database URL:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql+asyncpg://your-connection-string-here

   # JWT Configuration (generate a secure key)
   SECRET_KEY=your-super-secret-key-change-this-minimum-64-characters-long
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7

   # CORS Configuration
   CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]

   # Application
   APP_NAME="Todo App - Phase 2"
   DEBUG=True
   ```

4. **Generate a secure SECRET_KEY** (run in Python):
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(64))"
   ```
   Copy the output and paste as SECRET_KEY in .env

### Step 3: Install & Run

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Database Migrations**:
   ```bash
   alembic upgrade head
   ```
   This creates all tables (users, tasks, tags, task_tags)

3. **Start the Server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

4. **Open API Documentation**:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc
   - Health Check: http://localhost:8000/health

## Troubleshooting

### Issue: "ModuleNotFoundError"
**Solution**: Install dependencies
```bash
pip install -r requirements.txt
```

### Issue: "Connection refused" or "Database error"
**Solution**: Check your DATABASE_URL in .env
- Make sure it starts with `postgresql+asyncpg://`
- Verify username, password, host, and database name
- Test connection with: `psql your-connection-string`

### Issue: "Alembic command not found"
**Solution**: Ensure alembic is installed
```bash
pip install alembic
```

### Issue: "Table already exists"
**Solution**: Drop and recreate (development only!)
```bash
alembic downgrade base
alembic upgrade head
```

### Issue: Port 8000 already in use
**Solution**: Use a different port
```bash
uvicorn main:app --reload --port 8001
```

## Testing the API

### 1. Health Check
```bash
curl http://localhost:8000/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"TestPass123\"}"
```

### 3. Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username_or_email\":\"testuser\",\"password\":\"TestPass123\"}"
```
Save the `access_token` from the response.

### 4. Create a Task (use your token)
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Test Task\",\"priority\":\"high\"}"
```

### 5. List Tasks
```bash
curl http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## Next Steps

After successful setup:
1. ✅ Test all endpoints in Swagger UI (http://localhost:8000/docs)
2. ✅ Create test data (users, tasks, tags)
3. ✅ Test search, filtering, and pagination
4. ✅ Move on to frontend development

## Database Schema

The following tables are created:

- **users**: User accounts with authentication
- **tasks**: Todo tasks (belongs to user)
- **tags**: Custom tags (belongs to user)
- **task_tags**: Junction table (many-to-many)

All tables use UUID primary keys and include timestamps.

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | `postgresql+asyncpg://...` |
| SECRET_KEY | JWT secret key (min 64 chars) | Generate with secrets module |
| ALGORITHM | JWT algorithm | `HS256` |
| ACCESS_TOKEN_EXPIRE_MINUTES | Access token lifetime | `30` |
| REFRESH_TOKEN_EXPIRE_DAYS | Refresh token lifetime | `7` |
| CORS_ORIGINS | Allowed CORS origins | `["http://localhost:3000"]` |
| APP_NAME | Application name | `Todo App - Phase 2` |
| DEBUG | Debug mode | `True` or `False` |

## Production Deployment

For production:
1. Set `DEBUG=False`
2. Use a strong SECRET_KEY (64+ characters)
3. Configure proper CORS origins
4. Use environment variables (not .env file)
5. Enable HTTPS
6. Set up database backups
7. Monitor with logging/APM tools

## Support

- API Documentation: http://localhost:8000/docs
- Health Endpoint: http://localhost:8000/health
- Alembic Docs: https://alembic.sqlalchemy.org/
- FastAPI Docs: https://fastapi.tiangolo.com/
