#!/bin/bash
# =============================================================================
# Deploy Application to EKS
# =============================================================================

set -e

# Default values
ENVIRONMENT="${1:-dev}"
IMAGE_TAG="${2:-latest}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
PROJECT_NAME="evolution-todo"
AWS_REGION="${AWS_REGION:-us-east-1}"

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Deploy Application - ${ENVIRONMENT}${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI not installed${NC}"
    exit 1
fi

if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl not installed${NC}"
    exit 1
fi

if ! command -v helm &> /dev/null; then
    echo -e "${RED}Error: Helm not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites met${NC}"

# Get AWS account ID and ECR registry
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo ""
echo -e "${YELLOW}Configuration:${NC}"
echo "  Environment: ${ENVIRONMENT}"
echo "  AWS Region:  ${AWS_REGION}"
echo "  ECR Registry: ${ECR_REGISTRY}"
echo "  Image Tag:   ${IMAGE_TAG}"
echo ""

# Update kubeconfig
echo -e "${YELLOW}Updating kubeconfig...${NC}"
aws eks update-kubeconfig \
    --name "${PROJECT_NAME}-${ENVIRONMENT}-cluster" \
    --region "${AWS_REGION}"
echo -e "${GREEN}✓ kubeconfig updated${NC}"

# Login to ECR
echo -e "${YELLOW}Logging into ECR...${NC}"
aws ecr get-login-password --region "${AWS_REGION}" | \
    docker login --username AWS --password-stdin "${ECR_REGISTRY}"
echo -e "${GREEN}✓ ECR login successful${NC}"

# Build and push images (optional - skip if using CI/CD)
read -p "Build and push Docker images? (y/N) " build_images
if [[ "$build_images" =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}Building Docker images...${NC}"

    # Frontend
    echo "Building frontend..."
    docker build \
        -t "${ECR_REGISTRY}/${PROJECT_NAME}-${ENVIRONMENT}/frontend:${IMAGE_TAG}" \
        -f "${ROOT_DIR}/phase-4-kubernetes/docker/Dockerfile.frontend" \
        "${ROOT_DIR}/phase-2-web/frontend"
    docker push "${ECR_REGISTRY}/${PROJECT_NAME}-${ENVIRONMENT}/frontend:${IMAGE_TAG}"

    # Backend
    echo "Building backend..."
    docker build \
        -t "${ECR_REGISTRY}/${PROJECT_NAME}-${ENVIRONMENT}/backend:${IMAGE_TAG}" \
        -f "${ROOT_DIR}/phase-4-kubernetes/docker/Dockerfile.backend" \
        "${ROOT_DIR}/phase-2-web/backend"
    docker push "${ECR_REGISTRY}/${PROJECT_NAME}-${ENVIRONMENT}/backend:${IMAGE_TAG}"

    # MCP
    echo "Building MCP server..."
    docker build \
        -t "${ECR_REGISTRY}/${PROJECT_NAME}-${ENVIRONMENT}/mcp:${IMAGE_TAG}" \
        -f "${ROOT_DIR}/phase-4-kubernetes/docker/Dockerfile.mcp" \
        "${ROOT_DIR}/phase-3-chatbot/mcp-server"
    docker push "${ECR_REGISTRY}/${PROJECT_NAME}-${ENVIRONMENT}/mcp:${IMAGE_TAG}"

    echo -e "${GREEN}✓ Images built and pushed${NC}"
fi

# Deploy with Helm
echo ""
echo -e "${YELLOW}Deploying with Helm...${NC}"

NAMESPACE="${PROJECT_NAME}-${ENVIRONMENT}"

helm upgrade --install "${PROJECT_NAME}" \
    "${ROOT_DIR}/phase-4-kubernetes/helm/evolution-todo" \
    --namespace "${NAMESPACE}" \
    --create-namespace \
    --set global.namespace="${NAMESPACE}" \
    --set global.environment="${ENVIRONMENT}" \
    --set frontend.image.repository="${ECR_REGISTRY}/${PROJECT_NAME}-${ENVIRONMENT}/frontend" \
    --set frontend.image.tag="${IMAGE_TAG}" \
    --set backend.image.repository="${ECR_REGISTRY}/${PROJECT_NAME}-${ENVIRONMENT}/backend" \
    --set backend.image.tag="${IMAGE_TAG}" \
    --set mcp.image.repository="${ECR_REGISTRY}/${PROJECT_NAME}-${ENVIRONMENT}/mcp" \
    --set mcp.image.tag="${IMAGE_TAG}" \
    --wait \
    --timeout 10m

echo -e "${GREEN}✓ Helm deployment complete${NC}"

# Verify deployment
echo ""
echo -e "${YELLOW}Verifying deployment...${NC}"
kubectl rollout status deployment/frontend -n "${NAMESPACE}" --timeout=5m
kubectl rollout status deployment/backend -n "${NAMESPACE}" --timeout=5m
kubectl rollout status deployment/mcp -n "${NAMESPACE}" --timeout=5m
echo -e "${GREEN}✓ All deployments ready${NC}"

# Show status
echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "${YELLOW}Pods:${NC}"
kubectl get pods -n "${NAMESPACE}"
echo ""
echo -e "${YELLOW}Services:${NC}"
kubectl get svc -n "${NAMESPACE}"
echo ""
echo -e "${YELLOW}Ingress:${NC}"
kubectl get ingress -n "${NAMESPACE}"
echo ""

# Get application URL
APP_URL=$(kubectl get ingress -n "${NAMESPACE}" -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "pending")
if [ "$APP_URL" != "pending" ] && [ -n "$APP_URL" ]; then
    echo -e "${GREEN}Application URL: http://${APP_URL}${NC}"
else
    echo -e "${YELLOW}Ingress URL is pending. Check again with:${NC}"
    echo "kubectl get ingress -n ${NAMESPACE}"
fi
