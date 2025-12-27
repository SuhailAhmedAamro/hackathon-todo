# Phase 4: Kubernetes Deployment - Specification

## Overview
Containerize the application and deploy it to Kubernetes with proper orchestration, scaling, and monitoring.

## Goals
- Create Docker images for all services
- Write Kubernetes manifests
- Create Helm charts for templating
- Implement auto-scaling
- Set up monitoring and logging
- Enable zero-downtime deployments

## Tech Stack
- **Containerization**: Docker
- **Orchestration**: Kubernetes 1.28+
- **Package Manager**: Helm 3
- **Ingress**: nginx-ingress / Traefik
- **Monitoring**: Prometheus + Grafana
- **Logging**: Fluentd / Loki

## Architecture

```
Ingress Controller
├── frontend-service → frontend-deployment (3 replicas)
├── backend-service → backend-deployment (3 replicas)
└── mcp-service → mcp-deployment (2 replicas)

database-service → postgres-statefulset (1 replica + PVC)
redis-service → redis-deployment (1 replica)
```

## Docker Images

### Frontend Dockerfile
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

### Backend Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Kubernetes Resources

### Deployments

**Frontend Deployment**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: evolution-todo-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: api_url
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

**Backend Deployment**: Similar structure

**PostgreSQL StatefulSet**:
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

### Services

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 8000
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
  clusterIP: None  # Headless service
```

### Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: evolution-todo-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: todo.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend
            port:
              number: 80
```

### ConfigMaps

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  api_url: "http://backend:80"
  database_host: "postgres"
  log_level: "INFO"
```

### Secrets

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  password: <base64-encoded-password>
  username: <base64-encoded-username>
```

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Helm Chart Structure

```
helm/
└── evolution-todo/
    ├── Chart.yaml
    ├── values.yaml
    ├── templates/
    │   ├── deployments/
    │   │   ├── frontend.yaml
    │   │   ├── backend.yaml
    │   │   └── mcp.yaml
    │   ├── services/
    │   │   ├── frontend.yaml
    │   │   ├── backend.yaml
    │   │   └── postgres.yaml
    │   ├── statefulsets/
    │   │   └── postgres.yaml
    │   ├── configmaps/
    │   │   └── app-config.yaml
    │   ├── secrets/
    │   │   └── db-secret.yaml
    │   ├── ingress.yaml
    │   └── hpa.yaml
    └── values-prod.yaml
```

## Monitoring Setup

### Prometheus

```yaml
apiVersion: v1
kind: ServiceMonitor
metadata:
  name: backend-monitor
spec:
  selector:
    matchLabels:
      app: backend
  endpoints:
  - port: metrics
    interval: 30s
```

### Grafana Dashboards
- Application metrics (request rate, latency, errors)
- Infrastructure metrics (CPU, memory, disk)
- Database metrics (connections, query performance)

## Project Structure

```
phase-4-kubernetes/
├── docker/
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── mcp.Dockerfile
├── k8s/
│   ├── deployments/
│   │   ├── frontend.yaml
│   │   ├── backend.yaml
│   │   ├── mcp.yaml
│   │   └── postgres.yaml
│   ├── services/
│   │   ├── frontend.yaml
│   │   ├── backend.yaml
│   │   ├── mcp.yaml
│   │   └── postgres.yaml
│   ├── configmaps/
│   │   └── app-config.yaml
│   ├── secrets/
│   │   └── db-secret.yaml.example
│   ├── ingress.yaml
│   └── hpa.yaml
├── helm/
│   └── evolution-todo/
│       └── ...
├── scripts/
│   ├── build-images.sh
│   ├── deploy.sh
│   └── rollback.sh
└── README.md
```

## Implementation Checklist

### Docker
- [ ] Write Dockerfiles for each service
- [ ] Optimize Docker images (multi-stage builds)
- [ ] Create .dockerignore files
- [ ] Build and test images locally
- [ ] Push images to registry

### Kubernetes
- [ ] Write Deployment manifests
- [ ] Write Service manifests
- [ ] Write StatefulSet for database
- [ ] Create ConfigMaps
- [ ] Create Secrets
- [ ] Write Ingress configuration
- [ ] Configure HPA
- [ ] Test on local cluster (minikube/kind)

### Helm
- [ ] Create Helm chart structure
- [ ] Define values.yaml
- [ ] Template Kubernetes resources
- [ ] Test Helm installation
- [ ] Create values overrides for environments

### Monitoring
- [ ] Set up Prometheus
- [ ] Configure ServiceMonitors
- [ ] Create Grafana dashboards
- [ ] Set up alerting rules
- [ ] Configure log aggregation

## Deployment Strategy

### Rolling Update
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

### Blue-Green Deployment
- Deploy new version alongside old
- Switch traffic via Ingress
- Rollback if issues detected

## Health Checks

```python
# Backend health endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.get("/readiness")
async def readiness_check(db: Session = Depends(get_db)):
    # Check database connection
    try:
        db.execute("SELECT 1")
        return {"status": "ready"}
    except Exception as e:
        raise HTTPException(status_code=503, detail="Not ready")
```

## Success Criteria
- [ ] All services containerized
- [ ] Kubernetes manifests deploy successfully
- [ ] Helm charts install without errors
- [ ] Auto-scaling works under load
- [ ] Zero-downtime deployments
- [ ] Health checks functional
- [ ] Monitoring dashboards show metrics
- [ ] Logs aggregated and searchable
- [ ] Documentation complete

## Next Phase
Phase 5 will deploy to cloud with managed services and Infrastructure as Code.
