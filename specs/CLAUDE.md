# Specifications Directory - Claude Navigation Guide

## Purpose
This directory contains all specifications for the Evolution of Todo project. **Always read specs BEFORE implementing features.**

## Directory Structure

### Core Specs
- `overview.md` - Project vision, scope, and high-level goals
- `constitution.md` - Development principles and coding standards
- `architecture.md` - System architecture and technical decisions

### Phase Specifications (`/phases/`)
Phase-specific requirements and implementation guidelines:
- `phase-1-console.md` - Python CLI specifications
- `phase-2-web.md` - Next.js + FastAPI web app specifications
- `phase-3-chatbot.md` - MCP chatbot specifications
- `phase-4-kubernetes.md` - K8s deployment specifications
- `phase-5-cloud.md` - Cloud-native architecture specifications

### Feature Specifications (`/features/`)
Detailed feature requirements (read `@specs/features/CLAUDE.md` for more):
- `task-crud.md` - Task create, read, update, delete operations
- `authentication.md` - User authentication and authorization
- `chatbot.md` - Chatbot interface and conversation management
- `priorities-tags.md` - Task prioritization and tagging system
- `recurring-tasks.md` - Recurring task scheduling

### API Specifications (`/api/`)
API contracts and schemas (read `@specs/api/CLAUDE.md` for more):
- `rest-endpoints.md` - RESTful API endpoint definitions
- `mcp-tools.md` - MCP tool specifications for chatbot
- `event-schemas.md` - Event payloads and WebSocket messages

### Database Specifications (`/database/`)
Data models and persistence (read `@specs/database/CLAUDE.md` for more):
- `schema.md` - Database schema and relationships
- `migrations.md` - Migration strategy and version history

### UI Specifications (`/ui/`)
User interface design (read `@specs/ui/CLAUDE.md` for more):
- `components.md` - Reusable UI component specifications
- `pages.md` - Page layouts and routing
- `chat-interface.md` - Chatbot UI specifications

## Workflow for Claude Code

### Implementing a New Feature
1. **Read the feature spec first**: `@specs/features/[feature-name].md`
2. **Check dependencies**:
   - API spec: `@specs/api/[related-api].md`
   - Database: `@specs/database/schema.md`
   - UI (if web): `@specs/ui/[related-ui].md`
3. **Review architecture**: `@specs/architecture.md`
4. **Follow principles**: `@specs/constitution.md`
5. **Check phase requirements**: `@specs/phases/[phase-name].md`
6. **Implement in phase directory**: `@phase-X-*/`
7. **Update spec if design changes**

### Writing a New Spec
1. **Choose the right category**: features, api, database, or ui
2. **Use the template**: `@.spec-kit/prompts/[category]-spec-template.md`
3. **Follow constitution**: `@specs/constitution.md`
4. **Cross-reference related specs**
5. **Mark phase applicability**

### Reading Strategy
```
Priority 1: overview.md (project context)
Priority 2: constitution.md (rules and principles)
Priority 3: architecture.md (technical decisions)
Priority 4: Relevant feature spec
Priority 5: Related API/database/UI specs
Priority 6: Phase-specific requirements
```

## Key Principles

1. **Spec-First Development**: No code without a spec
2. **Single Source of Truth**: Specs are authoritative
3. **Living Documentation**: Update specs as code evolves
4. **Cross-Referencing**: Link related specs together
5. **Phase Awareness**: Note which phases use each spec

## Quick Reference

| Need to... | Read this... |
|------------|--------------|
| Understand project goals | `@specs/overview.md` |
| Learn coding standards | `@specs/constitution.md` |
| See system architecture | `@specs/architecture.md` |
| Implement task CRUD | `@specs/features/task-crud.md` + `@specs/api/rest-endpoints.md` |
| Add authentication | `@specs/features/authentication.md` |
| Build chatbot | `@specs/features/chatbot.md` + `@specs/api/mcp-tools.md` |
| Design database | `@specs/database/schema.md` |
| Create UI component | `@specs/ui/components.md` |
| Deploy to K8s | `@specs/phases/phase-4-kubernetes.md` |
| Deploy to cloud | `@specs/phases/phase-5-cloud.md` |

## Templates
All spec templates are in: `@.spec-kit/prompts/`
- `feature-spec-template.md`
- `api-spec-template.md`
- `database-spec-template.md`
- `ui-spec-template.md`
