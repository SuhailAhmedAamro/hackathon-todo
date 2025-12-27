# Skills Index - Reusable Intelligence for Hackathon II

## Overview

This index provides a complete catalog of all reusable intelligence components created for the "Evolution of Todo" project. These components enable rapid development, consistency across phases, and maximize the reusability bonus points.

**Reusable Intelligence Categories:**
- **Skills** (6): Reusable development patterns and automation tools
- **Templates** (5): Standard formats for specifications and documentation
- **Sub-agents** (5): Autonomous agents for validation, generation, and review
- **Blueprints** (5): Complete architecture definitions for each phase
- **Models** (3): Shared data models used across phases
- **Utilities** (2): Common helper functions and validators

---

## 1. Core Skills (6)

### 1.1 Spec Writer Skill
**File**: `@skills/spec-writer-skill.md`
**Purpose**: Automate generation of consistent, complete specifications
**When to Use**: Creating any new feature, API, database, or UI spec

**Key Capabilities:**
- Analyzes requirements and selects appropriate template
- Generates complete specs with all required sections
- Creates cross-references to related specs
- Validates completeness before output

**Usage Example:**
```
"Write a feature spec for user authentication using @skills/spec-writer-skill.md"
```

### 1.2 Python CLI Skill
**File**: `@skills/python-cli-skill.md`
**Purpose**: Patterns and best practices for Python CLI development
**When to Use**: Building Phase 1 console application or any CLI tool

**Key Capabilities:**
- Typer/Click framework patterns
- Command structure and argument parsing
- Rich terminal output formatting
- Error handling and user feedback

**Usage Example:**
```python
# Reference for building CLI commands
# See @skills/python-cli-skill.md for command patterns
```

### 1.3 Docker Generator Skill
**File**: `@skills/docker-generator-skill.md`
**Purpose**: Generate optimized Dockerfiles for any technology stack
**When to Use**: Creating Docker images for Phases 2-5

**Key Capabilities:**
- Multi-stage build optimization
- Technology-specific configurations (Node.js, Python, etc.)
- Security hardening (non-root users, minimal images)
- Build caching optimization

**Usage Example:**
```
"Generate a Dockerfile for Next.js frontend using @skills/docker-generator-skill.md"
```

### 1.4 Helm Chart Skill
**File**: `@skills/helm-chart-skill.md`
**Purpose**: Create production-ready Kubernetes Helm charts
**When to Use**: Deploying to Kubernetes (Phases 4-5)

**Key Capabilities:**
- Complete chart structure generation
- Values.yaml configuration
- Deployment, Service, ConfigMap, Secret templates
- Environment-specific values files

**Usage Example:**
```
"Create a Helm chart for the backend service using @skills/helm-chart-skill.md"
```

### 1.5 MCP Tool Skill
**File**: `@skills/mcp-tool-skill.md`
**Purpose**: Define MCP tools for Claude AI integration
**When to Use**: Building Phase 3 chatbot functionality

**Key Capabilities:**
- Tool definition schema generation
- Input validation schemas
- Tool handler implementation patterns
- Error handling and user feedback

**Usage Example:**
```python
# Define MCP tool for task creation
# Reference: @skills/mcp-tool-skill.md
```

### 1.6 API Design Skill
**File**: `@skills/api-design-skill.md`
**Purpose**: Design RESTful APIs following best practices
**When to Use**: Creating API endpoints for Phases 2-5

**Key Capabilities:**
- RESTful naming conventions
- Request/response schema design
- Error response standardization
- Authentication and authorization patterns

**Usage Example:**
```
"Design API endpoints for task management using @skills/api-design-skill.md"
```

---

## 2. Templates (5)

### 2.1 Feature Template
**File**: `@skills/templates/feature-template.md`
**Purpose**: Standard format for feature specifications
**Sections**: User Stories, Requirements, API, Testing, Phase Applicability

**Usage:**
```
"Use @skills/templates/feature-template.md to document the recurring tasks feature"
```

### 2.2 API Template
**File**: `@skills/templates/api-template.md`
**Purpose**: Standard format for API endpoint documentation
**Sections**: Method, Path, Request, Response, Examples, cURL commands

**Usage:**
```
"Document the authentication endpoints using @skills/templates/api-template.md"
```

### 2.3 Database Template
**File**: `@skills/templates/database-template.md`
**Purpose**: Standard format for database schema documentation
**Sections**: Tables, Columns, Constraints, Indexes, Migrations

**Usage:**
```
"Define the users table schema using @skills/templates/database-template.md"
```

### 2.4 UI Component Template
**File**: `@skills/templates/ui-component-template.md`
**Purpose**: Standard format for React component specifications
**Sections**: Props, State, Events, Styling, Accessibility

