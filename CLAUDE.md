# Claude Code Navigation Guide - Evolution of Todo Hackathon II

## Project Overview
Multi-phase todo application evolution: Console → Web → Chatbot → K8s → Cloud

## Navigation Structure

### 📋 Specifications (`/specs/`)
**Read specs FIRST before implementing any feature**
- `overview.md` - Project vision and scope
- `constitution.md` - Development principles and guidelines
- `architecture.md` - System architecture and design decisions
- `phases/` - Phase-specific requirements
- `features/` - Feature specifications (task-crud, auth, chatbot, etc.)
- `api/` - API contracts and schemas
- `database/` - Database schema and migrations
- `ui/` - UI components and pages

### 🎯 Skills (`/skills/`)
**Reusable intelligence across all phases**
- `python-cli-skill.md` - CLI development patterns
- `spec-writer-skill.md` - Writing consistent specifications
- `kubernetes-deployer-skill.md` - K8s deployment patterns
- `dockerizer.py` - Container creation automation
- `models/` - Shared data models (task, user, conversation)
- `utils/` - Shared utilities and validators

### 🚀 Phase Implementation

#### Phase 1: Console (`/phase-1-console/`)
Python CLI application - Read `/phase-1-console/CLAUDE.md` for specifics

#### Phase 2: Web (`/phase-2-web/`)
Next.js + FastAPI - Read `/phase-2-web/CLAUDE.md` for specifics

#### Phase 3: Chatbot (`/phase-3-chatbot/`)
MCP-enabled chatbot - Read `/phase-3-chatbot/CLAUDE.md` for specifics

#### Phase 4: Kubernetes (`/phase-4-kubernetes/`)
K8s deployment - Read `/phase-4-kubernetes/CLAUDE.md` for specifics

#### Phase 5: Cloud (`/phase-5-cloud/`)
Cloud-native deployment - Read `/phase-5-cloud/CLAUDE.md` for specifics

## Workflow

### Implementing a Feature
1. Read the feature spec: `@specs/features/[feature-name].md`
2. Check related API spec: `@specs/api/[api-name].md`
3. Review database schema: `@specs/database/schema.md`
4. Review UI spec (if applicable): `@specs/ui/[ui-name].md`
5. Use skills from `/skills/` for reusable patterns
6. Implement in the appropriate phase directory
7. Update specs if design changes

### Writing a New Spec
1. Read `@.spec-kit/prompts/[template-name].md` for template
2. Follow conventions in `@specs/constitution.md`
3. Place in appropriate category (features/api/database/ui)
4. Reference from phase-specific CLAUDE.md

### Cross-Phase Reuse
1. Extract common models to `/skills/models/`
2. Extract common utilities to `/skills/utils/`
3. Document patterns in skill files (`.md` or `.py`)
4. Reference skills in phase-specific implementations

## Key Principles
- **Spec-First**: Always read/write specs before coding
- **DRY**: Reuse skills across phases
- **Phase Isolation**: Each phase is independently runnable
- **Progressive Enhancement**: Each phase builds on learnings from previous

## Quick Reference
- Configuration: `@.spec-kit/config.yaml`
- Architecture: `@specs/architecture.md`
- Development principles: `@specs/constitution.md`
- Setup instructions: `@docs/setup.md`
- Deployment guide: `@docs/deployment.md`
