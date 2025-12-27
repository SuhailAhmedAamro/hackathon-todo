# Phase 1: Console CLI - Claude Guide

## Overview
Python CLI todo application using Click/Typer and SQLite.

## Before You Start
1. Read: `@specs/phases/phase-1-console.md`
2. Read: `@specs/features/task-crud.md`
3. Read: `@specs/database/schema.md`
4. Review: `@skills/python-cli-skill.md`

## Implementation Order
1. Set up project structure
2. Implement Task model (reuse `@skills/models/task.py`)
3. Create database setup
4. Implement CLI commands
5. Write tests
6. Extract reusable code to `/skills/`

## Key Files
- `src/main.py` - CLI entry point
- `src/models/task.py` - Task model
- `src/database.py` - Database setup
- `src/commands/` - CLI command implementations
- `tests/` - Unit and integration tests

## Run Locally
```bash
pip install -r requirements.txt
python src/main.py init
python src/main.py add "My first task"
python src/main.py list
```

## Next Phase
Extract Task model and utilities to `/skills/` for reuse in Phase 2.
