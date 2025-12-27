# Skill: Docker Generator - Automated Dockerfile Creation

## Purpose
Automatically generates optimized, production-ready Dockerfiles for all application types in the Evolution of Todo project. Creates multi-stage builds with security best practices and minimal image sizes.

## Capabilities
- Generate Dockerfiles for frontend (Next.js)
- Generate Dockerfiles for backend (FastAPI/Python)
- Generate Dockerfiles for MCP server
- Create .dockerignore files
- Generate docker-compose.yml configurations
- Optimize for layer caching
- Apply security best practices
- Create multi-stage builds

## Usage

### Command Syntax
```
"Generate Dockerfile for [frontend|backend|mcp] using @skills/docker-generator-skill.md"
"Create docker-compose configuration using @skills/docker-generator-skill.md"
"Generate optimized Dockerfile for production using @skills/docker-generator-skill.md"
```

### Input Format
```yaml
type: frontend|backend|mcp|compose
environment: development|production
base_image: node:18-alpine|python:3.11-slim
optimizations:
  - multi-stage
  - layer-caching
  - security-hardening
```

## Generation Templates

### Frontend (Next.js) Dockerfile
```dockerfile
# Evolution Todo - Frontend Dockerfile
# Multi-stage build for optimal size and security

# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner (Production)
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
```

### Backend (FastAPI/Python) Dockerfile
```dockerfile
# Evolution Todo - Backend Dockerfile
# Multi-stage build for Python FastAPI application

# Stage 1: Base
FROM python:3.11-slim AS base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_DEFAULT_TIMEOUT=100

WORKDIR /app

# Stage 2: Dependencies
FROM base AS deps

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 3: Production
FROM base AS runner

# Copy dependencies from deps stage
COPY --from=deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin

# Create non-root user
RUN useradd -m -u 1001 appuser && \
    chown -R appuser:appuser /app

# Copy application code
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/health', timeout=2)"

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### MCP Server Dockerfile
```dockerfile
# Evolution Todo - MCP Server Dockerfile
# Optimized for AI/MCP workloads

FROM python:3.11-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

FROM base AS deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM base AS runner

COPY --from=deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin

RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
COPY --chown=appuser:appuser . .

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:3000/health', timeout=2)"

CMD ["python", "src/server.py"]
```

### .dockerignore Template
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
*.egg
*.egg-info/
dist/
build/
*.whl
.pytest_cache/
.coverage
htmlcov/
.tox/
venv/
env/
ENV/

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.next/
out/
.cache/

# Environment
.env
.env.*
!.env.example

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Git
.git/
.gitignore
.github/

# Documentation
*.md
!README.md
docs/

# Tests
tests/
*.test.js
*.test.ts
*.test.tsx
*.spec.js
*.spec.ts

# CI/CD
.gitlab-ci.yml
.circleci/
.travis.yml

# Other
Dockerfile*
docker-compose*.yml
*.log
```

