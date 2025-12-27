# Implementation Guide - Spec-Driven Development

This guide helps Claude Code implement features following the Spec-Kit workflow.

## Pre-Implementation Checklist

Before writing any code:
- [ ] Read the feature spec: `@specs/features/[feature-name].md`
- [ ] Read related API spec: `@specs/api/[api-name].md`
- [ ] Read database schema: `@specs/database/schema.md`
- [ ] Read UI spec (if applicable): `@specs/ui/[ui-name].md`
- [ ] Review architecture: `@specs/architecture.md`
- [ ] Check constitution: `@specs/constitution.md`
- [ ] Identify reusable skills: `@skills/`

## Implementation Workflow

### Step 1: Understand the Spec
```
1. Read the entire spec carefully
2. Identify acceptance criteria
3. Note dependencies and constraints
4. Check phase applicability
5. Clarify ambiguities with user
```

### Step 2: Plan the Implementation
```
1. Break down into subtasks
2. Identify files to create/modify
3. Plan data models
4. Design API contracts
5. Plan test cases
6. Estimate complexity
```

### Step 3: Implement Backend (if applicable)
```
1. Create/update data models
2. Implement database migrations
3. Create API endpoints
4. Add validation logic
5. Implement business logic
6. Add error handling
7. Write unit tests
```

### Step 4: Implement Frontend (if applicable)
```
1. Create UI components
2. Implement pages/routes
3. Connect to API
4. Add form validation
5. Handle loading/error states
6. Style with Tailwind/CSS
7. Ensure accessibility
8. Write component tests
```

### Step 5: Integration
```
1. Test end-to-end flows
2. Verify acceptance criteria
3. Check error handling
4. Test edge cases
5. Verify cross-browser compatibility
```

### Step 6: Documentation
```
1. Update API documentation
2. Add code comments (where necessary)
3. Update README if needed
4. Document any deviations from spec
```

## Code Quality Standards

### Python (Backend)
```python
# Use type hints
def create_task(title: str, user_id: str) -> Task:
    """Create a new task.

    Args:
        title: Task title
        user_id: ID of the user creating the task

    Returns:
        Created task object

    Raises:
        ValidationError: If title is invalid
    """
    pass

# Use Pydantic models
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    priority: Priority = Priority.MEDIUM

# Use dependency injection
@router.post("/tasks")
async def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pass
```

### TypeScript/React (Frontend)
```typescript
// Use TypeScript interfaces
interface TaskListProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  isLoading?: boolean;
}

// Use proper component structure
export function TaskList({ tasks, onTaskClick, isLoading = false }: TaskListProps) {
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <ul role="list" aria-label="Task list">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
      ))}
    </ul>
  );
}

// Use custom hooks for logic
function useTaskList(userId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks(userId)
      .then(setTasks)
      .finally(() => setLoading(false));
  }, [userId]);

  return { tasks, loading };
}
```

## Testing Standards

### Backend Tests
```python
# Test file: test_tasks.py
def test_create_task_success(client, auth_headers):
    """Test successful task creation"""
    response = client.post(
        "/api/tasks",
        json={"title": "Test Task", "priority": "high"},
        headers=auth_headers
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Test Task"

def test_create_task_invalid_title(client, auth_headers):
    """Test task creation with invalid title"""
    response = client.post(
        "/api/tasks",
        json={"title": ""},
        headers=auth_headers
    )
    assert response.status_code == 400
```

### Frontend Tests
```typescript
// Test file: TaskList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';

test('renders task list', () => {
  const tasks = [
    { id: '1', title: 'Task 1', status: 'pending' },
    { id: '2', title: 'Task 2', status: 'completed' }
  ];

  render(<TaskList tasks={tasks} onTaskClick={jest.fn()} />);

  expect(screen.getByText('Task 1')).toBeInTheDocument();
  expect(screen.getByText('Task 2')).toBeInTheDocument();
});

test('calls onTaskClick when task is clicked', () => {
  const mockClick = jest.fn();
  const tasks = [{ id: '1', title: 'Task 1', status: 'pending' }];

  render(<TaskList tasks={tasks} onTaskClick={mockClick} />);

  fireEvent.click(screen.getByText('Task 1'));
  expect(mockClick).toHaveBeenCalledWith('1');
});
```

## Common Patterns

### Error Handling
```python
# Backend
from fastapi import HTTPException

async def get_task(task_id: str, db: Session):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
```

```typescript
// Frontend
async function fetchTask(taskId: string): Promise<Task> {
  try {
    const response = await fetch(`/api/tasks/${taskId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
}
```

### Validation
```python
# Backend validation with Pydantic
class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    priority: Optional[Priority] = None

    @validator('title')
    def title_not_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Title cannot be empty')
        return v
```

```typescript
// Frontend validation with React Hook Form + Zod
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high'])
});

function TaskForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
    </form>
  );
}
```

## Reusing Skills

### Check Skills First
```
1. Review @skills/ directory
2. Look for relevant patterns
3. Import shared models from @skills/models/
4. Use utilities from @skills/utils/
5. Follow patterns from skill files
```

### Example: Using Shared Models
```python
# In phase-2-web/backend/src/models/task.py
from skills.models.task import TaskBase

class Task(TaskBase, Base):
    __tablename__ = "tasks"
    # Phase-specific extensions here
```

## Spec Deviations

If you need to deviate from the spec:
1. **Document why** in code comments
2. **Update the spec** to reflect reality
3. **Notify the user** of the change
4. **Explain trade-offs** made

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Code follows quality standards
- [ ] Tests written and passing
- [ ] Error handling implemented
- [ ] Accessibility requirements met
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] Spec deviations documented
