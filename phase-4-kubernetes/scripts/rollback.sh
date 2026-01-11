#!/bin/bash
# Evolution Todo - Rollback Deployment
# Usage: ./rollback.sh [--revision REVISION] [--component COMPONENT]

set -e

# Default values
NAMESPACE="evolution-todo"
REVISION=""
COMPONENT=""
USE_HELM=false

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
        --revision)
            REVISION="$2"
            shift 2
            ;;
        --component)
            COMPONENT="$2"
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
echo -e "${GREEN}  Evolution Todo - Rollback${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

if [ "$USE_HELM" = true ]; then
    # Rollback using Helm
    echo -e "${YELLOW}Rolling back Helm release...${NC}"

    if [ -n "$REVISION" ]; then
        helm rollback evolution-todo $REVISION -n $NAMESPACE
    else
        helm rollback evolution-todo -n $NAMESPACE
    fi

    echo -e "${GREEN}✓ Helm rollback complete${NC}"
else
    # Rollback using kubectl
    if [ -z "$COMPONENT" ]; then
        echo -e "${YELLOW}Rolling back all deployments...${NC}"

        for deployment in frontend backend mcp; do
            echo -e "${YELLOW}Rolling back $deployment...${NC}"
            if [ -n "$REVISION" ]; then
                kubectl rollout undo deployment/$deployment -n $NAMESPACE --to-revision=$REVISION
            else
                kubectl rollout undo deployment/$deployment -n $NAMESPACE
            fi
            echo -e "${GREEN}✓ $deployment rolled back${NC}"
        done
    else
        echo -e "${YELLOW}Rolling back $COMPONENT...${NC}"
        if [ -n "$REVISION" ]; then
            kubectl rollout undo deployment/$COMPONENT -n $NAMESPACE --to-revision=$REVISION
        else
            kubectl rollout undo deployment/$COMPONENT -n $NAMESPACE
        fi
        echo -e "${GREEN}✓ $COMPONENT rolled back${NC}"
    fi
fi

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Rollback Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# Show rollout history
echo -e "${YELLOW}Rollout History:${NC}"
for deployment in frontend backend mcp; do
    echo ""
    echo "=== $deployment ==="
    kubectl rollout history deployment/$deployment -n $NAMESPACE 2>/dev/null || true
done

echo ""
echo -e "${YELLOW}Current Status:${NC}"
kubectl get pods -n $NAMESPACE
