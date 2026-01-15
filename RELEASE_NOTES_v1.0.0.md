# Evolution of Todo - v1.0.0

The complete multi-phase todo application demonstrating progressive software development from CLI to Cloud.

## Highlights

- **5 Complete Phases** - Console → Web → Chatbot → Kubernetes → Cloud
- **Full-Stack Implementation** - Python, TypeScript, Next.js, FastAPI
- **AI Integration** - Claude-powered chatbot with MCP protocol
- **Production Ready** - Kubernetes manifests, Helm charts, Terraform IaC
- **CI/CD Pipelines** - GitHub Actions for testing and deployment

---

## Phase 1: Console CLI
Python command-line application for task management.

**Features:**
- Task CRUD operations with Typer CLI
- SQLite database with SQLAlchemy ORM
- Priority levels (Low, Medium, High)
- Due date support
- Rich terminal formatting

**Tech Stack:** Python 3.11, Typer, SQLAlchemy, Rich

---

## Phase 2: Web Application
Full-stack web application with modern UI.

**Features:**
- Responsive dashboard with task management
- User authentication (JWT)
- Task filtering, sorting, and search
- Tags and categories
- Focus mode with Pomodoro timer
- Analytics and streaks

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, FastAPI, PostgreSQL

---

## Phase 3: Chatbot Interface
AI-powered natural language task management.

**Features:**
- Claude AI integration via Anthropic API
- MCP (Model Context Protocol) tools
- Natural language task creation/updates
- WebSocket real-time chat
- Conversation history persistence

**Tech Stack:** FastAPI, Claude API, MCP Protocol, WebSocket

---

## Phase 4: Kubernetes Deployment
Container orchestration with Kubernetes.

**Features:**
- Multi-stage Docker builds (optimized images)
- Kubernetes Deployments, Services, StatefulSets
- Helm charts with configurable values
- Horizontal Pod Autoscaling (HPA)
- Nginx Ingress with routing
- Rolling updates (zero-downtime)

**Tech Stack:** Docker, Kubernetes 1.28+, Helm 3

---

## Phase 5: Cloud Infrastructure (AWS)
Production cloud deployment with Infrastructure as Code.

**Features:**
- Modular Terraform configuration
- VPC with public/private subnets
- EKS managed Kubernetes
- RDS PostgreSQL (Multi-AZ ready)
- ECR container registry
- S3 for static assets
- CloudWatch monitoring & alarms
- Budget alerts
- GitHub Actions CI/CD pipelines

**Tech Stack:** Terraform, AWS (EKS, RDS, S3, ECR, CloudWatch)

---

## Quick Start

### Console CLI
```bash
cd phase-1-console
pip install -r requirements.txt
python -m src.main --help
```

### Web Application
```bash
# Backend
cd phase-2-web/backend
pip install -r requirements.txt
uvicorn src.main:app --reload

# Frontend
cd phase-2-web/frontend
npm install && npm run dev
```

### Kubernetes
```bash
cd phase-4-kubernetes
./scripts/build-images.sh
./scripts/deploy.sh
```

### Cloud (AWS)
```bash
cd phase-5-cloud
./scripts/setup-terraform-backend.sh
./scripts/deploy-infrastructure.sh -e dev -a apply
./scripts/deploy-application.sh dev latest
```

---

## Documentation

- [Phase 4 Kubernetes Guide](./phase-4-kubernetes/README.md)
- [Phase 5 Cloud Guide](./phase-5-cloud/README.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Quick Deploy](./DEPLOY_NOW.md)

---

## Contributors

Built for **Evolution of Todo - Hackathon II**

---

*Generated with Claude Code*
