# Evolution of Todo - System Architecture

## Overview
This document describes the architectural decisions and system design for all five phases of the Evolution of Todo project.

## Architectural Principles

### 1. Separation of Concerns
- Clear boundaries between layers (presentation, business logic, data)
- Each phase is independently deployable
- Shared code isolated in `/skills/`

### 2. Progressive Complexity
- Start simple (CLI + SQLite)
- Add layers gradually (Web, API, Chatbot)
- Scale infrastructure last (K8s, Cloud)

### 3. Technology Agnostic Interfaces
- Standard protocols (HTTP, WebSocket, MCP)
- Interchangeable components
- Cloud provider flexibility

## Phase Architectures

### Phase 1: Console CLI

```
┌─────────────────────────────────────┐
│          CLI Interface              │
│      (Click/Typer Commands)         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│       Business Logic Layer          │
│    (Task Management, Validation)    │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│         Data Access Layer           │
│      (SQLAlchemy ORM)               │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│        SQLite Database              │
│     (Local File Storage)            │
└─────────────────────────────────────┘
```

**Key Decisions**:
- SQLite for simplicity and portability
- SQLAlchemy for ORM (enables easy database migration)
- Click/Typer for robust CLI
- Single-user mode (no authentication)

---

### Phase 2: Web Application

```
┌──────────────────────────────────────────────────────┐
│                   Browser (Client)                    │
│  ┌────────────────────────────────────────────────┐  │
│  │         Next.js Frontend                       │  │
│  │  - React Components                            │  │
│  │  - Tailwind CSS                                │  │
│  │  - Client-side Routing                         │  │
│  └────────────────┬───────────────────────────────┘  │
└───────────────────┼──────────────────────────────────┘
                    │ HTTPS/REST API
                    ▼
┌──────────────────────────────────────────────────────┐
│               FastAPI Backend                         │
│  ┌────────────────────────────────────────────────┐  │
│  │  API Layer (Routes, Middleware)                │  │
│  └────────────────┬───────────────────────────────┘  │
│  ┌────────────────▼───────────────────────────────┐  │
│  │  Business Logic (Services)                     │  │
│  └────────────────┬───────────────────────────────┘  │
│  ┌────────────────▼───────────────────────────────┐  │
│  │  Data Access (SQLAlchemy Models)              │  │
│  └────────────────┬───────────────────────────────┘  │
└───────────────────┼──────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│            PostgreSQL Database                        │
│  - Users, Tasks, Tags, Sessions                      │
└──────────────────────────────────────────────────────┘
```

**Key Decisions**:
- Next.js for SSR and routing
- FastAPI for async Python backend
- PostgreSQL for production database
- JWT for authentication
- RESTful API design
- Responsive design (Tailwind CSS)

**API Endpoints**:
```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
GET    /api/tags
POST   /api/tags
```

---

### Phase 3: Chatbot Interface

```
┌──────────────────────────────────────────────────────┐
│                Browser (Client)                       │
│  ┌────────────────────────────────────────────────┐  │
│  │     Chat Interface (Next.js)                   │  │
│  │  - Message Display                             │  │
│  │  - Input Field                                 │  │
│  │  - Hybrid UI (Chat + Traditional)              │  │
│  └────────────────┬───────────────────────────────┘  │
└───────────────────┼──────────────────────────────────┘
                    │ WebSocket
                    ▼
┌──────────────────────────────────────────────────────┐
│              MCP Server (FastAPI)                     │
│  ┌────────────────────────────────────────────────┐  │
│  │  MCP Protocol Handler                          │  │
│  └────────────────┬───────────────────────────────┘  │
│  ┌────────────────▼───────────────────────────────┐  │
│  │  MCP Tools                                     │  │
│  │  - create_task                                 │  │
│  │  - list_tasks                                  │  │
│  │  - update_task                                 │  │
│  │  - delete_task                                 │  │
│  │  - search_tasks                                │  │
│  └────────────────┬───────────────────────────────┘  │
└───────────────────┼──────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│              Claude API                               │
│  (Natural Language Understanding)                     │
└──────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│          PostgreSQL Database                          │
│  - Tasks, Users, Conversations                        │
└──────────────────────────────────────────────────────┘
```