**Usage:**
```
"Design the TaskCard component using @skills/templates/ui-component-template.md"
```

### 2.5 Test Template
**File**: `@skills/templates/test-template.md`
**Purpose**: Standard format for test specifications
**Sections**: Test Cases, Setup, Assertions, Coverage Requirements

**Usage:**
```
"Write tests for the task service using @skills/templates/test-template.md"
```

---

## 3. Sub-agents (5)

### 3.1 Spec Analyzer
**File**: `@skills/subagents/spec-analyzer.md`
**Purpose**: Validates specification completeness and consistency
**Triggers**: Before starting implementation, during spec reviews

**Validation Checks:**
- Structure completeness
- Required sections present
- Cross-reference validity
- Consistency with constitution
- Phase applicability

**Usage:**
```
"Analyze @specs/features/authentication.md using @skills/subagents/spec-analyzer.md"
```

### 3.2 Code Generator
**File**: `@skills/subagents/code-generator.md`
**Purpose**: Generates code from specifications automatically
**Triggers**: After spec validation, when starting implementation

**Generation Capabilities:**
- Models from database specs
- API endpoints from API specs
- React components from UI specs
- Test cases from feature specs

**Usage:**
```
"Generate code from @specs/api/rest-endpoints.md using @skills/subagents/code-generator.md"
```

### 3.3 Code Reviewer
**File**: `@skills/subagents/code-reviewer.md`
**Purpose**: Reviews code quality, security, and standards compliance
**Triggers**: After implementation, before merging

**Review Checklist:**
- Code quality (DRY, SOLID principles)
- Coding standards compliance
- Security (OWASP Top 10)
- Performance optimization
- Test coverage

**Usage:**
```
"Review the authentication implementation using @skills/subagents/code-reviewer.md"
```

### 3.4 Architecture Validator
**File**: `@skills/subagents/architecture-validator.md`
**Purpose**: Validates system architecture against principles and requirements
**Triggers**: After architecture changes, before major implementations

**Validation Areas:**
- Architecture principles compliance
- Component design patterns
- Data architecture
- Security architecture
- Scalability considerations

**Usage:**
```
"Validate Phase 3 architecture using @skills/subagents/architecture-validator.md"
```

### 3.5 Security Auditor
**File**: `@skills/subagents/security-auditor.md`
**Purpose**: Conducts comprehensive security audits
**Triggers**: Before deployment, during security reviews

**Audit Areas:**
- OWASP Top 10 compliance
- Authentication/authorization
- Data protection
- API security
- Dependency vulnerabilities

**Usage:**
```
"Audit Phase 2 security using @skills/subagents/security-auditor.md"
```

---

## 4. Blueprints (5)

### 4.1 Console App Blueprint (Phase 1)
**File**: `@skills/blueprints/console-app.yaml`
**Technology**: Python, Typer, SQLite, SQLAlchemy
**Purpose**: Complete CLI application structure

**Key Sections:**
- Directory structure
- File templates
- Dependencies
- Commands
- Testing strategy

**Usage:**
```
"Build Phase 1 using @skills/blueprints/console-app.yaml"
```

### 4.2 Web App Blueprint (Phase 2)
**File**: `@skills/blueprints/web-app.yaml`
**Technology**: Next.js, FastAPI, PostgreSQL, JWT
**Purpose**: Full-stack web application architecture

**Key Sections:**
- Frontend structure (Next.js 14)
- Backend structure (FastAPI)
- Database schema (PostgreSQL)
- Authentication (JWT)
- Docker Compose setup

**Usage:**
```
"Build Phase 2 using @skills/blueprints/web-app.yaml"
```

### 4.3 Chatbot Blueprint (Phase 3)
**File**: `@skills/blueprints/chatbot.yaml`
**Technology**: Claude API, MCP, WebSocket
**Purpose**: AI-powered chatbot with MCP integration

**Key Sections:**
- MCP server structure
- Tool definitions
- WebSocket communication
- Frontend chat components
- Conversation persistence

**Usage:**
```
"Build Phase 3 using @skills/blueprints/chatbot.yaml"
```

### 4.4 Minikube Deployment Blueprint (Phase 4)
**File**: `@skills/blueprints/minikube-deployment.yaml`
**Technology**: Docker, Kubernetes, Helm, Minikube
**Purpose**: Local Kubernetes deployment for testing

**Key Sections:**
- Docker image builds
- Kubernetes manifests
- Helm charts
- Deployment workflow
- Troubleshooting guide

**Usage:**
```
"Build Phase 4 using @skills/blueprints/minikube-deployment.yaml"
```

### 4.5 Cloud Deployment Blueprint (Phase 5)
**File**: `@skills/blueprints/cloud-deployment.yaml`
**Technology**: Terraform, AWS/GCP/Azure, CI/CD
**Purpose**: Production cloud deployment with IaC

