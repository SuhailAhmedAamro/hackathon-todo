# API: [API Name/Resource]

## Overview
[Brief description of what this API provides]

## Base URL
```
Development: http://localhost:8000/api
Staging: https://staging-api.example.com/api
Production: https://api.example.com/api
```

## Authentication

### Method
[JWT Token | API Key | OAuth 2.0 | None]

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
```

### Getting a Token
```bash
POST /api/auth/login
{
  "username": "user",
  "password": "pass"
}

Response:
{
  "token": "eyJhbGc...",
  "expires_in": 3600
}
```

## Endpoints

### [HTTP METHOD] /api/resource

**Description**: [What this endpoint does]

**Authentication**: Required | Optional | Not Required

**Request**:

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Resource identifier |

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| per_page | integer | No | 20 | Items per page |
| sort_by | string | No | created_at | Sort field |

**Body** (for POST/PUT/PATCH):
```json
{
  "field1": "string",
  "field2": "integer",
  "field3": "boolean",
  "nested": {
    "subfield": "value"
  },
  "array_field": ["item1", "item2"]
}
```

**Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| field1 | string | Yes | 1-255 chars | Field description |
| field2 | integer | No | > 0 | Field description |
| field3 | boolean | No | - | Field description |

**Response**:

**Success (200 OK)**:
```json
{
  "data": {
    "id": "uuid",
    "field1": "value",
    "field2": 123,
    "created_at": "2025-01-26T12:00:00Z",
    "updated_at": "2025-01-26T12:00:00Z"
  },
  "meta": {
    "timestamp": "2025-01-26T12:00:00Z",
    "request_id": "req-uuid"
  }
}
```

**Success (201 Created)** - for POST:
```json
{
  "data": { ... },
  "meta": { ... }
}
```

**Success (204 No Content)** - for DELETE:
```
(Empty body)
```

**Error Responses**:

**400 Bad Request**:
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": {
    "field1": ["Field is required"],
    "field2": ["Must be greater than 0"]
  },
  "meta": {
    "timestamp": "2025-01-26T12:00:00Z",
    "request_id": "req-uuid",
    "path": "/api/resource"
  }
}
```

**401 Unauthorized**:
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

**403 Forbidden**:
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions to access this resource"
}
```

**404 Not Found**:
```json
{
  "error": "Not Found",
  "message": "Resource with id 'xyz' not found"
}
```

**409 Conflict**:
```json
{
  "error": "Conflict",
  "message": "Resource already exists"
}
```

**422 Unprocessable Entity**:
```json
{
  "error": "Unprocessable Entity",
  "message": "Semantic errors in request data",
  "details": { ... }
}
```

**429 Too Many Requests**:
```json
{
  "error": "Rate Limit Exceeded",
  "message": "Too many requests. Try again in 60 seconds.",
  "meta": {
    "retry_after": 60
  }
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

**Examples**:

**cURL**:
```bash
curl -X POST https://api.example.com/api/resource \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "field1": "value",
    "field2": 123
  }'
```

**Python**:
```python
import requests

response = requests.post(
    "https://api.example.com/api/resource",
    headers={"Authorization": "Bearer <token>"},
    json={"field1": "value", "field2": 123}
)

if response.status_code == 200:
    data = response.json()
    print(data)
```

**JavaScript (fetch)**:
```javascript
const response = await fetch('https://api.example.com/api/resource', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    field1: 'value',
    field2: 123
  })
});

const data = await response.json();
```

## Data Models

### [ModelName]
```typescript
interface ModelName {
  id: string;              // UUID
  field1: string;          // Description
  field2: number;          // Description
  field3?: boolean;        // Optional field
  created_at: string;      // ISO 8601 timestamp
  updated_at: string;      // ISO 8601 timestamp
}
```

### [NestedModel]
```typescript
interface NestedModel {
  id: string;
  name: string;
  // ... fields
}
```

## Pagination

**Request**:
```
GET /api/resource?page=2&per_page=20
```

**Response**:
```json
{
  "data": [...],
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

## Filtering

**Supported Filters**:
- `status`: Filter by status
- `priority`: Filter by priority
- `search`: Search in text fields
- `created_after`: Filter by date
- `created_before`: Filter by date

**Example**:
```
GET /api/resource?status=active&priority=high&search=urgent
```

## Sorting

**Supported Fields**:
- `created_at` (default)
- `updated_at`
- `name`
- `priority`

**Example**:
```
GET /api/resource?sort_by=created_at&sort_order=desc
```

## Rate Limiting

**Limits**:
- Authenticated: 100 requests per minute
- Unauthenticated: 20 requests per minute

**Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706276800
```

## Versioning

**Strategy**: URL-based versioning

**Example**:
```
/api/v1/resource
/api/v2/resource
```

## Webhooks (if applicable)

### Subscribing
```
POST /api/webhooks
{
  "url": "https://your-app.com/webhook",
  "events": ["resource.created", "resource.updated"]
}
```

### Payload
```json
{
  "event": "resource.created",
  "data": { ... },
  "timestamp": "2025-01-26T12:00:00Z"
}
```

## Testing

### Test Cases
- [ ] Create resource with valid data
- [ ] Create resource with invalid data (400)
- [ ] Get non-existent resource (404)
- [ ] Update with unauthorized token (401)
- [ ] Delete with valid ID (204)
- [ ] List with pagination
- [ ] List with filters
- [ ] List with sorting
- [ ] Rate limit enforcement (429)

### Test Data
```json
{
  "valid_request": {
    "field1": "test",
    "field2": 100
  },
  "invalid_request": {
    "field1": "",
    "field2": -1
  }
}
```

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-26 | Initial API design |
| | | |

## References

- Feature Spec: `@specs/features/[feature].md`
- Database Schema: `@specs/database/schema.md`
- OpenAPI Spec: `/openapi.json`

---

**Template Version**: 1.0
**Last Updated**: 2025-01-26
**Usage**: `@skills/templates/api-template.md`
