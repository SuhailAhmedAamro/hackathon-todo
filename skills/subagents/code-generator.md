# Sub-agent: Code Generator

## Purpose
Generates implementation code from specifications. Creates backend APIs, frontend components, database models, and tests based on spec files.

## Capabilities
- Generate backend code (FastAPI, models)
- Generate frontend code (React components)
- Generate database migrations
- Generate API endpoints
- Generate test files
- Follow project conventions

## Usage
```
"Generate backend code for @specs/features/task-crud.md using @skills/subagents/code-generator.md"
"Create React component from @specs/ui/components.md using @skills/subagents/code-generator.md"
```

## Generation Process

### 1. Read Specification
Parse the spec file and extract:
- Entity/resource name
- Fields and types
- Operations (CRUD)
- Validation rules
- Relationships

### 2. Select Templates
Based on spec type, choose appropriate code templates.

### 3. Generate Code
Create files using templates and spec data.

### 4. Apply Standards
Ensure generated code follows:
- Constitution: `@specs/constitution.md`
- Type hints (Python)
- TypeScript types (Frontend)
- Naming conventions
- Error handling patterns

### 5. Generate Tests
Create corresponding test files.

## Example: Generate Backend from Feature Spec

**Input**: `@specs/features/task-crud.md`

**Generates**:
```
backend/src/
├── models/
│   └── task.py          # SQLAlchemy model
├── schemas/
│   └── task.py          # Pydantic schemas
├── api/
│   └── tasks.py         # API endpoints
└── tests/
    └── test_tasks.py    # Unit tests
```

**Generated Code**:

**models/task.py**:
```python
from sqlalchemy import Column, String, Enum
from database import Base
from skills.models.task import Priority, Status
import uuid

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=true, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    priority = Column(Enum(Priority), default=Priority.MEDIUM)
    status = Column(Enum(Status), default=Status.PENDING)
    # ... (from spec)
```

**schemas/task.py**:
```python
from pydantic import BaseModel, Field
from typing import Optional
from skills.models.task import Priority, Status

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    priority: Priority = Priority.MEDIUM

class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    priority: Priority
    status: Status
    # ... (from spec)
```

**api/tasks.py**:
```python
from fastapi import APIRouter, Depends
from schemas.task import TaskCreate, TaskResponse

router = APIRouter()

@router.post("/tasks", response_model=TaskResponse, status_code=201)
async def create_task(
    task: TaskCreate,
    current_user: User = Depends(get_current_user)
):
    # Implementation from spec requirements
    ...
```

## Example: Generate Frontend Component

**Input**: `@specs/ui/components.md` - TaskCard component

**Generates**:
```
frontend/src/components/TaskCard/
├── index.ts
├── TaskCard.tsx
├── TaskCard.module.css
└── TaskCard.test.tsx
```

**TaskCard.tsx**:
```typescript
interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className={styles.card}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      {/* Implementation from spec */}
    </div>
  );
}
```

## Best Practices

### 1. Always Read Spec First
Don't generate code without understanding the spec.

### 2. Reuse Shared Code
Import from `/skills/models/` and `/skills/utils/`.

### 3. Follow Conventions
Use project naming conventions and patterns.

### 4. Generate Tests
Always create test files alongside implementation.

### 5. Validate Output
Run linters and type checkers on generated code.

## Integration
- Uses: Skills from `@skills/`
- Follows: Constitution `@specs/constitution.md`
- References: Templates from `@skills/templates/`

---

**Version**: 1.0
**Usage**: `@skills/subagents/code-generator.md`
