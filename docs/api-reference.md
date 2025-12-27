# API Reference

## Base URL
- Development: `http://localhost:8000/api`
- Production: `https://api.todo.example.com/api`

## Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "id": "user-uuid",
  "username": "john_doe",
  "email": "john@example.com",
  "token": "jwt-token-here"
}
```

#### POST /auth/login
Login existing user.

**Request:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-uuid",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Tasks

#### GET /tasks
List all tasks for authenticated user.

**Query Parameters:**
- `status` (optional): Filter by status (pending/in_progress/completed)
- `priority` (optional): Filter by priority (low/medium/high)
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 20)

**Response (200):**
```json
{
  "tasks": [
    {
      "id": "task-uuid",
      "title": "Review code",
      "description": "Review PR #123",
      "priority": "high",
      "status": "pending",
      "due_date": "2025-01-30T17:00:00Z",
      "tags": [
        {"id": "tag-uuid", "name": "work", "color": "#FF5733"}
      ],
      "created_at": "2025-01-26T10:00:00Z",
      "updated_at": "2025-01-26T10:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "pages": 2
}
```

#### POST /tasks
Create a new task.

**Request:**
```json
{
  "title": "Review code",
  "description": "Review PR #123",
  "priority": "high",
  "due_date": "2025-01-30T17:00:00Z",
  "tag_ids": ["tag-uuid-1", "tag-uuid-2"]
}
```

**Response (201):**
```json
{
  "id": "task-uuid",
  "title": "Review code",
  ...
}
```

#### GET /tasks/:id
Get task details.

#### PUT /tasks/:id
Update task.

#### DELETE /tasks/:id
Delete task.

**Response (204):** No content

#### PATCH /tasks/:id/complete
Mark task as completed.

**Response (200):**
```json
{
  "id": "task-uuid",
  "status": "completed",
  "completed_at": "2025-01-26T12:00:00Z",
  ...
}
```

### Tags

#### GET /tags
List all tags for authenticated user.

#### POST /tags
Create a tag.

**Request:**
```json
{
  "name": "urgent",
  "color": "#FF0000"
}
```

#### PUT /tags/:id
Update tag.

#### DELETE /tags/:id
Delete tag.

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation Error",
  "details": {
    "title": ["Title is required"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting
- 100 requests per minute per IP
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

## Pagination
All list endpoints support pagination:
- Default: 20 items per page
- Max: 100 items per page
- Use `page` and `per_page` query parameters

## Complete Reference
Interactive API documentation available at:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)
