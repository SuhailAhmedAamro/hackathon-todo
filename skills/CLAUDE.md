# Skills - Reusable Intelligence

## Purpose
This directory contains reusable code, patterns, and intelligence that can be shared across all phases.

## Contents

### Skill Documents
- `python-cli-skill.md` - CLI development patterns with Click/Typer
- `spec-writer-skill.md` - Guidelines for writing consistent specs
- `kubernetes-deployer-skill.md` - K8s deployment patterns and troubleshooting
- `dockerizer.py` - Automated Docker image creation script

### Shared Models (`/models/`)
Reusable data models that work across phases:
- `task.py` - Task model base class
- `user.py` - User model base class
- `conversation.py` - Conversation model (Phase 3+)

### Utilities (`/utils/`)
Helper functions and utilities:
- `helpers.py` - Common helper functions
- `validators.py` - Input validation functions

## How to Use

### From Phase Implementations
```python
# Import shared models
from skills.models.task import TaskBase

# Extend for phase-specific needs
class Task(TaskBase, Base):
    __tablename__ = "tasks"
    # Phase-specific extensions
```

### As Reference
Read skill documents to understand patterns and best practices before implementing similar functionality.

## Adding New Skills
1. Extract common patterns from phase implementations
2. Create skill document or code file
3. Document usage examples
4. Update this CLAUDE.md file
5. Reference from phase-specific code

## Key Principle
**DRY (Don't Repeat Yourself)**: If code appears in multiple phases, consider extracting it to skills.
