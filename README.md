# Evolution of Todo - Hackathon II

A progressive evolution of a todo application through 5 phases, demonstrating modern development practices from CLI to cloud-native deployment.

## 🎯 Project Vision

Build the same todo application 5 times, each time learning and evolving:
1. **Phase 1**: Python Console CLI
2. **Phase 2**: Next.js Web App + FastAPI Backend
3. **Phase 3**: Chatbot Interface with MCP Tools
4. **Phase 4**: Kubernetes Deployment
5. **Phase 5**: Cloud-Native Architecture

## 📁 Project Structure

```
evolution-todo/
├── specs/              # All specifications (READ FIRST)
├── skills/             # Reusable intelligence across phases
├── phase-1-console/    # Python CLI implementation
├── phase-2-web/        # Next.js + FastAPI web app
├── phase-3-chatbot/    # MCP-enabled chatbot
├── phase-4-kubernetes/ # K8s deployment configs
├── phase-5-cloud/      # Cloud infrastructure as code
└── docs/               # Documentation
```

## 🚀 Quick Start

### For Developers
```bash
# Read the architecture first
cat specs/overview.md
cat specs/architecture.md

# Choose your phase
cd phase-1-console  # or phase-2-web, etc.
cat CLAUDE.md       # Read phase-specific instructions
cat README.md       # Read setup instructions
```

### For Claude Code
```bash
# Read the navigation guide
cat CLAUDE.md

# Start with specs
cat specs/overview.md
cat specs/constitution.md
```

## 📋 Features

- ✅ Task CRUD operations (Create, Read, Update, Delete)
- ✅ Task priorities and tags
- ✅ Recurring tasks
- ✅ User authentication
- ✅ Chatbot interface
- ✅ Cloud-native deployment

## 🛠️ Tech Stack

### Phase 1: Console
- Python 3.11+
- SQLite
- Click/Typer for CLI

### Phase 2: Web
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **API**: RESTful + WebSocket

### Phase 3: Chatbot
- MCP (Model Context Protocol)
- Claude API
- Custom MCP tools

### Phase 4: Kubernetes
- Docker
- Kubernetes
- Helm charts
- Ingress/Services

### Phase 5: Cloud
- Terraform/CloudFormation
- AWS/GCP/Azure
- Managed services (RDS, EKS, etc.)

## 📚 Documentation

- [Setup Guide](docs/setup.md)
- [Architecture Decisions](docs/architecture-decisions.md)
- [API Reference](docs/api-reference.md)
- [Deployment Guide](docs/deployment.md)

## 🧠 Spec-Kit Integration

This project follows Spec-Kit conventions:
- Specs-first development
- Organized specifications in `/specs/`
- Reusable skills in `/skills/`
- Claude-friendly navigation via `CLAUDE.md` files

## 🤝 Contributing

1. Read `specs/constitution.md` for development principles
2. Read relevant feature spec in `specs/features/`
3. Implement in the appropriate phase directory
4. Update specs if design changes

## 📝 License

MIT License - See LICENSE file for details

## 🎓 Learning Objectives

- Spec-driven development
- Progressive enhancement
- Code reuse across phases
- Modern deployment patterns
- Cloud-native architectures

---

**Start here**: Read `CLAUDE.md` for navigation guide
