# Skill: API Design - RESTful API Architecture

## Purpose
Designs comprehensive, RESTful APIs following best practices for the Evolution of Todo application. Creates API specifications, endpoint definitions, request/response schemas, and ensures consistency across all API layers.

## Capabilities
- Design RESTful API endpoints
- Define request/response schemas
- Implement authentication/authorization
- Create API documentation
- Design error handling
- Define rate limiting
- Version APIs
- Generate OpenAPI specs

## Usage

### Command Syntax
```
"Design API for [feature] using @skills/api-design-skill.md"
"Create endpoint specification for [operation] using @skills/api-design-skill.md"
"Generate OpenAPI spec using @skills/api-design-skill.md"
```

### Input Format
```yaml
resource: tasks
operations: [create, read, update, delete, list]
authentication: JWT
version: v1
features:
  - filtering
  - pagination
  - sorting
```

## REST API Principles

### 1. Resource-Based URLs
```
✅ Good:
GET    /api/tasks           # List tasks
POST   /api/tasks           # Create task
GET    /api/tasks/:id       # Get task
PUT    /api/tasks/:id       # Update task
DELETE /api/tasks/:id       # Delete task

❌ Bad:
GET    /api/getTasks
POST   /api/createTask
POST   /api/updateTask/:id
```

### 2. HTTP Methods
- **GET**: Retrieve resources (idempotent)
- **POST**: Create new resources
- **PUT**: Update entire resource (idempotent)
- **PATCH**: Partial update
- **DELETE**: Remove resource (idempotent)

### 3. Status Codes
```
200 OK              - Success (GET, PUT, PATCH)
201 Created         - Success (POST)
204 No Content      - Success (DELETE)
400 Bad Request     - Invalid input
401 Unauthorized    - Missing/invalid auth
403 Forbidden       - No permission
404 Not Found       - Resource doesn't exist
409 Conflict        - Resource conflict
422 Unprocessable   - Validation error
429 Too Many        - Rate limit exceeded
500 Server Error    - Internal error
```

## Complete API Design Template

### Authentication Endpoints

```yaml
# POST /api/auth/register
Request:
  body:
    username: string (3-50 chars, alphanumeric + underscore)
    email: string (valid email)
    password: string (min 8 chars, uppercase, lowercase, digit)

Response (201):
  id: uuid
  username: string
  email: string
  token: string (JWT)
  created_at: timestamp

Errors:
  400: Validation error (details in response)
  409: Username or email already exists

# POST /api/auth/login
Request:
  body:
    username: string (or email)
    password: string

Response (200):
  token: string (JWT)
  refresh_token: string
  user:
    id: uuid
    username: string
    email: string

Errors:
  400: Missing credentials
  401: Invalid credentials

# POST /api/auth/refresh
Request:
  body:
    refresh_token: string

Response (200):
  token: string (new JWT)
  refresh_token: string (new refresh token)

Errors:
  401: Invalid refresh token

# POST /api/auth/logout
Request:
  headers:
    Authorization: Bearer <token>

Response (204): No content

# GET /api/auth/me
Request:
  headers:
    Authorization: Bearer <token>

Response (200):
  id: uuid
  username: string
  email: string
  created_at: timestamp

Errors:
  401: Invalid token
```

### Task Endpoints

```yaml
# GET /api/tasks
Description: List tasks with filtering, pagination, sorting

Query Parameters:
  status: enum[pending|in_progress|completed]
  priority: enum[low|medium|high]
  tags: string (comma-separated tag IDs)
  search: string (search in title/description)
  sort_by: enum[created_at|due_date|priority|title]
  sort_order: enum[asc|desc]
  page: integer (default: 1)
  per_page: integer (default: 20, max: 100)

Response (200):
  tasks: array[Task]
  total: integer
  page: integer
  per_page: integer
  pages: integer
  filters_applied: object

Task Schema:
  id: uuid
  title: string
  description: string|null
  priority: enum[low|medium|high]
  status: enum[pending|in_progress|completed]
  due_date: timestamp|null
  tags: array[Tag]
  created_at: timestamp
  updated_at: timestamp
  completed_at: timestamp|null

Tag Schema:
  id: uuid
  name: string
  color: string (hex color)

# POST /api/tasks
Description: Create a new task

Request:
  body:
    title: string (required, 1-255 chars)
    description: string (optional)
    priority: enum[low|medium|high] (default: medium)
    due_date: timestamp (optional)
    tag_ids: array[uuid] (optional)

Response (201):
  <Task object>

Errors:
  400: Validation error
  401: Unauthorized

# GET /api/tasks/:id
Description: Get single task

Response (200):
  <Task object>

Errors:
  401: Unauthorized
  404: Task not found

# PUT /api/tasks/:id
Description: Update entire task

Request:
  body:
    title: string (required)
    description: string (optional)
    priority: enum[low|medium|high]
    status: enum[pending|in_progress|completed]
    due_date: timestamp|null
    tag_ids: array[uuid]

Response (200):
  <Task object>

Errors:
  400: Validation error
  401: Unauthorized
  403: Cannot modify others' tasks
  404: Task not found

# PATCH /api/tasks/:id
Description: Partial update

Request:
  body: (any subset of task fields)
    title?: string
    priority?: enum
    status?: enum
    ...

Response (200):
  <Task object>

# DELETE /api/tasks/:id
Description: Delete task

Response (204): No content

Errors:
  401: Unauthorized
  403: Cannot delete others' tasks
  404: Task not found

# PATCH /api/tasks/:id/complete
Description: Mark task as completed

Response (200):
  <Task object with status=completed and completed_at set>

# PATCH /api/tasks/:id/status
Description: Update only status

Request:
  body:
    status: enum[pending|in_progress|completed]

Response (200):
  <Task object>
```