### docker-compose.yml Template
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: evolution-todo-db
    environment:
      POSTGRES_USER: ${DB_USER:-todouser}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-todopassword}
      POSTGRES_DB: ${DB_NAME:-tododb}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-todouser}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - evolution-todo

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: evolution-todo-redis
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - evolution-todo

  # FastAPI Backend
  backend:
    build:
      context: ./phase-2-web/backend
      dockerfile: Dockerfile
      target: runner
    container_name: evolution-todo-backend
    environment:
      DATABASE_URL: postgresql://${DB_USER:-todouser}:${DB_PASSWORD:-todopassword}@postgres:5432/${DB_NAME:-tododb}
      REDIS_URL: redis://redis:6379/0
      SECRET_KEY: ${SECRET_KEY:-dev-secret-key-change-in-production}
      ENVIRONMENT: ${ENVIRONMENT:-development}
    ports:
      - "${BACKEND_PORT:-8000}:8000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./phase-2-web/backend:/app
    command: uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
    networks:
      - evolution-todo

  # Next.js Frontend
  frontend:
    build:
      context: ./phase-2-web/frontend
      dockerfile: Dockerfile
      target: runner
    container_name: evolution-todo-frontend
    environment:
      NEXT_PUBLIC_API_URL: ${API_URL:-http://localhost:8000}
      NODE_ENV: ${NODE_ENV:-development}
    ports:
      - "${FRONTEND_PORT:-3000}:3000"
    depends_on:
      - backend
    volumes:
      - ./phase-2-web/frontend:/app
      - /app/node_modules
      - /app/.next
    networks:
      - evolution-todo

  # MCP Server (Phase 3+)
  mcp-server:
    build:
      context: ./phase-3-chatbot/mcp-server
      dockerfile: Dockerfile
      target: runner
    container_name: evolution-todo-mcp
    environment:
      DATABASE_URL: postgresql://${DB_USER:-todouser}:${DB_PASSWORD:-todopassword}@postgres:5432/${DB_NAME:-tododb}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      MCP_SERVER_PORT: ${MCP_PORT:-3001}
    ports:
      - "${MCP_PORT:-3001}:3000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./phase-3-chatbot/mcp-server:/app
    networks:
      - evolution-todo

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  evolution-todo:
    driver: bridge
    name: evolution-todo-network
```

## Best Practices Applied

### 1. Multi-Stage Builds
- Separate dependency installation from runtime
- Reduce final image size by 60-80%
- Copy only necessary artifacts

### 2. Layer Caching
- Copy package files before source code
- Dependencies cached unless package.json changes
- Faster rebuilds during development

### 3. Security Hardening
- Run as non-root user (uid 1001)
- Minimal base images (alpine, slim)
- No unnecessary packages
- Security scanning ready

### 4. Health Checks
- Every service has health check
- Proper start period for slow starts
- Retries for transient failures

### 5. Environment Variables
- All configuration externalized
- Defaults for development
- Override for production

## Usage Examples

### Example 1: Generate All Dockerfiles
```bash
# Using the dockerizer.py script
python skills/dockerizer.py all --output-dir phase-4-kubernetes/docker

# Output:
# ✅ Generated Dockerfile.frontend
# ✅ Generated Dockerfile.backend
# ✅ Generated Dockerfile.mcp
# ✅ Generated .dockerignore
```

### Example 2: Build Images
```bash
# Frontend
docker build -t evolution-todo-frontend:latest \
  -f phase-4-kubernetes/docker/Dockerfile.frontend \
  ./phase-2-web/frontend

# Backend
docker build -t evolution-todo-backend:latest \
  -f phase-4-kubernetes/docker/Dockerfile.backend \
  ./phase-2-web/backend

# MCP Server
docker build -t evolution-todo-mcp:latest \
  -f phase-4-kubernetes/docker/Dockerfile.mcp \
  ./phase-3-chatbot/mcp-server
```

### Example 3: Development with Docker Compose
```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up backend

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Example 4: Production Build
```bash
# Build with specific tag
docker build -t evolution-todo-frontend:v1.0.0 \
  -f Dockerfile.frontend \
  --target runner \
  .

# Push to registry
docker tag evolution-todo-frontend:v1.0.0 your-registry/evolution-todo-frontend:v1.0.0
docker push your-registry/evolution-todo-frontend:v1.0.0
```

## Image Size Optimization

### Before Optimization
- Frontend: ~1.2GB
- Backend: ~900MB
- MCP: ~850MB

### After Multi-Stage Build
- Frontend: ~150MB (87% reduction)
- Backend: ~200MB (78% reduction)
- MCP: ~180MB (79% reduction)

## Dependencies
- Docker Engine 20.10+
- Docker Compose 2.0+ (for compose files)
- Base images: node:18-alpine, python:3.11-slim

## Integration Points
- Used by: `@skills/helm-chart-skill.md` (K8s deployments)
- Used by: `@skills/blueprints/minikube-deployment.yaml`
- Used by: `@skills/blueprints/cloud-deployment.yaml`
- References: `@specs/phases/phase-4-kubernetes.md`

## Success Metrics
- Image build time < 5 minutes
- Final image size < 200MB per service
- Security scan: 0 critical vulnerabilities
- Build cache hit rate > 80%
- Health checks passing

## Notes for Claude Code
When using this skill:
1. Always generate .dockerignore first
2. Use multi-stage builds
3. Run as non-root user
4. Include health checks
5. Test locally before deploying
6. Scan for vulnerabilities
7. Document any custom configurations
