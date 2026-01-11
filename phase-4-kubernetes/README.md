# Phase 4: Kubernetes Deployment

Containerize and deploy the Evolution Todo application to Kubernetes with proper orchestration, scaling, and high availability.

## Architecture

```
                    ┌─────────────────────────────────────────┐
                    │            Ingress Controller           │
                    │         (nginx-ingress / traefik)       │
                    └──────────────────┬──────────────────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          │                            │                            │
          ▼                            ▼                            ▼
    ┌───────────┐              ┌───────────┐              ┌───────────┐
    │  Frontend │              │  Backend  │              │    MCP    │
    │  Service  │              │  Service  │              │  Service  │
    └─────┬─────┘              └─────┬─────┘              └─────┬─────┘
          │                          │                          │
          ▼                          ▼                          ▼
    ┌───────────┐              ┌───────────┐              ┌───────────┐
    │  Frontend │              │  Backend  │              │    MCP    │
    │Deployment │              │Deployment │              │Deployment │
    │(3 replicas)│             │(3 replicas)│             │(2 replicas)│
    └───────────┘              └─────┬─────┘              └─────┬─────┘
                                     │                          │
                                     └──────────┬───────────────┘
                                                │
                                                ▼
                                    ┌───────────────────┐
                                    │    PostgreSQL     │
                                    │   StatefulSet     │
                                    │   (with PVC)      │
                                    └───────────────────┘
```

## Prerequisites

- **Docker** 20.10+ installed
- **Kubernetes** 1.28+ cluster (minikube, kind, EKS, GKE, AKS)
- **kubectl** configured and connected to cluster
- **Helm** 3.x installed (for Helm deployments)

## Project Structure

```
phase-4-kubernetes/
├── docker/
│   ├── Dockerfile.frontend    # Next.js frontend image
│   ├── Dockerfile.backend     # FastAPI backend image
│   ├── Dockerfile.mcp         # MCP chatbot server image
│   └── .dockerignore          # Docker ignore patterns
├── k8s/
│   ├── namespace.yaml         # Kubernetes namespace
│   ├── deployments/
│   │   ├── frontend.yaml      # Frontend deployment
│   │   ├── backend.yaml       # Backend deployment
│   │   ├── mcp.yaml           # MCP server deployment
│   │   └── postgres.yaml      # PostgreSQL StatefulSet
│   ├── services/
│   │   ├── frontend.yaml      # Frontend service
│   │   ├── backend.yaml       # Backend service
│   │   ├── mcp.yaml           # MCP service
│   │   └── postgres.yaml      # PostgreSQL headless service
│   ├── configmaps/
│   │   └── app-config.yaml    # Application configuration
│   ├── secrets/
│   │   ├── db-secret.yaml.example    # Database secrets template
│   │   └── app-secret.yaml.example   # App secrets template
│   ├── ingress.yaml           # Ingress configuration
│   └── hpa.yaml               # Horizontal Pod Autoscalers
├── helm/
│   └── evolution-todo/
│       ├── Chart.yaml         # Helm chart metadata
│       ├── values.yaml        # Default values
│       ├── values-prod.yaml   # Production overrides
│       └── templates/         # Kubernetes templates
├── scripts/
│   ├── build-images.sh        # Build Docker images
│   ├── deploy.sh              # Deploy to Kubernetes
│   ├── rollback.sh            # Rollback deployment
│   └── setup-secrets.sh       # Interactive secret setup
├── CLAUDE.md                  # Claude Code guide
└── README.md                  # This file
```

## Quick Start

### 1. Build Docker Images

```bash
# Using the build script
./scripts/build-images.sh

# Or manually
docker build -t evolution-todo-frontend:latest -f docker/Dockerfile.frontend ../phase-2-web/frontend
docker build -t evolution-todo-backend:latest -f docker/Dockerfile.backend ../phase-2-web/backend
docker build -t evolution-todo-mcp:latest -f docker/Dockerfile.mcp ../phase-3-chatbot/mcp-server
```

### 2. Setup Secrets

```bash
# Interactive setup (recommended)
./scripts/setup-secrets.sh

# Or manually copy and edit
cp k8s/secrets/db-secret.yaml.example k8s/secrets/db-secret.yaml
cp k8s/secrets/app-secret.yaml.example k8s/secrets/app-secret.yaml
# Edit with your actual base64-encoded values
```

### 3. Deploy

#### Option A: Using kubectl (direct manifests)

```bash
./scripts/deploy.sh

# Or manually
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmaps/
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/services/
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

#### Option B: Using Helm

```bash
./scripts/deploy.sh --helm

# Or manually
helm install evolution-todo ./helm/evolution-todo \
  --namespace evolution-todo \
  --create-namespace

# For production
helm install evolution-todo ./helm/evolution-todo \
  --namespace evolution-todo-prod \
  --create-namespace \
  -f ./helm/evolution-todo/values-prod.yaml
