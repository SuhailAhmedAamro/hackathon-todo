# Setup Guide - Evolution of Todo

## Prerequisites

### All Phases
- Git installed
- Code editor (VS Code recommended)
- Terminal/command line access

### Phase 1: Console
- Python 3.11 or higher
- pip package manager

### Phase 2: Web
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Phase 3: Chatbot
- All Phase 2 prerequisites
- Claude API key (from Anthropic)

### Phase 4: Kubernetes
- All previous prerequisites
- Docker
- Kubernetes cluster (minikube/kind/cloud)
- kubectl
- Helm 3

### Phase 5: Cloud
- All previous prerequisites
- Terraform
- Cloud account (AWS/GCP/Azure)
- Cloud CLI tools

## Installation

### Phase 1: Console CLI
```bash
cd phase-1-console
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/main.py init
```

### Phase 2: Web Application

#### Backend
```bash
cd phase-2-web/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database credentials
alembic upgrade head
uvicorn src.main:app --reload
```

#### Frontend
```bash
cd phase-2-web/frontend
npm install
cp .env.example .env.local
# Edit .env.local with API URL
npm run dev
```

#### Using Docker Compose
```bash
cd phase-2-web
docker-compose up
```

### Phase 3: Chatbot
```bash
cd phase-3-chatbot/mcp-server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add ANTHROPIC_API_KEY to .env
python src/server.py
```

### Phase 4: Kubernetes
```bash
# Generate Dockerfiles
python skills/dockerizer.py all --output-dir phase-4-kubernetes/docker

# Build images
cd phase-4-kubernetes
docker build -t evolution-todo-frontend -f docker/Dockerfile.frontend ../phase-2-web/frontend
docker build -t evolution-todo-backend -f docker/Dockerfile.backend ../phase-2-web/backend
docker build -t evolution-todo-mcp -f docker/Dockerfile.mcp ../phase-3-chatbot/mcp-server

# Deploy to K8s
kubectl apply -f k8s/
# Or with Helm
helm install evolution-todo ./helm/evolution-todo
```

### Phase 5: Cloud
```bash
cd phase-5-cloud/terraform
terraform init
terraform plan -var-file=environments/prod/terraform.tfvars
terraform apply -var-file=environments/prod/terraform.tfvars
```

## Troubleshooting

### Python Virtual Environment Issues
```bash
# If venv fails to activate
python -m pip install --user virtualenv
python -m virtualenv venv
```

### Database Connection Issues
- Check PostgreSQL is running: `systemctl status postgresql`
- Verify credentials in .env file
- Ensure database exists: `createdb tododb`

### Port Already in Use
```bash
# Find process using port
lsof -i :8000  # On Linux/Mac
netstat -ano | findstr :8000  # On Windows

# Kill process or change port in configuration
```

### Docker Issues
```bash
# Reset Docker
docker system prune -a

# Check Docker is running
docker ps
```

## Next Steps
- Read `CLAUDE.md` in each phase directory
- Review specs in `/specs/`
- Check skills in `/skills/`
- Follow implementation order in phase-specific CLAUDE.md
