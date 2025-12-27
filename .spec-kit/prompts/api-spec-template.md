# API Specification Template

Use this template when documenting API contracts and endpoints.

## API Name
[Name of the API or service]

## Base URL
```
Development: http://localhost:8000
Production: https://api.example.com
```

## Authentication
[Authentication method: JWT, OAuth, API Key, etc.]

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Endpoints

### Endpoint Name
**Method**: `POST`
**Path**: `/api/v1/resource`
**Description**: [What this endpoint does]

#### Request
**Headers**:
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Body**:
```json
{
  "field1": "string",
  "field2": "number",
  "field3": "boolean"
}
```

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| field1 | string | Yes | Description |
| field2 | number | No | Description |

**Validation Rules**:
- field1: Must be non-empty, max 255 characters
- field2: Must be positive integer

#### Response
**Success (200)**:
```json
{
  "id": "uuid",
  "field1": "string",
  "field2": "number",
  "created_at": "ISO 8601 timestamp"
}
```

**Error (400)**:
```json
{
  "error": "Validation error",
  "details": {
    "field1": ["Error message"]
  }
}
```

**Status Codes**:
- `200 OK`: Success
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

#### Examples
**cURL**:
```bash
curl -X POST https://api.example.com/api/v1/resource \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"field1": "value", "field2": 123}'
```

**Python**:
```python
import requests

response = requests.post(
    "https://api.example.com/api/v1/resource",
    headers={"Authorization": "Bearer <token>"},
    json={"field1": "value", "field2": 123}
)
```

## Data Models

### Model Name
```typescript
interface ModelName {
  id: string;              // UUID
  field1: string;          // Description
  field2: number;          // Description
  created_at: string;      // ISO 8601 timestamp
  updated_at: string;      // ISO 8601 timestamp
}
```

## Error Handling

### Standard Error Response
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": {},
  "timestamp": "ISO 8601 timestamp",
  "path": "/api/v1/resource"
}
```

## Rate Limiting
- Rate limit: 100 requests per minute
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Versioning
API versioning strategy: URL path versioning (`/api/v1/`, `/api/v2/`)

## WebSocket Endpoints (if applicable)
```
ws://localhost:8000/ws/resource
```

## Events
[Event names, payloads, and when they're triggered]

## Testing
[Test scenarios, mock data, example test cases]

## Change Log
| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-01 | Initial release |
