# Skill: Kubernetes Deployment

## Overview
Patterns and troubleshooting for deploying applications to Kubernetes.

## Essential Kubectl Commands

### Cluster Info
```bash
kubectl cluster-info
kubectl get nodes
kubectl get namespaces
```

### Deployments
```bash
# Create deployment
kubectl apply -f deployment.yaml

# Get deployments
kubectl get deployments -n <namespace>

# Describe deployment
kubectl describe deployment <name> -n <namespace>

# Scale deployment
kubectl scale deployment <name> --replicas=5 -n <namespace>

# Update image
kubectl set image deployment/<name> container=image:tag -n <namespace>

# Rollback
kubectl rollout undo deployment/<name> -n <namespace>

# Check rollout status
kubectl rollout status deployment/<name> -n <namespace>
```

### Pods
```bash
# Get pods
kubectl get pods -n <namespace>

# Describe pod
kubectl describe pod <pod-name> -n <namespace>

# Logs
kubectl logs <pod-name> -n <namespace>
kubectl logs <pod-name> -f -n <namespace>  # Follow

# Execute command in pod
kubectl exec -it <pod-name> -n <namespace> -- /bin/sh

# Delete pod (will be recreated by deployment)
kubectl delete pod <pod-name> -n <namespace>
```

### Services
```bash
# Get services
kubectl get services -n <namespace>

# Port forward
kubectl port-forward service/<name> 8080:80 -n <namespace>
```

## Common Deployment Patterns

### Zero-Downtime Deployment
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max pods above desired count
      maxUnavailable: 0  # Ensure availability
```

### Health Checks
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Resource Limits
```yaml
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "200m"
```

## Troubleshooting Guide

### Pod Not Starting
```bash
# Check pod status
kubectl get pods -n <namespace>

# Check events
kubectl describe pod <pod-name> -n <namespace>

# Common issues:
# - Image pull error → Check image name/registry
# - CrashLoopBackOff → Check logs
# - Pending → Check resource availability
```

### Pod Crashes
```bash
# View logs
kubectl logs <pod-name> -n <namespace>

# Previous container logs
kubectl logs <pod-name> --previous -n <namespace>

# Common causes:
# - Application error
# - Failed health checks
# - OOM (Out of Memory)
```

### Service Not Accessible
```bash
# Check service
kubectl get svc <service-name> -n <namespace>

# Check endpoints
kubectl get endpoints <service-name> -n <namespace>

# Test from within cluster
kubectl run -it --rm debug --image=busybox --restart=Never -- wget -O- http://<service-name>

# Common issues:
# - Selector mismatch
# - No healthy pods
# - Firewall rules
```

### ConfigMap/Secret Issues
```bash
# View ConfigMap
kubectl get configmap <name> -n <namespace> -o yaml

# View Secret (base64 encoded)
kubectl get secret <name> -n <namespace> -o yaml

# Decode secret
kubectl get secret <name> -n <namespace> -o jsonpath='{.data.password}' | base64 -d
```

## Helm Patterns

### Install/Upgrade
```bash
# Install
helm install <release-name> <chart-path>

# Upgrade
helm upgrade <release-name> <chart-path>

# Install or upgrade
helm upgrade --install <release-name> <chart-path>

# With values
helm upgrade --install <release-name> <chart-path> -f values.yaml

# Dry run
helm upgrade --install <release-name> <chart-path> --dry-run --debug
```

### Debugging
```bash
# List releases
helm list -n <namespace>

# Get values
helm get values <release-name> -n <namespace>

# Get manifest
helm get manifest <release-name> -n <namespace>

# Rollback
helm rollback <release-name> <revision> -n <namespace>
```

## Best Practices

### 1. Use Namespaces
Isolate environments (dev, staging, prod)

### 2. Label Everything
```yaml
metadata:
  labels:
    app: evolution-todo
    component: backend
    version: v1.0.0
```

### 3. Set Resource Requests/Limits
Prevent resource starvation

### 4. Implement Health Checks
Enable automatic recovery

### 5. Use ConfigMaps for Configuration
Keep config separate from images

### 6. Use Secrets for Sensitive Data
Never hardcode credentials

### 7. Enable Auto-Scaling
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

## Phase 4 Application
Use this skill when implementing `/phase-4-kubernetes/`