**Key Sections:**
- Cloud provider configurations
- Terraform structure
- CI/CD pipelines (GitHub Actions)
- Monitoring and logging
- Auto-scaling
- Disaster recovery

**Usage:**
```
"Build Phase 5 using @skills/blueprints/cloud-deployment.yaml"
```

---

## 5. Shared Models (3)

### 5.1 Task Model
**File**: `@skills/models/task.py`
**Purpose**: Base task model reusable across all phases
**Phases**: 1, 2, 3, 4, 5

**Key Components:**
- TaskBase class
- Priority enum (LOW, MEDIUM, HIGH, CRITICAL)
- Status enum (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)

**Usage:**
```python
from skills.models.task import TaskBase, Priority, Status

class Task(TaskBase, Base):
    __tablename__ = "tasks"
    # Phase-specific extensions
```

### 5.2 User Model
**File**: `@skills/models/user.py`
**Purpose**: Base user model for authentication
**Phases**: 2, 3, 4, 5

**Key Components:**
- UserBase class
- Email validation
- Password hashing patterns

**Usage:**
```python
from skills.models.user import UserBase

class User(UserBase, Base):
    __tablename__ = "users"
    # Phase-specific extensions
```

### 5.3 Conversation Model
**File**: `@skills/models/conversation.py`
**Purpose**: Chatbot conversation and message models
**Phases**: 3, 4, 5

**Key Components:**
- ConversationBase class
- MessageBase class
- Role enum (USER, ASSISTANT, SYSTEM)

**Usage:**
```python
from skills.models.conversation import ConversationBase, MessageBase

class Conversation(ConversationBase, Base):
    __tablename__ = "conversations"
```

---

## 6. Utilities (2)

### 6.1 Helpers
**File**: `@skills/utils/helpers.py`
**Purpose**: Common helper functions
**Functions**:
- `generate_uuid()` - Generate UUID v4
- `format_datetime(dt, format)` - Format datetime objects
- `truncate_string(s, length)` - Truncate strings with ellipsis
- `calculate_due_soon(due_date)` - Check if task due soon
- `sanitize_input(text)` - Sanitize user input

**Usage:**
```python
from skills.utils.helpers import generate_uuid, format_datetime

task_id = generate_uuid()
formatted_date = format_datetime(task.created_at, "human")
```

### 6.2 Validators
**File**: `@skills/utils/validators.py`
**Purpose**: Input validation functions
**Functions**:
- `validate_email(email)` - Email format validation
- `validate_username(username)` - Username format validation
- `validate_password(password)` - Password strength validation
- `validate_priority(priority)` - Priority enum validation
- `validate_status(status)` - Status enum validation

**Usage:**
```python
from skills.utils.validators import validate_email, validate_password

if validate_email(user_email):
    # Process email
```

---

## Quick Reference Guide

### Starting a New Phase

1. **Read the Blueprint**
   ```
   @skills/blueprints/[phase-name].yaml
   ```

2. **Review Relevant Specs**
   ```
   @specs/phases/phase-[number].md
   @specs/overview.md
   @specs/architecture.md
   ```

3. **Validate with Spec Analyzer**
   ```
   Use @skills/subagents/spec-analyzer.md to validate specs
   ```

4. **Generate Code**
   ```
   Use @skills/subagents/code-generator.md to generate initial code
   ```

5. **Review Code**
   ```
   Use @skills/subagents/code-reviewer.md to review implementation
   ```

6. **Security Audit**
   ```
   Use @skills/subagents/security-auditor.md before deployment
   ```

### Creating a New Feature

1. **Write Feature Spec**
   ```
   Use @skills/templates/feature-template.md
   Reference @skills/spec-writer-skill.md for guidance
   ```

2. **Design API (if needed)**
   ```
   Use @skills/templates/api-template.md
   Reference @skills/api-design-skill.md
   ```

3. **Define Database Schema (if needed)**
   ```
   Use @skills/templates/database-template.md
   ```

4. **Design UI Components (if needed)**
   ```
   Use @skills/templates/ui-component-template.md
   ```

5. **Write Test Specs**
   ```
   Use @skills/templates/test-template.md
   ```

### Deploying to Production

1. **Phase 4 (Minikube)**
   ```
   Follow @skills/blueprints/minikube-deployment.yaml
   Use @skills/docker-generator-skill.md for Dockerfiles
   Use @skills/helm-chart-skill.md for Helm charts
   ```

2. **Phase 5 (Cloud)**
   ```
   Follow @skills/blueprints/cloud-deployment.yaml
   Configure Terraform from blueprint
   Set up CI/CD pipelines
   ```

---

## Phase-Specific Intelligence Matrix

