# Phase 1: Console CLI - Specification

## Overview
Build a functional command-line todo application using Python. This phase establishes the foundation for all future phases.

## Goals
- Create a working CLI application
- Implement core task management features
- Establish data models that will be reused in later phases
- Practice Test-Driven Development (TDD)

## Tech Stack
- **Language**: Python 3.11+
- **CLI Framework**: Click or Typer
- **Database**: SQLite
- **ORM**: SQLAlchemy
- **Testing**: pytest

## Features

### Task Management
- Create tasks with title, description, priority
- List all tasks
- View task details
- Update task properties
- Delete tasks
- Mark tasks as complete
- Filter tasks by status, priority

### Data Persistence
- SQLite database for storage
- CRUD operations via SQLAlchemy
- Database initialization on first run

## CLI Commands

```bash
# Initialize database
todo init

# Create a new task
todo add "Task title" --priority high --description "Details"

# List tasks
todo list
todo list --status pending
todo list --priority high
todo list --completed

# View task details
todo show <task_id>

# Update task
todo update <task_id> --title "New title"
todo update <task_id> --priority medium
todo update <task_id> --description "New description"

# Complete task
todo complete <task_id>

# Delete task
todo delete <task_id>

# Statistics
todo stats
```

## Data Model

```python
from sqlalchemy import Column, String, Text, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import datetime

Base = declarative_base()

class Priority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Status(enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(Enum(Priority), default=Priority.MEDIUM)
    status = Column(Enum(Status), default=Status.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
```

## Project Structure

```
phase-1-console/
├── src/
│   ├── __init__.py
│   ├── main.py              # CLI entry point
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py          # Task model
│   ├── database.py          # Database setup
│   ├── commands/
│   │   ├── __init__.py
│   │   ├── add.py
│   │   ├── list.py
│   │   ├── update.py
│   │   └── delete.py
│   └── utils/
│       ├── __init__.py
│       └── formatters.py    # Output formatting
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_commands.py
│   └── test_database.py
├── requirements.txt
└── README.md
```

## Implementation Checklist
- [ ] Set up project structure
- [ ] Configure SQLAlchemy with SQLite
- [ ] Implement Task model
- [ ] Create CLI commands (add, list, update, delete, complete)
- [ ] Add output formatting (tables, colors)
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Create README with usage instructions
- [ ] Extract reusable code to `/skills/`

## Testing Requirements
- Unit tests for each command
- Database integration tests
- Edge case handling
- Minimum 80% code coverage

## Success Criteria
- [ ] All CLI commands work as expected
- [ ] Tasks persist across sessions
- [ ] Tests pass with ≥80% coverage
- [ ] Clean, readable code
- [ ] Documentation complete

## Next Phase
Phase 2 will build a web interface, reusing the Task model and business logic established here.