**Key Decisions**:
- MCP for standardized AI tool interface
- WebSocket for real-time chat
- Claude API for NLU
- Conversation persistence
- Hybrid UI (chat + traditional forms)

**MCP Tools**:
```json
{
  "tools": [
    {
      "name": "create_task",
      "description": "Create a new task",
      "input_schema": {
        "type": "object",
        "properties": {
          "title": {"type": "string"},
          "priority": {"type": "string", "enum": ["low", "medium", "high"]}
        }
      }
    }
  ]
}
```

---

### Phase 4: Kubernetes Deployment

```
┌──────────────────────────────────────────────────────┐
│                  Ingress Controller                   │
│            (nginx-ingress / Traefik)                  │
└────────────────┬─────────────────────────────────────┘
                 │
       ┌─────────┴─────────┐
       │                   │
       ▼                   ▼
┌─────────────┐    ┌─────────────┐
│  Frontend   │    │   Backend   │
│  Service    │    │   Service   │
└──────┬──────┘    └──────┬──────┘
       │                  │
       │  ┌───────────────┘
       │  │
       ▼  ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│   Frontend     │  │    Backend     │  │   MCP Server   │
│   Deployment   │  │   Deployment   │  │   Deployment   │
│   (3 replicas) │  │   (3 replicas) │  │   (2 replicas) │
└────────────────┘  └────────┬───────┘  └────────┬───────┘
                             │                   │
                             └───────┬───────────┘
                                     │
                                     ▼
                          ┌──────────────────┐
                          │   PostgreSQL     │
                          │   StatefulSet    │
                          │   (PVC Storage)  │
                          └──────────────────┘
```

**Key Decisions**:
- Docker multi-stage builds
- Kubernetes Deployments for stateless services
- StatefulSet for database
- Persistent Volume Claims for data
- Helm charts for templating
- Horizontal Pod Autoscaling
- Ingress for external access
- ConfigMaps and Secrets for configuration

**Resource Allocation**:
```yaml
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "200m"
```

---

### Phase 5: Cloud-Native Architecture

```
┌──────────────────────────────────────────────────────┐
│                  Cloud Provider                       │
│                (AWS / GCP / Azure)                    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │         Load Balancer / CDN                  │    │
│  └────────────────┬─────────────────────────────┘    │
│                   │                                    │
│  ┌────────────────▼─────────────────────────────┐    │
│  │      Managed Kubernetes Service              │    │
│  │      (EKS / GKE / AKS)                       │    │
│  │                                               │    │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────┐  │    │
│  │  │ Frontend │  │ Backend  │  │ MCP Server│  │    │
│  │  │   Pods   │  │   Pods   │  │   Pods    │  │    │
│  │  └──────────┘  └────┬─────┘  └─────┬─────┘  │    │
│  └─────────────────────┼───────────────┼────────┘    │
│                        │               │              │
│  ┌─────────────────────▼───────────────▼────────┐    │
│  │       Managed Database Service               │    │
│  │       (RDS / Cloud SQL / Azure DB)           │    │
│  │       - Multi-AZ                             │    │
│  │       - Automated backups                    │    │
│  │       - Read replicas                        │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │     Object Storage (S3 / GCS / Blob)         │    │
│  │     - Static assets                          │    │
│  │     - File uploads                           │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │     Monitoring & Logging                     │    │
│  │     (CloudWatch / Stackdriver / Monitor)     │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
└──────────────────────────────────────────────────────┘
```

**Key Decisions**:
- Infrastructure as Code (Terraform)
- Managed Kubernetes (EKS/GKE/AKS)
- Managed Database (RDS/Cloud SQL)
- CDN for static assets
- Auto-scaling groups
- Multi-AZ deployment
- Monitoring (CloudWatch/Stackdriver)
- CI/CD (GitHub Actions)

**Cloud Services**:
- **Compute**: Managed Kubernetes
- **Database**: RDS PostgreSQL (Multi-AZ)
- **Storage**: S3/GCS for static assets
- **Cache**: ElastiCache/Memorystore (Redis)
- **CDN**: CloudFront/Cloud CDN
- **DNS**: Route53/Cloud DNS
- **Monitoring**: CloudWatch/Stackdriver
- **Secrets**: Secrets Manager/Secret Manager

