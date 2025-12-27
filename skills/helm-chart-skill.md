# Skill: Helm Chart Generator - Kubernetes Package Management

## Purpose
Automatically generates Helm charts for Kubernetes deployments with best practices, templating, and multi-environment support. Simplifies deployment of Evolution of Todo across different Kubernetes clusters.

## Capabilities
- Generate complete Helm chart structure
- Create templated Kubernetes manifests
- Support multiple environments (dev/staging/prod)
- Implement rolling updates and rollbacks
- Configure auto-scaling
- Manage secrets and config maps
- Define health checks and probes
- Set resource limits

## Usage

### Command Syntax
```
"Generate Helm chart for [application] using @skills/helm-chart-skill.md"
"Create Helm values for [environment] using @skills/helm-chart-skill.md"
"Update Helm chart with [feature] using @skills/helm-chart-skill.md"
```

### Input Format
```yaml
chart_name: evolution-todo
app_version: 1.0.0
chart_version: 0.1.0
components:
  - frontend
  - backend
  - mcp-server
  - postgres
environments:
  - dev
  - staging
  - prod
```

## Chart Structure

```
helm/evolution-todo/
├── Chart.yaml                 # Chart metadata
├── values.yaml                # Default values
├── values-dev.yaml            # Development overrides
├── values-staging.yaml        # Staging overrides
├── values-prod.yaml           # Production overrides
├── templates/
│   ├── _helpers.tpl           # Template helpers
│   ├── NOTES.txt              # Post-install notes
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
│   │   └── app-secrets.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml               # Horizontal Pod Autoscaler
│   └── serviceaccount.yaml
└── README.md
```

## Template: Chart.yaml

```yaml
apiVersion: v2
name: evolution-todo
description: A Helm chart for Evolution of Todo application
type: application
version: 0.1.0
appVersion: "1.0.0"

keywords:
  - todo
  - productivity
  - ai
  - chatbot

maintainers:
  - name: Evolution Todo Team
    email: team@evolution-todo.com

dependencies: []
```

## Template: values.yaml

```yaml
# Default values for evolution-todo
# This is a YAML-formatted file.

global:
  environment: development
  namespace: evolution-todo

# Frontend (Next.js)
frontend:
  enabled: true
  replicaCount: 2

  image:
    repository: evolution-todo-frontend
    pullPolicy: IfNotPresent
    tag: "latest"

  service:
    type: ClusterIP
    port: 80
    targetPort: 3000

  resources:
    limits:
      cpu: 200m
      memory: 256Mi
    requests:
      cpu: 100m
      memory: 128Mi

  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
    targetCPUUtilizationPercentage: 70

  env:
    NEXT_PUBLIC_API_URL: "http://backend:80"
    NODE_ENV: production

# Backend (FastAPI)
backend:
  enabled: true
  replicaCount: 3

  image:
    repository: evolution-todo-backend
    pullPolicy: IfNotPresent
    tag: "latest"

  service:
    type: ClusterIP
    port: 80
    targetPort: 8000

  resources:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 250m
      memory: 256Mi

  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 10
    targetCPUUtilizationPercentage: 70

  env:
    DATABASE_URL: "postgresql://todouser:todopass@postgres:5432/tododb"
    REDIS_URL: "redis://redis:6379/0"
    LOG_LEVEL: "INFO"

# MCP Server
mcp:
  enabled: true
  replicaCount: 2

  image:
    repository: evolution-todo-mcp
    pullPolicy: IfNotPresent
    tag: "latest"

  service:
    type: ClusterIP
    port: 80
    targetPort: 3000

  resources:
    limits:
      cpu: 300m
      memory: 384Mi
    requests:
      cpu: 150m
      memory: 192Mi

  env:
    MCP_SERVER_PORT: "3000"

# PostgreSQL
postgres:
  enabled: true

  image:
    repository: postgres
    tag: "15-alpine"

  service:
    type: ClusterIP
    port: 5432

  persistence:
    enabled: true
    size: 10Gi
    storageClass: standard

  resources:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 250m
      memory: 256Mi

  env:
    POSTGRES_DB: tododb
    POSTGRES_USER: todouser
    # Password from secret

# Redis
redis:
  enabled: true

  image:
    repository: redis
    tag: "7-alpine"

  service:
    type: ClusterIP
    port: 6379

  resources:
    limits:
      cpu: 100m
      memory: 128Mi
    requests:
      cpu: 50m
      memory: 64Mi

# Ingress
ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"

  hosts:
    - host: todo.example.com
      paths:
        - path: /
          pathType: Prefix
          backend: frontend
        - path: /api
          pathType: Prefix
          backend: backend

  tls:
    - secretName: evolution-todo-tls
      hosts:
        - todo.example.com

# Secrets (from external secret manager or manual creation)
secrets:
  database:
    password: ""  # Override in values-{env}.yaml
  jwt:
    secret: ""     # Override in values-{env}.yaml
  anthropic:
    apiKey: ""     # Override in values-{env}.yaml
```

## Template: Deployment (Backend Example)

