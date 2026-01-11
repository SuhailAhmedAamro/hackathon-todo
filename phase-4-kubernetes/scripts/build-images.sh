#!/bin/bash
# Evolution Todo - Build Docker Images
# Usage: ./build-images.sh [--push] [--registry REGISTRY]

set -e

# Default values
REGISTRY=""
PUSH=false
TAG="latest"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --push)
            PUSH=true
            shift
            ;;
        --registry)
            REGISTRY="$2/"
            shift 2
            ;;
        --tag)
            TAG="$2"
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
echo -e "${GREEN}  Evolution Todo - Building Images${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"

# Build Frontend
echo -e "${YELLOW}Building Frontend image...${NC}"
docker build \
    -t "${REGISTRY}evolution-todo-frontend:${TAG}" \
    -f "$SCRIPT_DIR/../docker/Dockerfile.frontend" \
    "$ROOT_DIR/phase-2-web/frontend"
echo -e "${GREEN}✓ Frontend image built${NC}"

# Build Backend
echo -e "${YELLOW}Building Backend image...${NC}"
docker build \
    -t "${REGISTRY}evolution-todo-backend:${TAG}" \
    -f "$SCRIPT_DIR/../docker/Dockerfile.backend" \
    "$ROOT_DIR/phase-2-web/backend"
echo -e "${GREEN}✓ Backend image built${NC}"

# Build MCP Server
echo -e "${YELLOW}Building MCP Server image...${NC}"
docker build \
    -t "${REGISTRY}evolution-todo-mcp:${TAG}" \
    -f "$SCRIPT_DIR/../docker/Dockerfile.mcp" \
    "$ROOT_DIR/phase-3-chatbot/mcp-server"
echo -e "${GREEN}✓ MCP Server image built${NC}"

# Push images if requested
if [ "$PUSH" = true ]; then
    echo ""
    echo -e "${YELLOW}Pushing images to registry...${NC}"

    docker push "${REGISTRY}evolution-todo-frontend:${TAG}"
    echo -e "${GREEN}✓ Frontend image pushed${NC}"

    docker push "${REGISTRY}evolution-todo-backend:${TAG}"
    echo -e "${GREEN}✓ Backend image pushed${NC}"

    docker push "${REGISTRY}evolution-todo-mcp:${TAG}"
    echo -e "${GREEN}✓ MCP Server image pushed${NC}"
fi

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  All images built successfully!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo "Images created:"
echo "  - ${REGISTRY}evolution-todo-frontend:${TAG}"
echo "  - ${REGISTRY}evolution-todo-backend:${TAG}"
echo "  - ${REGISTRY}evolution-todo-mcp:${TAG}"