### Tag Endpoints

```yaml
# GET /api/tags
Description: List all user's tags

Response (200):
  tags: array[Tag]
  total: integer

# POST /api/tags
Description: Create a tag

Request:
  body:
    name: string (required, 1-100 chars, unique per user)
    color: string (hex color, default: random)

Response (201):
  <Tag object>

Errors:
  400: Validation error
  409: Tag name already exists

# PUT /api/tags/:id
Description: Update tag

Request:
  body:
    name: string
    color: string

Response (200):
  <Tag object>

# DELETE /api/tags/:id
Description: Delete tag (removes from all tasks)

Response (204): No content
```

## Request/Response Formats

### Standard Success Response
```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2025-01-26T12:00:00Z",
    "request_id": "req-uuid"
  }
}
```

### Standard Error Response
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": {
    "field": ["Error description"]
  },
  "meta": {
    "timestamp": "2025-01-26T12:00:00Z",
    "request_id": "req-uuid",
    "path": "/api/tasks"
  }
}
```

### Validation Error (422)
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": {
    "title": ["Title is required", "Title must be 1-255 characters"],
    "priority": ["Must be one of: low, medium, high"]
  }
}
```

### Pagination Metadata
```json
{
  "tasks": [...],
  "meta": {
    "total": 150,
    "page": 2,
    "per_page": 20,
    "pages": 8,
    "has_prev": true,
    "has_next": true,
    "prev_page": 1,
    "next_page": 3
  }
}
```

## Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "user-uuid",
  "username": "john_doe",
  "email": "john@example.com",
  "exp": 1706278800,
  "iat": 1706276800,
  "type": "access"
}
```

### Authorization Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Permission Checks
```python
def check_task_ownership(task_id: str, user_id: str, db: Session):
    """Ensure user owns the task"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.user_id != user_id:
        raise HTTPException(status_code=403, detail="Cannot modify others' tasks")
    return task
```

## Rate Limiting

### Implementation
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, ...):
    ...
```

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706276800
```

### Rate Limit Exceeded (429)
```json
{
  "error": "Rate Limit Exceeded",
  "message": "Too many requests. Try again in 60 seconds.",
  "meta": {
    "retry_after": 60
  }
}
```

## API Versioning

### URL Versioning (Recommended)
```
/api/v1/tasks
/api/v2/tasks
```

### Header Versioning (Alternative)
```
Accept: application/vnd.evolution-todo.v1+json
```

## OpenAPI/Swagger Spec

### Auto-Generated with FastAPI
```python
from fastapi import FastAPI

app = FastAPI(
    title="Evolution Todo API",
    description="RESTful API for Evolution of Todo application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)
```

Access at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

## CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://todo.example.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing APIs

### Unit Tests
```python
def test_create_task(client, auth_headers):
    """Test task creation"""
    response = client.post(
        "/api/tasks",
        json={"title": "Test task", "priority": "high"},
        headers=auth_headers
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Test task"
```

### Integration Tests
```python
def test_task_workflow(client, auth_headers):
    """Test complete task workflow"""
    # Create
    create_resp = client.post("/api/tasks", json={"title": "Test"}, headers=auth_headers)
    task_id = create_resp.json()["id"]

    # Read
    get_resp = client.get(f"/api/tasks/{task_id}", headers=auth_headers)
    assert get_resp.status_code == 200

    # Update
    update_resp = client.put(
        f"/api/tasks/{task_id}",
        json={"title": "Updated", "priority": "high"},
        headers=auth_headers
    )
    assert update_resp.json()["title"] == "Updated"

    # Delete
    delete_resp = client.delete(f"/api/tasks/{task_id}", headers=auth_headers)
    assert delete_resp.status_code == 204
```

## Best Practices

### 1. Consistent Naming
- Use plural nouns: `/tasks`, `/tags`
- Use kebab-case: `/task-templates`
- Be predictable: same pattern everywhere

### 2. Proper HTTP Methods
- GET: No side effects
- POST: Create resources
- PUT: Full replacement
- PATCH: Partial update
- DELETE: Remove resource

### 3. Input Validation
```python
from pydantic import BaseModel, Field, validator

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    priority: Priority = Priority.MEDIUM

    @validator('title')
    def title_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()
```

### 4. Error Handling
- Always return JSON errors
- Include helpful error messages
- Use appropriate status codes
- Log errors server-side

### 5. Documentation
- Auto-generate with OpenAPI
- Include examples
- Document all parameters
- Specify error responses

## Dependencies
- FastAPI (framework)
- Pydantic (validation)
- SQLAlchemy (ORM)
- python-jose (JWT)
- slowapi (rate limiting)

## Integration Points
- Used by: Phase 2 (Web), Phase 3 (Chatbot)
- Uses: `@specs/api/rest-endpoints.md` (specifications)
- Uses: `@skills/models/` (data models)
- Uses: `@specs/database/schema.md` (database)

## Success Metrics
- All endpoints documented
- 100% test coverage
- Response time < 200ms (p95)
- Zero security vulnerabilities
- OpenAPI spec valid

## Notes for Claude Code
When using this skill:
1. Follow RESTful principles
2. Use proper HTTP methods and status codes
3. Implement authentication for protected routes
4. Validate all inputs
5. Handle errors gracefully
6. Document with OpenAPI
7. Test all endpoints
