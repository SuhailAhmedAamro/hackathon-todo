#!/bin/bash
# Evolution Todo - Setup Secrets
# Interactive script to create Kubernetes secrets

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Evolution Todo - Setup Secrets${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECRETS_DIR="$SCRIPT_DIR/../k8s/secrets"

echo -e "${YELLOW}This script will help you create Kubernetes secrets.${NC}"
echo ""

# Database secrets
echo -e "${GREEN}Database Configuration${NC}"
echo "----------------------"
read -p "PostgreSQL Database Name [evolution_todo]: " DB_NAME
DB_NAME=${DB_NAME:-evolution_todo}

read -p "PostgreSQL Username [todouser]: " DB_USER
DB_USER=${DB_USER:-todouser}

read -sp "PostgreSQL Password: " DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${YELLOW}Generating random password...${NC}"
    DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)
    echo "Generated password: $DB_PASSWORD"
fi

# Application secrets
echo ""
echo -e "${GREEN}Application Configuration${NC}"
echo "-------------------------"
read -sp "JWT Secret Key (press Enter to generate): " JWT_SECRET
echo ""

if [ -z "$JWT_SECRET" ]; then
    echo -e "${YELLOW}Generating JWT secret...${NC}"
    JWT_SECRET=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 48)
    echo "Generated JWT secret: $JWT_SECRET"
fi

read -sp "Anthropic API Key (for MCP chatbot): " ANTHROPIC_KEY
echo ""

# Base64 encode values
DB_NAME_B64=$(echo -n "$DB_NAME" | base64)
DB_USER_B64=$(echo -n "$DB_USER" | base64)
DB_PASSWORD_B64=$(echo -n "$DB_PASSWORD" | base64)
DB_URL="postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}"
DB_URL_B64=$(echo -n "$DB_URL" | base64)
JWT_SECRET_B64=$(echo -n "$JWT_SECRET" | base64)
ANTHROPIC_KEY_B64=$(echo -n "$ANTHROPIC_KEY" | base64)

# Create db-secret.yaml
cat > "$SECRETS_DIR/db-secret.yaml" << EOF
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
  namespace: evolution-todo
  labels:
    app.kubernetes.io/name: db-secret
    app.kubernetes.io/part-of: evolution-todo
type: Opaque
data:
  postgres_db: $DB_NAME_B64
  postgres_user: $DB_USER_B64
  postgres_password: $DB_PASSWORD_B64
  database_url: $DB_URL_B64
EOF

echo -e "${GREEN}✓ Created $SECRETS_DIR/db-secret.yaml${NC}"

# Create app-secret.yaml
cat > "$SECRETS_DIR/app-secret.yaml" << EOF
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
  namespace: evolution-todo
  labels:
    app.kubernetes.io/name: app-secret
    app.kubernetes.io/part-of: evolution-todo
type: Opaque
data:
  secret_key: $JWT_SECRET_B64
  anthropic_api_key: $ANTHROPIC_KEY_B64
EOF

echo -e "${GREEN}✓ Created $SECRETS_DIR/app-secret.yaml${NC}"

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Secrets Created Successfully!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "${RED}IMPORTANT: Do NOT commit these files to version control!${NC}"
echo ""
echo "Add to .gitignore:"
echo "  phase-4-kubernetes/k8s/secrets/db-secret.yaml"
echo "  phase-4-kubernetes/k8s/secrets/app-secret.yaml"
echo ""
echo "To apply secrets to your cluster:"
echo "  kubectl apply -f $SECRETS_DIR/db-secret.yaml"
echo "  kubectl apply -f $SECRETS_DIR/app-secret.yaml"
