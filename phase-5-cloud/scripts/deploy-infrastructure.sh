#!/bin/bash
# =============================================================================
# Deploy Infrastructure with Terraform
# =============================================================================

set -e

# Default values
ENVIRONMENT="${1:-dev}"
ACTION="${2:-plan}"
AUTO_APPROVE=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -a|--action)
            ACTION="$2"
            shift 2
            ;;
        --auto-approve)
            AUTO_APPROVE="-auto-approve"
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    echo -e "${RED}Error: Invalid environment. Use: dev, staging, or prod${NC}"
    exit 1
fi

# Validate action
if [[ ! "$ACTION" =~ ^(plan|apply|destroy|output)$ ]]; then
    echo -e "${RED}Error: Invalid action. Use: plan, apply, destroy, or output${NC}"
    exit 1
fi

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Terraform ${ACTION} - ${ENVIRONMENT}${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/../terraform"

cd "$TERRAFORM_DIR"

# Check for required environment variable
if [ -z "$TF_VAR_db_password" ]; then
    echo -e "${YELLOW}Warning: TF_VAR_db_password not set${NC}"
    read -sp "Enter database password: " TF_VAR_db_password
    export TF_VAR_db_password
    echo ""
fi

# Initialize Terraform
echo -e "${YELLOW}Initializing Terraform...${NC}"
terraform init \
    -backend-config="bucket=evolution-todo-terraform-state" \
    -backend-config="key=${ENVIRONMENT}/terraform.tfstate" \
    -backend-config="region=${AWS_REGION:-us-east-1}" \
    -backend-config="dynamodb_table=evolution-todo-terraform-locks" \
    -reconfigure

# Execute action
case $ACTION in
    plan)
        echo -e "${YELLOW}Running Terraform plan...${NC}"
        terraform plan \
            -var-file="environments/${ENVIRONMENT}/terraform.tfvars" \
            -out="tfplan-${ENVIRONMENT}"
        echo ""
        echo -e "${GREEN}Plan saved to: tfplan-${ENVIRONMENT}${NC}"
        echo "To apply, run: $0 -e $ENVIRONMENT -a apply"
        ;;

    apply)
        if [ -f "tfplan-${ENVIRONMENT}" ]; then
            echo -e "${YELLOW}Applying saved plan...${NC}"
            terraform apply $AUTO_APPROVE "tfplan-${ENVIRONMENT}"
        else
            echo -e "${YELLOW}Running Terraform apply...${NC}"
            terraform apply \
                -var-file="environments/${ENVIRONMENT}/terraform.tfvars" \
                $AUTO_APPROVE
        fi
        echo ""
        echo -e "${GREEN}Infrastructure deployed!${NC}"
        echo ""
        echo "To configure kubectl, run:"
        terraform output eks_kubeconfig_command
        ;;

    destroy)
        echo -e "${RED}WARNING: This will destroy all infrastructure!${NC}"
        if [ -z "$AUTO_APPROVE" ]; then
            read -p "Are you sure? Type 'yes' to confirm: " confirm
            if [ "$confirm" != "yes" ]; then
                echo "Aborted."
                exit 0
            fi
        fi
        echo -e "${YELLOW}Running Terraform destroy...${NC}"
        terraform destroy \
            -var-file="environments/${ENVIRONMENT}/terraform.tfvars" \
            $AUTO_APPROVE
        ;;

    output)
        echo -e "${YELLOW}Terraform outputs:${NC}"
        terraform output
        ;;
esac

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
