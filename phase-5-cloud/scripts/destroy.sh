#!/bin/bash
# =============================================================================
# Destroy Infrastructure (USE WITH CAUTION!)
# =============================================================================

set -e

# Default values
ENVIRONMENT="${1:-dev}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
PROJECT_NAME="evolution-todo"
AWS_REGION="${AWS_REGION:-us-east-1}"

echo -e "${RED}======================================${NC}"
echo -e "${RED}  DESTROY Infrastructure - ${ENVIRONMENT}${NC}"
echo -e "${RED}======================================${NC}"
echo ""
echo -e "${RED}WARNING: This will PERMANENTLY DELETE all resources!${NC}"
echo ""

# Confirm destruction
if [ "$ENVIRONMENT" = "prod" ]; then
    echo -e "${RED}!!! PRODUCTION ENVIRONMENT !!!${NC}"
    read -p "Type 'destroy-production' to confirm: " confirm
    if [ "$confirm" != "destroy-production" ]; then
        echo "Aborted."
        exit 0
    fi
else
    read -p "Type 'yes' to confirm destruction of ${ENVIRONMENT}: " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Aborted."
        exit 0
    fi
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/../terraform"

# Step 1: Delete Kubernetes resources
echo ""
echo -e "${YELLOW}Step 1: Deleting Kubernetes resources...${NC}"

NAMESPACE="${PROJECT_NAME}-${ENVIRONMENT}"

# Update kubeconfig
aws eks update-kubeconfig \
    --name "${PROJECT_NAME}-${ENVIRONMENT}-cluster" \
    --region "${AWS_REGION}" 2>/dev/null || true

# Delete Helm release
if helm status "${PROJECT_NAME}" -n "${NAMESPACE}" &>/dev/null; then
    echo "Deleting Helm release..."
    helm uninstall "${PROJECT_NAME}" -n "${NAMESPACE}" --wait
    echo -e "${GREEN}✓ Helm release deleted${NC}"
else
    echo "No Helm release found"
fi

# Delete namespace
if kubectl get namespace "${NAMESPACE}" &>/dev/null; then
    echo "Deleting namespace..."
    kubectl delete namespace "${NAMESPACE}" --wait=true --timeout=5m || true
    echo -e "${GREEN}✓ Namespace deleted${NC}"
fi

# Step 2: Destroy Terraform infrastructure
echo ""
echo -e "${YELLOW}Step 2: Destroying Terraform infrastructure...${NC}"

cd "$TERRAFORM_DIR"

# Check for required environment variable
if [ -z "$TF_VAR_db_password" ]; then
    read -sp "Enter database password (for Terraform): " TF_VAR_db_password
    export TF_VAR_db_password
    echo ""
fi

# Initialize Terraform
terraform init \
    -backend-config="bucket=evolution-todo-terraform-state" \
    -backend-config="key=${ENVIRONMENT}/terraform.tfstate" \
    -backend-config="region=${AWS_REGION}" \
    -backend-config="dynamodb_table=evolution-todo-terraform-locks" \
    -reconfigure

# Destroy infrastructure
terraform destroy \
    -var-file="environments/${ENVIRONMENT}/terraform.tfvars" \
    -auto-approve

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Infrastructure Destroyed!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo "Note: The Terraform state backend (S3 bucket and DynamoDB table)"
echo "has NOT been deleted. Delete manually if needed."