| Component | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|-----------|---------|---------|---------|---------|---------|
| **Console App Blueprint** | ✓ | - | - | - | - |
| **Web App Blueprint** | - | ✓ | - | - | - |
| **Chatbot Blueprint** | - | - | ✓ | - | - |
| **Minikube Blueprint** | - | - | - | ✓ | - |
| **Cloud Blueprint** | - | - | - | - | ✓ |
| **Python CLI Skill** | ✓ | - | - | - | - |
| **API Design Skill** | - | ✓ | ✓ | ✓ | ✓ |
| **Docker Generator** | - | ✓ | ✓ | ✓ | ✓ |
| **Helm Chart Skill** | - | - | - | ✓ | ✓ |
| **MCP Tool Skill** | - | - | ✓ | ✓ | ✓ |
| **Task Model** | ✓ | ✓ | ✓ | ✓ | ✓ |
| **User Model** | - | ✓ | ✓ | ✓ | ✓ |
| **Conversation Model** | - | - | ✓ | ✓ | ✓ |
| **All Templates** | ✓ | ✓ | ✓ | ✓ | ✓ |
| **All Sub-agents** | ✓ | ✓ | ✓ | ✓ | ✓ |
| **All Utilities** | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## Best Practices

### 1. Always Reference Before Implementing
Before writing any code, check if there's a relevant skill, template, or blueprint you should reference.

### 2. Use @-Syntax for References
Always use the `@skills/path/to/file` syntax when referencing intelligence components. This ensures Claude Code can navigate correctly.

### 3. Validate Before Generating
Use the Spec Analyzer sub-agent to validate specifications before using the Code Generator.

### 4. Review After Implementing
Always use the Code Reviewer sub-agent to review implementations before considering them complete.

### 5. Audit Before Deploying
Run the Security Auditor sub-agent before any deployment to production.

### 6. Extract Common Patterns
If you find yourself implementing the same pattern twice, consider extracting it to the skills directory.

### 7. Keep Models DRY
Always extend shared models from `@skills/models/` rather than duplicating model definitions.

### 8. Reuse Utilities
Check `@skills/utils/` before implementing common functionality like validation or formatting.

---

## Navigation Tips for Claude Code

### Quick File Access
```
@skills/SKILLS-INDEX.md              # This file
@skills/blueprints/console-app.yaml  # Phase 1 blueprint
@skills/blueprints/web-app.yaml      # Phase 2 blueprint
@skills/blueprints/chatbot.yaml      # Phase 3 blueprint
@skills/blueprints/minikube-deployment.yaml  # Phase 4 blueprint
@skills/blueprints/cloud-deployment.yaml     # Phase 5 blueprint
```

### Common Patterns
```
@skills/templates/feature-template.md    # Create feature specs
@skills/spec-writer-skill.md             # Generate any spec
@skills/api-design-skill.md              # Design APIs
@skills/docker-generator-skill.md        # Create Dockerfiles
```

### Code Generation
```
@skills/subagents/code-generator.md      # Generate code from specs
@skills/subagents/code-reviewer.md       # Review implementations
@skills/subagents/security-auditor.md    # Security audits
```

### Shared Code
```
@skills/models/task.py                   # Task model
@skills/models/user.py                   # User model
@skills/models/conversation.py           # Conversation model
@skills/utils/helpers.py                 # Helper functions
@skills/utils/validators.py              # Validation functions
```

---

## Statistics

- **Total Skills**: 6
- **Total Templates**: 5
- **Total Sub-agents**: 5
- **Total Blueprints**: 5
- **Total Models**: 3
- **Total Utilities**: 2
- **Total Files**: 26
- **Phases Supported**: 5
- **Reusability Score**: Maximum (+200 bonus points target)

---

## Maintenance

### Adding New Intelligence Components

1. **Create the Component**
   - Skills go in `@skills/`
   - Templates go in `@skills/templates/`
   - Sub-agents go in `@skills/subagents/`
   - Blueprints go in `@skills/blueprints/`
   - Models go in `@skills/models/`
   - Utilities go in `@skills/utils/`

2. **Document the Component**
   - Add comprehensive documentation
   - Include usage examples
   - Show integration patterns

3. **Update This Index**
   - Add entry in appropriate section
   - Update phase matrix if applicable
   - Update statistics

4. **Reference from Phases**
   - Update phase implementations to use new component
   - Add cross-references in specs

---

## Contact & Contribution

This intelligence infrastructure is designed to evolve. As patterns emerge during implementation, extract them and add them to the skills directory.

**Remember**: The goal is to write once, reuse everywhere, and maximize the "Reusable Intelligence" bonus points!

---

**Last Updated**: 2025-12-26
**Version**: 1.0.0
**Status**: Complete - Ready for Phase 1 Implementation
