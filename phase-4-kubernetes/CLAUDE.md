# Phase 4: Kubernetes Deployment - Claude Guide

## Overview
Containerize and deploy to Kubernetes.

## Before You Start
1. Read: `@specs/phases/phase-4-kubernetes.md`
2. Review: `@skills/kubernetes-deployer-skill.md`
3. Use: `@skills/dockerizer.py` to generate Dockerfiles
4. Have Kubernetes cluster ready (minikube, kind, or cloud)

## Implementation Order
1. Create Dockerfiles (use dockerizer.py)
2. Build and test images locally
3. Write Kubernetes manifests
4. Test on local cluster
5. Create Helm charts
6. Set up monitoring
7. Write deployment documentation

## Generate Dockerfiles
```bash
python ../skills/dockerizer.py all --output-dir ./docker
```

## Build Images
```bash
docker build -t evolution-todo-frontend:latest -f docker/Dockerfile.frontend ../phase-2-web/frontend
docker build -t evolution-todo-backend:latest -f docker/Dockerfile.backend ../phase-2-web/backend
docker build -t evolution-todo-mcp:latest -f docker/Dockerfile.mcp ../phase-3-chatbot/mcp-server
```

## Deploy to K8s
```bash
kubectl apply -f k8s/
# Or using Helm
helm install evolution-todo ./helm/evolution-todo
```

## Key Additions
- Docker multi-stage builds
- K8s Deployments, Services, StatefulSets
- ConfigMaps and Secrets
- Ingress configuration
- Horizontal Pod Autoscaling
- Helm charts

## Next Phase
Phase 5 deploys to cloud with managed services.