```yaml
# templates/deployments/backend.yaml
{{- if .Values.backend.enabled }}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "evolution-todo.fullname" . }}-backend
  labels:
    {{- include "evolution-todo.labels" . | nindent 4 }}
    app.kubernetes.io/component: backend
spec:
  {{- if not .Values.backend.autoscaling.enabled }}
  replicas: {{ .Values.backend.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "evolution-todo.selectorLabels" . | nindent 6 }}
      app.kubernetes.io/component: backend
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmaps/app-config.yaml") . | sha256sum }}
      labels:
        {{- include "evolution-todo.selectorLabels" . | nindent 8 }}
        app.kubernetes.io/component: backend
    spec:
      serviceAccountName: {{ include "evolution-todo.serviceAccountName" . }}
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      containers:
      - name: backend
        image: "{{ .Values.backend.image.repository }}:{{ .Values.backend.image.tag | default .Chart.AppVersion }}"
        imagePullPolicy: {{ .Values.backend.image.pullPolicy }}
        ports:
        - name: http
          containerPort: {{ .Values.backend.service.targetPort }}
          protocol: TCP
        env:
        {{- range $key, $value := .Values.backend.env }}
        - name: {{ $key }}
          value: {{ $value | quote }}
        {{- end }}
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: {{ include "evolution-todo.fullname" . }}-secrets
              key: database-password
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: {{ include "evolution-todo.fullname" . }}-secrets
              key: jwt-secret
        livenessProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: http
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2
        resources:
          {{- toYaml .Values.backend.resources | nindent 10 }}
        volumeMounts:
        - name: config
          mountPath: /app/config
          readOnly: true
      volumes:
      - name: config
        configMap:
          name: {{ include "evolution-todo.fullname" . }}-config
{{- end }}
```

## Template: HPA (Horizontal Pod Autoscaler)

```yaml
# templates/hpa.yaml
{{- if .Values.backend.autoscaling.enabled }}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "evolution-todo.fullname" . }}-backend
  labels:
    {{- include "evolution-todo.labels" . | nindent 4 }}
    app.kubernetes.io/component: backend
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "evolution-todo.fullname" . }}-backend
  minReplicas: {{ .Values.backend.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.backend.autoscaling.maxReplicas }}
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: {{ .Values.backend.autoscaling.targetCPUUtilizationPercentage }}
{{- end }}
```

## Environment-Specific Values

### values-prod.yaml
```yaml
global:
  environment: production

frontend:
  replicaCount: 5
  image:
    tag: "v1.0.0"
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 250m
      memory: 256Mi
  autoscaling:
    minReplicas: 5
    maxReplicas: 20

backend:
  replicaCount: 10
  image:
    tag: "v1.0.0"
  resources:
    limits:
      cpu: 1000m
      memory: 1Gi
    requests:
      cpu: 500m
      memory: 512Mi
  autoscaling:
    minReplicas: 10
    maxReplicas: 50

postgres:
  persistence:
    size: 100Gi
    storageClass: fast-ssd

ingress:
  hosts:
    - host: todo.production.com
      paths: [...]
```

## Usage Commands

### Install Chart
```bash
# Development
helm install evolution-todo ./helm/evolution-todo \
  -f ./helm/evolution-todo/values-dev.yaml \
  --namespace dev \
  --create-namespace

# Production
helm install evolution-todo ./helm/evolution-todo \
  -f ./helm/evolution-todo/values-prod.yaml \
  --namespace production \
  --create-namespace
```

### Upgrade Chart
```bash
helm upgrade evolution-todo ./helm/evolution-todo \
  -f ./helm/evolution-todo/values-prod.yaml \
  --namespace production
```

### Rollback
```bash
# List revisions
helm history evolution-todo -n production

# Rollback to previous
helm rollback evolution-todo -n production

# Rollback to specific revision
helm rollback evolution-todo 2 -n production
```

### Dry Run (Test)
```bash
helm install evolution-todo ./helm/evolution-todo \
  -f ./helm/evolution-todo/values-prod.yaml \
  --dry-run \
  --debug
```

### Uninstall
```bash
helm uninstall evolution-todo -n production
```

## Best Practices

### 1. Use Helpers
```yaml
# _helpers.tpl
{{- define "evolution-todo.fullname" -}}
{{- .Release.Name }}-{{ .Chart.Name }}
{{- end }}

{{- define "evolution-todo.labels" -}}
helm.sh/chart: {{ include "evolution-todo.chart" . }}
app.kubernetes.io/name: {{ include "evolution-todo.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
```

### 2. Version Everything
- Chart version in Chart.yaml
- App version in Chart.yaml
- Image tags in values.yaml
- Lock dependencies

### 3. Resource Limits
Always set requests and limits to:
- Prevent resource starvation
- Enable proper scheduling
- Support auto-scaling

### 4. Health Checks
- Liveness: Restart if unhealthy
- Readiness: Remove from load balancer if not ready
- Startup: Allow slow-starting apps

### 5. Secrets Management
- Never commit secrets to Git
- Use external secret managers (Sealed Secrets, External Secrets Operator)
- Override in environment-specific values

## Dependencies
- Kubernetes cluster 1.28+
- Helm 3.0+
- Docker images built (@skills/docker-generator-skill.md)
- kubectl configured

## Integration Points
- Uses: `@skills/docker-generator-skill.md` (Docker images)
- Used by: `@skills/blueprints/minikube-deployment.yaml`
- Used by: `@skills/blueprints/cloud-deployment.yaml`
- References: `@specs/phases/phase-4-kubernetes.md`

## Success Metrics
- Chart installs without errors
- All pods reach Ready state
- Health checks passing
- Auto-scaling triggers correctly
- Rollback completes in < 2 minutes
- Zero downtime deployments

## Notes for Claude Code
When using this skill:
1. Always test with --dry-run first
2. Use environment-specific values files
3. Never hardcode secrets
4. Set resource limits
5. Implement health checks
6. Test rollback procedure
7. Document custom values
