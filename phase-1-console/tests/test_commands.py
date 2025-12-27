"""
Test suite for CLI commands

Run tests with:
    pytest
    pytest --cov=src --cov-report=html
"""

import pytest
from typer.testing import CliRunner
from src.main import app
from src.database import init_db, get_db, Base, engine
from src.models.task import Task, Status, Priority

runner = CliRunner()


@pytest.fixture(autouse=True)
def setup_test_db():
    """Setup and teardown test database for each test"""
    # Create all tables
    Base.metadata.create_all(bind=engine)

    yield

    # Clean up - drop all tables
    Base.metadata.drop_all(bind=engine)


def test_add_task():
    """Test adding a new task"""
    result = runner.invoke(app, ["add", "Test Task"])
    assert result.exit_code == 0
    assert "Task created successfully" in result.stdout
    assert "Test Task" in result.stdout


def test_add_task_with_options():
    """Test adding a task with all options"""
    result = runner.invoke(
        app,
        [
            "add",
            "Important Task",
            "--description",
            "This is important",
            "--priority",
            "high",
            "--due",
            "2024-12-31",
        ],
    )
    assert result.exit_code == 0
    assert "Task created successfully" in result.stdout
    assert "Important Task" in result.stdout


def test_list_tasks():
    """Test listing tasks"""
    # Add some tasks first
    runner.invoke(app, ["add", "Task 1"])
    runner.invoke(app, ["add", "Task 2"])

    # List all tasks
    result = runner.invoke(app, ["list"])
    assert result.exit_code == 0
    assert "Task 1" in result.stdout
    assert "Task 2" in result.stdout


def test_list_empty():
    """Test listing when no tasks exist"""
    result = runner.invoke(app, ["list"])
    assert result.exit_code == 0
    assert "No tasks found" in result.stdout


def test_list_with_filters():
    """Test listing with status filter"""
    # Add tasks
    runner.invoke(app, ["add", "Pending Task"])

    # List pending tasks
    result = runner.invoke(app, ["list", "--status", "pending"])
    assert result.exit_code == 0
    assert "Pending Task" in result.stdout


def test_complete_task():
    """Test completing a task"""
    # Add a task
    add_result = runner.invoke(app, ["add", "Complete Me"])
    assert add_result.exit_code == 0

    # Get task ID from database
    with get_db() as db:
        task = db.query(Task).filter(Task.title == "Complete Me").first()
        task_id = task.id[:8]  # Use first 8 chars

    # Complete the task
    result = runner.invoke(app, ["complete", task_id])
    assert result.exit_code == 0
    assert "marked as completed" in result.stdout


def test_update_task():
    """Test updating a task"""
    # Add a task
    add_result = runner.invoke(app, ["add", "Update Me"])
    assert add_result.exit_code == 0

    # Get task ID
    with get_db() as db:
        task = db.query(Task).filter(Task.title == "Update Me").first()
        task_id = task.id[:8]

    # Update the task
    result = runner.invoke(
        app,
        ["update", task_id, "--title", "Updated Task", "--priority", "high"],
    )
    assert result.exit_code == 0
    assert "Task updated successfully" in result.stdout
    assert "Updated Task" in result.stdout


def test_delete_task():
    """Test deleting a task"""
    # Add a task
    add_result = runner.invoke(app, ["add", "Delete Me"])
    assert add_result.exit_code == 0

    # Get task ID
    with get_db() as db:
        task = db.query(Task).filter(Task.title == "Delete Me").first()
        task_id = task.id[:8]

    # Delete with force flag to skip confirmation
    result = runner.invoke(app, ["delete", task_id, "--force"])
    assert result.exit_code == 0
    assert "deleted successfully" in result.stdout


def test_view_task():
    """Test viewing task details"""
    # Add a task
    add_result = runner.invoke(app, ["add", "View Me", "-d", "Test description"])
    assert add_result.exit_code == 0

    # Get task ID
    with get_db() as db:
        task = db.query(Task).filter(Task.title == "View Me").first()
        task_id = task.id[:8]

    # View the task
    result = runner.invoke(app, ["view", task_id])
    assert result.exit_code == 0
    assert "View Me" in result.stdout
    assert "Test description" in result.stdout


def test_stats():
    """Test statistics command"""
    # Add some tasks
    runner.invoke(app, ["add", "Task 1"])
    runner.invoke(app, ["add", "Task 2", "--priority", "high"])

    # Get stats
    result = runner.invoke(app, ["stats"])
    assert result.exit_code == 0
    assert "Total tasks: 2" in result.stdout
    assert "Pending: 2" in result.stdout


def test_nonexistent_task():
    """Test operations on non-existent task"""
    result = runner.invoke(app, ["complete", "nonexistent"])
    assert result.exit_code == 1
    assert "not found" in result.stdout


def test_invalid_date_format():
    """Test adding task with invalid date format"""
    result = runner.invoke(app, ["add", "Task", "--due", "invalid-date"])
    assert result.exit_code == 1
    assert "Invalid date format" in result.stdout
