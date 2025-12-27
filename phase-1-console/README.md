# Phase 1: Console CLI - Evolution Todo

A powerful Python CLI application for task management built with Typer, SQLAlchemy, and Rich.

## Features

- Add, update, delete, and view tasks
- Task prioritization (LOW, MEDIUM, HIGH)
- Task status tracking (PENDING, IN_PROGRESS, COMPLETED)
- Due date support
- Beautiful terminal output with Rich
- SQLite database for persistence
- Comprehensive test suite

## Quick Start

### Installation

1. **Create and activate a virtual environment** (recommended):
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Run the application**:
```bash
python run.py --help
```

The database will be automatically created on first run at `data/todos.db`.

## Usage

### Add a Task

```bash
# Simple task
python run.py add "Buy groceries"

# Task with description and priority
python run.py add "Review code" -d "Review PR #123" -p high

# Task with due date
python run.py add "Submit report" --due 2024-12-31

# All options
python run.py add "Complete project" \
    --description "Finish Phase 1 implementation" \
    --priority high \
    --due 2024-12-25
```

### List Tasks

```bash
# List all tasks
python run.py list

# Filter by status
python run.py list --status pending
python run.py list --status completed

# Filter by priority
python run.py list --priority high

# Combine filters and limit results
python run.py list --status pending --priority high --limit 10
```

### Update a Task

```bash
# Update title
python run.py update abc12345 --title "New title"

# Update priority and status
python run.py update abc12345 --priority high --status in_progress

# Update description
python run.py update abc12345 --description "Updated description"

# Multiple updates at once
python run.py update abc12345 \
    --title "New title" \
    --priority high \
    --status in_progress
```

Note: You can use the full task ID or just the first 8 characters (shown in the list view).

### Complete a Task

```bash
# Mark task as completed
python run.py complete abc12345
```

This automatically:
- Sets status to COMPLETED
- Records completion timestamp
- Updates the updated_at field

### View Task Details

```bash
# View detailed information about a task
python run.py view abc12345
```

### Delete a Task

```bash
# Delete with confirmation prompt
python run.py delete abc12345

# Delete without confirmation (force)
python run.py delete abc12345 --force
```

### View Statistics

```bash
# Show task statistics
python run.py stats
```

Displays:
- Total number of tasks
- Count by status (Pending, In Progress, Completed)
- High priority task count

## Command Reference

| Command | Description | Options |
|---------|-------------|---------|
| `add` | Create a new task | `--description`, `--priority`, `--due` |
| `list` | List all tasks | `--status`, `--priority`, `--limit` |
| `update` | Update an existing task | `--title`, `--description`, `--priority`, `--status` |
| `complete` | Mark task as completed | None |
| `delete` | Delete a task | `--force` |
| `view` | View task details | None |
| `stats` | Show task statistics | None |

## Priority Levels

- `low` - Low priority (green)
- `medium` - Medium priority (yellow) - **default**
- `high` - High priority (red)

## Status Values

- `pending` - Task not started (yellow)
- `in_progress` - Task in progress (blue)
- `completed` - Task completed (green)

## Project Structure

```
phase-1-console/
├── src/
│   ├── __init__.py
│   ├── main.py              # CLI entry point with all commands
│   ├── database.py          # SQLite database setup
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py          # Task model (extends @skills/models/task.py)
│   └── utils/
│       ├── __init__.py
│       └── formatters.py    # Rich output formatters
├── tests/
│   ├── __init__.py
│   └── test_commands.py     # Comprehensive test suite
├── data/
│   └── todos.db             # SQLite database (auto-created)
├── run.py                   # Convenient runner script
├── requirements.txt         # Python dependencies
├── setup.py                 # Package setup
├── pytest.ini               # Test configuration
└── README.md                # This file
```

## Development

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=src --cov-report=html

# Run specific test
pytest tests/test_commands.py::test_add_task
```

### Installing as Package

```bash
# Install in development mode
pip install -e .

# Now you can use 'todo' command anywhere
todo add "My task"
todo list
```

## Tech Stack

- **Python 3.11+** - Modern Python features
- **Typer 0.9.0** - CLI framework with type hints
- **SQLAlchemy 2.0** - SQL toolkit and ORM
- **Rich 13.7** - Beautiful terminal formatting
- **SQLite** - Lightweight database
- **pytest** - Testing framework

## Reusable Intelligence

This phase leverages and contributes to the shared skills:

### Uses:
- `@skills/models/task.py` - Base Task model
- `@skills/python-cli-skill.md` - CLI development patterns

### Provides:
- Tested CLI implementation
- SQLite database patterns
- Rich formatting utilities

## Specifications

For detailed specifications, see:
- `@specs/phases/phase-1-console.md` - Phase requirements
- `@specs/features/task-crud.md` - CRUD operations spec
- `@specs/database/schema.md` - Database schema
- `@specs/constitution.md` - Development principles

## Troubleshooting

### Database Issues

If you encounter database errors:
```bash
# Delete the database and start fresh
rm data/todos.db
python run.py add "First task"
```

### Import Errors

Make sure you're in the project root directory and have activated your virtual environment:
```bash
cd phase-1-console
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

### Module Not Found

If you see "ModuleNotFoundError":
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

## Examples

### Complete Workflow

```bash
# Create some tasks
python run.py add "Plan project" -p high
python run.py add "Write code" -p medium
python run.py add "Write tests" -p high
python run.py add "Deploy" -p low

# View all tasks
python run.py list

# Start working on planning
python run.py update <plan-id> --status in_progress

# Complete planning
python run.py complete <plan-id>

# View statistics
python run.py stats

# View specific task details
python run.py view <task-id>

# Delete a task
python run.py delete <task-id> --force
```

## Next Steps

This is Phase 1 of the Evolution of Todo project. Next phases include:

- **Phase 2**: Web Application (Next.js + FastAPI)
- **Phase 3**: Chatbot Interface (MCP + Claude)
- **Phase 4**: Kubernetes Deployment
- **Phase 5**: Cloud-Native Architecture

See `@specs/overview.md` for the complete roadmap.

## Contributing

When adding features:
1. Read the relevant specs first
2. Write tests for new functionality
3. Follow the constitution guidelines: `@specs/constitution.md`
4. Extract reusable code to `@skills/` directory

## License

Part of the Evolution of Todo educational project.
