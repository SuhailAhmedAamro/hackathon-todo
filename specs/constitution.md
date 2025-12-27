# Evolution of Todo - Development Constitution

This document defines the core principles, standards, and practices for this project.

## Core Principles

### 1. Spec-First Development
**Principle**: No code without a specification.

**Rules**:
- All features must have a written spec before implementation
- Specs live in `/specs/` directory
- Use templates from `.spec-kit/prompts/`
- Update specs when implementation diverges
- Specs are the single source of truth

**Rationale**: Specs ensure clarity, enable collaboration, and serve as documentation.

### 2. Progressive Enhancement
**Principle**: Each phase builds on previous learnings.

**Rules**:
- Reuse models and utilities from `/skills/`
- Extract common patterns into reusable components
- Each phase is independently runnable
- Later phases can reference but not depend on earlier phases
- Document what changed and why

**Rationale**: Maximize learning and minimize duplication.

### 3. Code Quality
**Principle**: Write maintainable, tested, documented code.

**Rules**:
- Code coverage ≥ 80%
- All public functions have docstrings
- Type hints required (Python) / TypeScript (frontend)
- Linting errors must be fixed
- No commented-out code in commits

**Rationale**: Quality code is easier to maintain and evolve.

### 4. Security First
**Principle**: Security is not optional.

**Rules**:
- Never commit secrets to git
- Use environment variables for configuration
- Validate all user input
- Sanitize database queries (use ORMs)
- Implement authentication and authorization
- Regular dependency updates
- Follow OWASP Top 10 guidelines

**Rationale**: Security vulnerabilities are costly and preventable.

### 5. Accessibility
**Principle**: Build for everyone.

**Rules**:
- WCAG 2.1 AA compliance minimum
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios ≥ 4.5:1
- Semantic HTML
- ARIA labels where needed

**Rationale**: Inclusive design benefits all users.

## Coding Standards

### Python (Backend)

#### Style
- Follow PEP 8
- Use Black for formatting (line length: 100)
- Use isort for import sorting
- Use pylint for linting

#### Type Hints
```python
# Required for all function signatures
def create_task(title: str, user_id: str, priority: Priority = Priority.MEDIUM) -> Task:
    """Create a new task.

    Args:
        title: Task title (1-255 characters)
        user_id: User ID creating the task
        priority: Task priority level

    Returns:
        Created task object

    Raises:
        ValidationError: If title is invalid
        DatabaseError: If save fails
    """
    pass
```

#### Error Handling
```python
# Use specific exceptions
from fastapi import HTTPException

# Bad
if not task:
    raise Exception("Not found")

# Good
if not task:
    raise HTTPException(status_code=404, detail="Task not found")
```

#### Database
- Use SQLAlchemy ORM (no raw SQL except migrations)
- Use Alembic for migrations
- Add indexes for frequently queried fields
- Use transactions for multi-step operations

### TypeScript/React (Frontend)

#### Style
- Use ESLint with recommended rules
- Use Prettier for formatting
- Use TypeScript strict mode
- Functional components only (no class components)

#### Components
```typescript
// Use TypeScript interfaces
interface TaskCardProps {
  task: Task;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

// Use proper prop types
export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  // Component logic
}

// Export types
export type { TaskCardProps };
```

#### State Management
- Use React hooks for local state
- Use Context API for shared state (small apps)
- Use Zustand for complex state (large apps)
- Avoid prop drilling (max 2 levels)

#### API Calls
```typescript
// Centralize API calls
// src/lib/api.ts
export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch('/api/tasks');
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
}

// Use in components
const { data, error, isLoading } = useQuery('tasks', fetchTasks);
```

### SQL (Database)

#### Naming Conventions
- Tables: plural, snake_case (`tasks`, `user_tasks`)
- Columns: snake_case (`created_at`, `user_id`)
- Indexes: `idx_{table}_{column}` (`idx_tasks_user_id`)
- Foreign keys: `fk_{table}_{ref_table}` (`fk_tasks_users`)

#### Migrations
```sql
-- Always reversible
-- Up migration
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Down migration (in separate file or section)
DROP TABLE IF EXISTS tasks;
```

## Testing Standards

