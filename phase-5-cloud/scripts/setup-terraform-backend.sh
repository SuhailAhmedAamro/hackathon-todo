#!/bin/bash
# =============================================================================
# Setup Terraform Backend (S3 + DynamoDB)
# Run this ONCE before using Terraform
# =============================================================================

set -e

# Configuration
PROJECT_NAME="evolution-todo"
AWS_REGION="${AWS_REGION:-us-east-1}"
BUCKET_NAME="${PROJECT_NAME}-terraform-state"
DYNAMODB_TABLE="${PROJECT_NAME}-terraform-locks"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Setting up Terraform Backend${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
fi

# Check AWS credentials
echo -e "${YELLOW}Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured${NC}"
    echo "Run: aws configure"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✓ AWS Account: ${ACCOUNT_ID}${NC}"

# Create S3 bucket
echo ""
echo -e "${YELLOW}Creating S3 bucket for Terraform state...${NC}"

if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo -e "${GREEN}✓ Bucket already exists: ${BUCKET_NAME}${NC}"
else
    aws s3api create-bucket \
        --bucket "$BUCKET_NAME" \
        --region "$AWS_REGION" \
        $(if [ "$AWS_REGION" != "us-east-1" ]; then echo "--create-bucket-configuration LocationConstraint=$AWS_REGION"; fi)
    echo -e "${GREEN}✓ Created bucket: ${BUCKET_NAME}${NC}"
fi

# Enable versioning
echo -e "${YELLOW}Enabling versioning...${NC}"
aws s3api put-bucket-versioning \
    --bucket "$BUCKET_NAME" \
    --versioning-configuration Status=Enabled
echo -e "${GREEN}✓ Versioning enabled${NC}"

# Enable encryption
echo -e "${YELLOW}Enabling encryption...${NC}"
aws s3api put-bucket-encryption \
    --bucket "$BUCKET_NAME" \
    --server-side-encryption-configuration '{
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                },
                "BucketKeyEnabled": true
            }
        ]
    }'
echo -e "${GREEN}✓ Encryption enabled${NC}"

# Block public access
echo -e "${YELLOW}Blocking public access...${NC}"
aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration '{
        "BlockPublicAcls": true,
        "IgnorePublicAcls": true,
        "BlockPublicPolicy": true,
        "RestrictPublicBuckets": true
    }'
echo -e "${GREEN}✓ Public access blocked${NC}"

# Create DynamoDB table for locking
echo ""
echo -e "${YELLOW}Creating DynamoDB table for state locking...${NC}"

if aws dynamodb describe-table --table-name "$DYNAMODB_TABLE" &>/dev/null; then
    echo -e "${GREEN}✓ Table already exists: ${DYNAMODB_TABLE}${NC}"
else
    aws dynamodb create-table \
        --table-name "$DYNAMODB_TABLE" \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST \
        --region "$AWS_REGION"

    echo -e "${YELLOW}Waiting for table to be active...${NC}"
    aws dynamodb wait table-exists --table-name "$DYNAMODB_TABLE"
    echo -e "${GREEN}✓ Created table: ${DYNAMODB_TABLE}${NC}"
fi

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Backend Setup Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo "Add this to your terraform/versions.tf:"
echo ""
echo -e "${YELLOW}backend \"s3\" {"
echo "  bucket         = \"${BUCKET_NAME}\""
echo "  key            = \"<environment>/terraform.tfstate\""
echo "  region         = \"${AWS_REGION}\""
echo "  encrypt        = true"
echo "  dynamodb_table = \"${DYNAMODB_TABLE}\""
echo -e "}${NC}"
echo ""
echo "Then run: terraform init"
