# Phase 4: Kubernetes Deployment

Container orchestration with Kubernetes.

## Prerequisites
- Docker installed
- Kubernetes cluster (minikube/kind/cloud)
- kubectl configured
- Helm 3 installed

## Build Images
```bash
# Generate Dockerfiles
python ../skills/dockerizer.py all

# Build images
docker build -t evolution-todo-frontend:latest -f docker/Dockerfile.frontend ../phase-2-web/frontend
docker build -t evolution-todo-backend:latest -f docker/Dockerfile.backend ../phase-2-web/backend
docker build -t evolution-todo-mcp:latest -f docker/Dockerfile.mcp ../phase-3-chatbot/mcp-server
```

## Deploy

### Using kubectl
```bash
# Create namespace
kubectl create namespace evolution-todo

# Apply manifests
kubectl apply -f k8s/ -n evolution-todo

# Check status
kubectl get all -n evolution-todo
```

### Using Helm
```bash
helm install evolution-todo ./helm/evolution-todo -n evolution-todo --create-namespace
```

## Access Application
```bash
# Port forward frontend
kubectl port-forward svc/frontend 3000:80 -n evolution-todo

# Access at http://localhost:3000
```

## Tech Stack
- Docker
- Kubernetes
- Helm
- nginx-ingress

## Specs
See `@specs/phases/phase-4-kubernetes.md`