### Backend Testing
```python
# Test file naming: test_{module}.py
# Test function naming: test_{function}_{scenario}

def test_create_task_success(client, auth_headers):
    """Test successful task creation with valid data"""
    response = client.post(
        "/api/tasks",
        json={"title": "Test Task", "priority": "high"},
        headers=auth_headers
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Test Task"

def test_create_task_invalid_title(client, auth_headers):
    """Test task creation fails with empty title"""
    response = client.post(
        "/api/tasks",
        json={"title": ""},
        headers=auth_headers
    )
    assert response.status_code == 400
    assert "title" in response.json()["details"]
```

### Frontend Testing
```typescript
// Use React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';

test('renders task list and handles click', () => {
  const mockOnClick = jest.fn();
  const tasks = [{ id: '1', title: 'Task 1', status: 'pending' }];

  render(<TaskList tasks={tasks} onTaskClick={mockOnClick} />);

  expect(screen.getByText('Task 1')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Task 1'));
  expect(mockOnClick).toHaveBeenCalledWith('1');
});
```

## Git Workflow

### Branch Naming
- `main` - production-ready code
- `develop` - integration branch
- `feature/{name}` - new features
- `fix/{name}` - bug fixes
- `docs/{name}` - documentation updates

### Commit Messages
```
type(scope): subject

body (optional)

footer (optional)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```
feat(api): add task filtering endpoint

Implements task filtering by status, priority, and tags.
Related to specs/api/rest-endpoints.md

Closes #42
```

### Pull Requests
- Reference related issue/spec
- Include test coverage
- Update documentation
- Pass CI/CD checks
- Get at least one review

## Documentation Standards

### Code Documentation
- All public functions/classes have docstrings
- Complex logic has inline comments
- README.md in each major directory
- API documentation auto-generated from code

### Spec Documentation
- Follow templates from `.spec-kit/prompts/`
- Include examples and diagrams
- Cross-reference related specs
- Mark phase applicability
- Update when code changes

### User Documentation
- Setup instructions in `docs/setup.md`
- Deployment guide in `docs/deployment.md`
- API reference in `docs/api-reference.md`
- Architecture decisions in `docs/architecture-decisions.md`

## Performance Standards

### Backend
- API response time < 200ms (p95)
- Database queries optimized (use EXPLAIN)
- Pagination for large datasets (max 100 items)
- Connection pooling enabled
- Caching for expensive operations

### Frontend
- Initial load < 2s
- Time to Interactive < 3s
- Lazy load routes and components
- Optimize images (WebP, responsive)
- Bundle size < 250KB (gzipped)

## Security Standards

### Authentication
- Use JWT with short expiration (30 minutes)
- Refresh tokens for session management
- Secure password hashing (bcrypt, scrypt)
- Rate limiting on auth endpoints

### Authorization
- Implement RBAC (Role-Based Access Control)
- Validate permissions on every request
- Use principle of least privilege
- Audit sensitive operations

### Data Protection
- HTTPS in production (TLS 1.3)
- Environment variables for secrets
- SQL injection prevention (use ORM)
- XSS prevention (sanitize output)
- CSRF protection (CSRF tokens)

## Deployment Standards

### Containerization
- Multi-stage Docker builds
- Minimal base images (alpine)
- Non-root user in containers
- Health checks defined
- Resource limits set

### Kubernetes
- Use namespaces for isolation
- Define resource requests/limits
- Implement liveness/readiness probes
- Use ConfigMaps for configuration
- Use Secrets for sensitive data

### Cloud
- Infrastructure as Code (Terraform/CloudFormation)
- Auto-scaling policies
- Monitoring and alerting
- Backup and disaster recovery
- Cost optimization

## Review Checklist

Before marking work complete:
- [ ] Spec exists and is followed
- [ ] Tests written and passing (≥80% coverage)
- [ ] Code follows style guide
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Security review passed
- [ ] Performance acceptable
- [ ] Accessibility checked
- [ ] Peer review completed
- [ ] CI/CD passing

## Exceptions

When you must deviate from these standards:
1. Document why in code comments
2. Note in commit message
3. Update relevant spec
4. Create tech debt ticket
5. Get team approval

## Amendment Process

This constitution can be amended by:
1. Proposing change in spec
2. Discussing with team
3. Updating this document
4. Communicating change