```

### 4. Verify Deployment

```bash
# Check all resources
kubectl get all -n evolution-todo

# Watch pods come up
kubectl get pods -n evolution-todo -w

# Check logs
kubectl logs -f deployment/frontend -n evolution-todo
kubectl logs -f deployment/backend -n evolution-todo
kubectl logs -f deployment/mcp -n evolution-todo
```

### 5. Access Application

```bash
# Port forward for local access
kubectl port-forward svc/frontend 3000:80 -n evolution-todo
kubectl port-forward svc/backend 8000:80 -n evolution-todo

# Access at http://localhost:3000
```

For production, configure your Ingress with a real domain and TLS certificate.

## Configuration

### Environment Variables

**Frontend:**
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_MCP_URL` | MCP chatbot URL |

**Backend:**
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing key |
| `CORS_ORIGINS` | Allowed CORS origins |

**MCP Server:**
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Claude API key |
| `BACKEND_URL` | Internal backend URL |

### Scaling

The HPA (Horizontal Pod Autoscaler) is configured to automatically scale:

| Component | Min Replicas | Max Replicas | CPU Target |
|-----------|--------------|--------------|------------|
| Frontend  | 2            | 10           | 70%        |
| Backend   | 2            | 10           | 70%        |
| MCP       | 2            | 6            | 70%        |

Manual scaling:
```bash
kubectl scale deployment/frontend --replicas=5 -n evolution-todo
```

### Resource Limits

Default resource allocations:

| Component | CPU Request | CPU Limit | Memory Request | Memory Limit |
|-----------|-------------|-----------|----------------|--------------|
| Frontend  | 100m        | 200m      | 128Mi          | 256Mi        |
| Backend   | 200m        | 500m      | 256Mi          | 512Mi        |
| MCP       | 200m        | 500m      | 256Mi          | 512Mi        |
| PostgreSQL| 250m        | 500m      | 256Mi          | 512Mi        |

## Operations

### Rolling Updates

Deployments are configured for zero-downtime rolling updates:

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

### Rollback

```bash
# Using script
./scripts/rollback.sh

# Rollback specific component
./scripts/rollback.sh --component backend

# Rollback to specific revision
./scripts/rollback.sh --component backend --revision 2

# Using Helm
helm rollback evolution-todo -n evolution-todo
```

### Health Checks

All deployments have liveness and readiness probes:

- **Liveness**: Restarts container if unhealthy
- **Readiness**: Removes from service if not ready

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 5
```

### Monitoring

View deployment status:
```bash
# Pods
kubectl get pods -n evolution-todo

# Resource usage
kubectl top pods -n evolution-todo

# Events
kubectl get events -n evolution-todo --sort-by='.lastTimestamp'

# Describe deployments
kubectl describe deployment/backend -n evolution-todo
```

## Helm Chart

### Values

Key configuration in `values.yaml`:

```yaml
global:
  namespace: evolution-todo
  environment: production

frontend:
  replicaCount: 3
  image:
    repository: evolution-todo-frontend
    tag: latest
  resources:
    requests:
      memory: "128Mi"
      cpu: "100m"

backend:
  replicaCount: 3
  # ...

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: todo.example.com
```

### Upgrade

```bash
helm upgrade evolution-todo ./helm/evolution-todo \
  --namespace evolution-todo \
  --set frontend.replicaCount=5
```

## Troubleshooting

### Pods not starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n evolution-todo

# Check events
kubectl get events -n evolution-todo
```

### Database connection issues

```bash
# Verify PostgreSQL is running
kubectl get pods -l app=postgres -n evolution-todo

# Check database logs
kubectl logs statefulset/postgres -n evolution-todo

# Test connection
kubectl exec -it deployment/backend -n evolution-todo -- \
  python -c "from src.database import engine; print(engine.execute('SELECT 1'))"
```

### Ingress not working

```bash
# Check ingress status
kubectl describe ingress evolution-todo-ingress -n evolution-todo

# Verify ingress controller
kubectl get pods -n ingress-nginx
```

## Local Development with Minikube

```bash
# Start minikube
minikube start --cpus=4 --memory=8192

# Enable ingress
minikube addons enable ingress

# Build images in minikube
eval $(minikube docker-env)
./scripts/build-images.sh

# Deploy
./scripts/deploy.sh

# Access
minikube service frontend -n evolution-todo
```

## Tech Stack

- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes 1.28+
- **Package Manager**: Helm 3
- **Ingress**: nginx-ingress controller
- **Database**: PostgreSQL 15 (StatefulSet with PVC)
- **Auto-scaling**: HPA v2

## Next Steps

Phase 5 will deploy to cloud with:
- Managed Kubernetes (EKS/GKE/AKS)
- Managed PostgreSQL (RDS/Cloud SQL)
- CI/CD with GitHub Actions
- Infrastructure as Code with Terraform

## Specifications

See `@specs/phases/phase-4-kubernetes.md` for detailed requirements.
