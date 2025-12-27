# Deployment Guide

## Phase 1: Console CLI
No deployment needed. Distribute as Python package:
```bash
python setup.py sdist bdist_wheel
pip install dist/evolution-todo-1.0.0.tar.gz
```

## Phase 2: Web Application

### Development
```bash
docker-compose up
```

### Production (Traditional VPS)
```bash
# Backend
gunicorn src.main:app --workers 4 --bind 0.0.0.0:8000

# Frontend
npm run build
npm start

# Use nginx as reverse proxy
```

## Phase 3: Chatbot
Same as Phase 2, plus MCP server:
```bash
# Run MCP server
uvicorn src.server:app --host 0.0.0.0 --port 3000
```

## Phase 4: Kubernetes

### Local Cluster (minikube)
```bash
minikube start
kubectl apply -f k8s/
kubectl port-forward svc/frontend 3000:80
```

### Production Cluster
```bash
# Using Helm
helm upgrade --install evolution-todo ./helm/evolution-todo \
  --set frontend.image.tag=v1.0.0 \
  --set backend.image.tag=v1.0.0 \
  --namespace production
```

## Phase 5: Cloud

### AWS (EKS)
```bash
# Apply Terraform
cd terraform
terraform apply -var-file=environments/prod/terraform.tfvars

# Update kubeconfig
aws eks update-kubeconfig --name evolution-todo-cluster

# Deploy application
helm upgrade --install evolution-todo ../phase-4-kubernetes/helm/evolution-todo
```

### GCP (GKE)
```bash
# Apply Terraform
terraform apply -var-file=environments/prod/terraform.tfvars

# Get credentials
gcloud container clusters get-credentials evolution-todo-cluster

# Deploy
helm upgrade --install evolution-todo ../phase-4-kubernetes/helm/evolution-todo
```

## CI/CD Pipeline (GitHub Actions)
Automatically deploys on push to main:
1. Runs tests
2. Builds Docker images
3. Pushes to registry
4. Updates Kubernetes deployment

## Monitoring
- Logs: kubectl logs / CloudWatch / Stackdriver
- Metrics: Prometheus + Grafana
- Alerts: Configure in cloud provider

## Rollback
```bash
# Kubernetes
kubectl rollout undo deployment/backend

# Helm
helm rollback evolution-todo

# Terraform
terraform destroy (careful!)
```

## Zero-Downtime Deployment
Kubernetes handles this automatically with RollingUpdate strategy.

## Health Checks
All services expose `/health` endpoint for monitoring.
