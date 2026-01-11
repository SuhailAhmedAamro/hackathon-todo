#!/bin/bash
# Evolution Todo - Deploy to Kubernetes
# Usage: ./deploy.sh [--helm] [--namespace NAMESPACE]

set -e

# Default values
USE_HELM=false
NAMESPACE="evolution-todo"
VALUES_FILE=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --helm)
            USE_HELM=true
            shift
            ;;
        --namespace)
            NAMESPACE="$2"
            shift 2
            ;;
        --values)
            VALUES_FILE="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Evolution Todo - Deploying to K8s${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="$SCRIPT_DIR/../k8s"
HELM_DIR="$SCRIPT_DIR/../helm/evolution-todo"

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl is not installed${NC}"
    exit 1
fi

# Check cluster connection
echo -e "${YELLOW}Checking cluster connection...${NC}"
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}Error: Cannot connect to Kubernetes cluster${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Connected to cluster${NC}"

if [ "$USE_HELM" = true ]; then
    # Deploy using Helm
    echo ""
    echo -e "${YELLOW}Deploying with Helm...${NC}"

    # Check if helm is available
    if ! command -v helm &> /dev/null; then
        echo -e "${RED}Error: helm is not installed${NC}"
        exit 1
    fi

    HELM_CMD="helm upgrade --install evolution-todo $HELM_DIR --namespace $NAMESPACE --create-namespace"

    if [ -n "$VALUES_FILE" ]; then
        HELM_CMD="$HELM_CMD -f $VALUES_FILE"
    fi

    echo "Running: $HELM_CMD"
    eval $HELM_CMD

    echo -e "${GREEN}✓ Helm deployment complete${NC}"
else
    # Deploy using kubectl
    echo ""
    echo -e "${YELLOW}Deploying with kubectl...${NC}"

    # Create namespace
    echo -e "${YELLOW}Creating namespace...${NC}"
    kubectl apply -f "$K8S_DIR/namespace.yaml"
    echo -e "${GREEN}✓ Namespace created${NC}"

    # Apply ConfigMaps
    echo -e "${YELLOW}Applying ConfigMaps...${NC}"
    kubectl apply -f "$K8S_DIR/configmaps/"
    echo -e "${GREEN}✓ ConfigMaps applied${NC}"

    # Check for secrets (user must create these)
    if [ ! -f "$K8S_DIR/secrets/db-secret.yaml" ] || [ ! -f "$K8S_DIR/secrets/app-secret.yaml" ]; then
        echo -e "${YELLOW}Warning: Secret files not found!${NC}"
        echo "Please create secrets from the example files:"
        echo "  cp $K8S_DIR/secrets/db-secret.yaml.example $K8S_DIR/secrets/db-secret.yaml"
        echo "  cp $K8S_DIR/secrets/app-secret.yaml.example $K8S_DIR/secrets/app-secret.yaml"
        echo "Then edit them with your actual values."
        echo ""
        read -p "Press Enter to continue (secrets will not be applied)..."
    else
        echo -e "${YELLOW}Applying Secrets...${NC}"
        kubectl apply -f "$K8S_DIR/secrets/db-secret.yaml"
        kubectl apply -f "$K8S_DIR/secrets/app-secret.yaml"
        echo -e "${GREEN}✓ Secrets applied${NC}"
    fi

    # Apply Services
    echo -e "${YELLOW}Applying Services...${NC}"
    kubectl apply -f "$K8S_DIR/services/"
    echo -e "${GREEN}✓ Services applied${NC}"

    # Apply Deployments
    echo -e "${YELLOW}Applying Deployments...${NC}"
    kubectl apply -f "$K8S_DIR/deployments/"
    echo -e "${GREEN}✓ Deployments applied${NC}"

    # Apply Ingress
    echo -e "${YELLOW}Applying Ingress...${NC}"
    kubectl apply -f "$K8S_DIR/ingress.yaml"
    echo -e "${GREEN}✓ Ingress applied${NC}"

    # Apply HPA
    echo -e "${YELLOW}Applying HPA...${NC}"
    kubectl apply -f "$K8S_DIR/hpa.yaml"
    echo -e "${GREEN}✓ HPA applied${NC}"
fi

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# Show deployment status
echo -e "${YELLOW}Deployment Status:${NC}"
kubectl get deployments -n $NAMESPACE
echo ""
echo -e "${YELLOW}Pod Status:${NC}"
kubectl get pods -n $NAMESPACE
echo ""
echo -e "${YELLOW}Service Status:${NC}"
kubectl get services -n $NAMESPACE
echo ""

echo "To watch the deployment progress:"
echo "  kubectl get pods -n $NAMESPACE -w"
echo ""
echo "To view logs:"
echo "  kubectl logs -f deployment/frontend -n $NAMESPACE"
echo "  kubectl logs -f deployment/backend -n $NAMESPACE"
echo "  kubectl logs -f deployment/mcp -n $NAMESPACE"
