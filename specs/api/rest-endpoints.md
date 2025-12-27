# REST API Endpoints

## Base URL
- Development: `http://localhost:8000/api`
- Production: `https://api.todo.example.com/api`

## Authentication
All endpoints except /auth/* require JWT token:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication
```
POST   /auth/register    - Register new user
POST   /auth/login       - Login
POST   /auth/refresh     - Refresh JWT
POST   /auth/logout      - Logout
GET    /auth/me          - Get current user
```

### Tasks
```
GET    /tasks                   - List tasks (with filters)
POST   /tasks                   - Create task
GET    /tasks/:id               - Get task
PUT    /tasks/:id               - Update task
DELETE /tasks/:id               - Delete task
PATCH  /tasks/:id/complete      - Mark complete
PATCH  /tasks/:id/status        - Update status
```

### Tags
```
GET    /tags            - List tags
POST   /tags            - Create tag
PUT    /tags/:id        - Update tag
DELETE /tags/:id        - Delete tag
```

### Conversations (Phase 3+)
```
GET    /conversations         - List conversations
POST   /conversations         - Create conversation
GET    /conversations/:id     - Get conversation with messages
DELETE /conversations/:id     - Delete conversation
```

## Request/Response Examples

### POST /tasks
**Request:**
```json
{
  "title": "Review code",
  "description": "Review PR #123",
  "priority": "high",
  "due_date": "2025-01-30T17:00:00Z",
  "tag_ids": ["uuid1", "uuid2"]
}
```

**Response (201):**
```json
{
  "id": "task-uuid",
  "title": "Review code",
  "description": "Review PR #123",
  "priority": "high",
  "status": "pending",
  "due_date": "2025-01-30T17:00:00Z",
  "tags": [
    {"id": "uuid1", "name": "work", "color": "#FF5733"},
    {"id": "uuid2", "name": "urgent", "color": "#FF0000"}
  ],
  "created_at": "2025-01-26T10:00:00Z",
  "updated_at": "2025-01-26T10:00:00Z"
}
```

### GET /tasks?status=pending&priority=high
**Response (200):**
```json
{
  "tasks": [...],
  "total": 25,
  "page": 1,
  "per_page": 20,
  "pages": 2
}
```

## Error Responses
```json
{
  "error": "Validation Error",
  "details": {
    "title": ["Title is required"]
  }
}
```

See `@specs/constitution.md` for complete API standards