---

## Data Model

### Core Entities

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'pending',
    due_date TIMESTAMP,
    recurrence_rule TEXT,  -- iCal RRULE format
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Tags
CREATE TABLE tags (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7),  -- Hex color
    created_at TIMESTAMP DEFAULT NOW()
);

-- Task-Tag Association
CREATE TABLE task_tags (
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
);

-- Conversations (Phase 3+)
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages (Phase 3+)
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,  -- 'user' or 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Relationships

```
users (1) ────< (N) tasks
users (1) ────< (N) tags
users (1) ────< (N) conversations

tasks (N) ────< (N) tags (through task_tags)

conversations (1) ────< (N) messages
```

## Security Architecture

### Authentication Flow

```
1. User submits credentials
2. Backend validates username/password
3. Backend generates JWT token (30min expiration)
4. Backend generates refresh token (7 days)
5. Frontend stores tokens (httpOnly cookies)
6. Subsequent requests include JWT in Authorization header
7. Backend validates JWT on each request
8. Refresh token used to get new JWT
```

### Authorization

```
- Role-Based Access Control (RBAC)
- Roles: user, admin
- Resource ownership check
- API endpoint protection (middleware)
```

### Data Protection

```
- Passwords: bcrypt hashing (cost factor: 12)
- HTTPS/TLS in production
- SQL injection: ORM (SQLAlchemy)
- XSS: Output sanitization
- CSRF: CSRF tokens
- Rate limiting: 100 req/min per IP
```

## Performance Optimizations

### Caching Strategy

```
- API responses: Redis cache (5min TTL)
- Static assets: CDN + browser cache
- Database queries: Connection pooling
- Expensive computations: In-memory cache
```

### Database Optimization

```
- Indexes on foreign keys
- Indexes on frequently queried columns
- Pagination (limit/offset)
- Query optimization (EXPLAIN ANALYZE)
- Read replicas for read-heavy operations
```

### Frontend Optimization

```
- Code splitting (Next.js dynamic imports)
- Lazy loading (images, routes)
- Bundle optimization (tree shaking)
- Static generation where possible
- Image optimization (WebP, responsive)
```

## Scalability Strategy

### Horizontal Scaling

```
- Stateless application servers
- Load balancer distribution
- Auto-scaling based on CPU/memory
- Database read replicas
```

### Vertical Scaling

```
- Database instance size
- Cache memory allocation
- Worker processes/threads
```

## Monitoring and Observability

### Metrics

```
- Application metrics (Prometheus)
- Business metrics (task creation rate, etc.)
- Infrastructure metrics (CPU, memory, disk)
- Custom metrics (API latency, error rates)
```

### Logging

```
- Structured logging (JSON format)
- Log levels (DEBUG, INFO, WARNING, ERROR)
- Centralized logging (ELK/CloudWatch)
- Request tracing (correlation IDs)
```

### Alerting

```
- Error rate > 5%
- Response time p95 > 1s
- Database connections > 80%
- Disk usage > 85%
- Failed deployments
```

## Disaster Recovery

### Backup Strategy

```
- Database: Automated daily backups (30-day retention)
- Application: Git version control
- Configuration: IaC in version control
- Secrets: Encrypted backup
```

### Recovery Procedures

```
- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 1 hour
- Runbook for common failures
- Regular DR drills
```

## Technology Stack Summary

| Component | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|-----------|---------|---------|---------|---------|---------|
| Frontend | CLI | Next.js | Next.js + Chat | Next.js | Next.js |
| Backend | Python | FastAPI | FastAPI + MCP | FastAPI | FastAPI |
| Database | SQLite | PostgreSQL | PostgreSQL | PostgreSQL | RDS/Cloud SQL |
| Auth | None | JWT | JWT | JWT | JWT |
| Deployment | Local | Docker Compose | Docker Compose | Kubernetes | Managed K8s |
| Infrastructure | - | - | - | K8s manifests | Terraform |

## Architecture Decision Records (ADRs)

See `docs/architecture-decisions.md` for detailed ADRs on:
- Choice of FastAPI over Flask/Django
- PostgreSQL over MySQL
- Next.js over Create React App
- MCP for chatbot integration
- Kubernetes for orchestration
- Terraform for IaC
