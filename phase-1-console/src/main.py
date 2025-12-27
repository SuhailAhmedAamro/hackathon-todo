"""
Evolution Todo - Phase 1: Console CLI Application

A command-line todo application built with Python, Typer, and SQLite.

Usage:
    python src/main.py --help
    python src/main.py add "Task title"
    python src/main.py list
    python src/main.py update <task_id>
    python src/main.py complete <task_id>
    python src/main.py delete <task_id>

Reference: @skills/python-cli-skill.md
"""

import typer
from typing import Optional
from typing_extensions import Annotated
from datetime import datetime

from .database import init_db, get_db
from .models.task import Task, Priority, Status
from .utils.formatters import (
    display_tasks_table,
    display_task_detail,
    display_stats_panel,
    print_success,
    print_error,
    print_warning,
    print_info,
    print_welcome,
)
from .interactive import run_interactive

# Create Typer app
app = typer.Typer(
    name="todo",
    help="Evolution Todo - Console CLI for task management",
    add_completion=False,
)


@app.callback()
def callback():
    """
    Evolution Todo CLI - Phase 1

    A simple yet powerful console-based task management application.
    """
    # Initialize database on first run
    init_db()


@app.command()
def add(
    title: Annotated[str, typer.Argument(help="Task title")],
    description: Annotated[Optional[str], typer.Option("--description", "-d", help="Task description")] = None,
    priority: Annotated[Priority, typer.Option("--priority", "-p", help="Task priority")] = Priority.MEDIUM,
    due_date: Annotated[Optional[str], typer.Option("--due", help="Due date (YYYY-MM-DD)")] = None,
):
    """
    Add a new task

    Example:
        python src/main.py add "Buy groceries" -d "Milk, eggs, bread" -p high --due 2024-12-31
    """
    try:
        # Parse due date if provided
        parsed_due_date = None
        if due_date:
            try:
                parsed_due_date = datetime.strptime(due_date, "%Y-%m-%d")
            except ValueError:
                print_error("Invalid date format. Use YYYY-MM-DD")
                raise typer.Exit(code=1)

        # Create task
        with get_db() as db:
            task = Task(
                title=title,
                description=description,
                priority=priority,
                due_date=parsed_due_date,
            )
            db.add(task)
            db.commit()
            db.refresh(task)

            print_success(f"Task created successfully!")
            display_task_detail(task)

    except Exception as e:
        print_error(f"Failed to create task: {str(e)}")
        raise typer.Exit(code=1)


@app.command()
def list(
    status: Annotated[Optional[Status], typer.Option("--status", "-s", help="Filter by status")] = None,
    priority: Annotated[Optional[Priority], typer.Option("--priority", "-p", help="Filter by priority")] = None,
    limit: Annotated[int, typer.Option("--limit", "-l", help="Maximum number of tasks to show")] = 50,
):
    """
    List all tasks (with optional filters)

    Examples:
        python src/main.py list
        python src/main.py list --status pending
        python src/main.py list --priority high --limit 10
    """
    try:
        with get_db() as db:
            query = db.query(Task)

            # Apply filters
            if status:
                query = query.filter(Task.status == status)
            if priority:
                query = query.filter(Task.priority == priority)

            # Order by created_at descending (newest first)
            query = query.order_by(Task.created_at.desc())

            # Apply limit
            tasks = query.limit(limit).all()

            # Build title based on filters
            title_parts = ["Tasks"]
            if status:
                title_parts.append(f"Status: {status.value}")
            if priority:
                title_parts.append(f"Priority: {priority.value}")

            title = " | ".join(title_parts)

            display_tasks_table(tasks, title=title)

    except Exception as e:
        print_error(f"Failed to list tasks: {str(e)}")
        raise typer.Exit(code=1)


@app.command()
def update(
    task_id: Annotated[str, typer.Argument(help="Task ID (or first 8 characters)")],
    title: Annotated[Optional[str], typer.Option("--title", "-t", help="New title")] = None,
    description: Annotated[Optional[str], typer.Option("--description", "-d", help="New description")] = None,
    priority: Annotated[Optional[Priority], typer.Option("--priority", "-p", help="New priority")] = None,
    status: Annotated[Optional[Status], typer.Option("--status", "-s", help="New status")] = None,
):
    """
    Update an existing task

    Examples:
        python src/main.py update abc12345 --title "New title"
        python src/main.py update abc12345 --priority high --status in_progress
    """
    try:
        with get_db() as db:
            # Find task by full ID or partial ID
            task = db.query(Task).filter(
                (Task.id == task_id) | (Task.id.like(f"{task_id}%"))
            ).first()

            if not task:
                print_error(f"Task not found with ID: {task_id}")
                raise typer.Exit(code=1)

            # Check if any updates provided
            if not any([title, description, priority, status]):
                print_warning("No updates provided. Use --title, --description, --priority, or --status")
                raise typer.Exit(code=0)

            # Apply updates
            if title:
                task.title = title
            if description:
                task.description = description
            if priority:
                task.priority = priority
            if status:
                task.status = status
                # If marking as completed, set completed_at
                if status == Status.COMPLETED:
                    task.completed_at = datetime.utcnow()

            task.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(task)

            print_success(f"Task updated successfully!")
            display_task_detail(task)

    except Exception as e:
        print_error(f"Failed to update task: {str(e)}")
        raise typer.Exit(code=1)


@app.command()
def complete(
    task_id: Annotated[str, typer.Argument(help="Task ID (or first 8 characters)")],
):
    """
    Mark a task as completed

    Example:
        python src/main.py complete abc12345
    """
    try:
        with get_db() as db:
            # Find task by full ID or partial ID
            task = db.query(Task).filter(
                (Task.id == task_id) | (Task.id.like(f"{task_id}%"))
            ).first()

            if not task:
                print_error(f"Task not found with ID: {task_id}")
                raise typer.Exit(code=1)

            if task.status == Status.COMPLETED:
                print_warning(f"Task '{task.title}' is already completed!")
                raise typer.Exit(code=0)

            # Mark as complete using the method from TaskBase
            task.mark_complete()
            db.commit()
            db.refresh(task)

            print_success(f"Task marked as completed!")
            display_task_detail(task)

    except Exception as e:
        print_error(f"Failed to complete task: {str(e)}")
        raise typer.Exit(code=1)


@app.command()
def delete(
    task_id: Annotated[str, typer.Argument(help="Task ID (or first 8 characters)")],
    force: Annotated[bool, typer.Option("--force", "-f", help="Skip confirmation")] = False,
):
    """
    Delete a task permanently

    Examples:
        python src/main.py delete abc12345
        python src/main.py delete abc12345 --force
    """
    try:
        with get_db() as db:
            # Find task by full ID or partial ID
            task = db.query(Task).filter(
                (Task.id == task_id) | (Task.id.like(f"{task_id}%"))
            ).first()

            if not task:
                print_error(f"Task not found with ID: {task_id}")
                raise typer.Exit(code=1)

            # Show task details before deletion
            print_info("Task to be deleted:")
            display_task_detail(task)

            # Confirm deletion unless --force flag is used
            if not force:
                confirm = typer.confirm("Are you sure you want to delete this task?", default=False)
                if not confirm:
                    print_warning("Deletion cancelled.")
                    raise typer.Exit(code=0)

            # Delete task
            task_title = task.title
            db.delete(task)
            db.commit()

            print_success(f"Task '{task_title}' deleted successfully!")

    except Exception as e:
        print_error(f"Failed to delete task: {str(e)}")
        raise typer.Exit(code=1)


@app.command()
def view(
    task_id: Annotated[str, typer.Argument(help="Task ID (or first 8 characters)")],
):
    """
    View detailed information about a task

    Example:
        python src/main.py view abc12345
    """
    try:
        with get_db() as db:
            # Find task by full ID or partial ID
            task = db.query(Task).filter(
                (Task.id == task_id) | (Task.id.like(f"{task_id}%"))
            ).first()

            if not task:
                print_error(f"Task not found with ID: {task_id}")
                raise typer.Exit(code=1)

            display_task_detail(task)

    except Exception as e:
        print_error(f"Failed to view task: {str(e)}")
        raise typer.Exit(code=1)


@app.command()
def stats():
    """
    Show task statistics

    Example:
        python src/main.py stats
    """
    try:
        with get_db() as db:
            total = db.query(Task).count()
            pending = db.query(Task).filter(Task.status == Status.PENDING).count()
            in_progress = db.query(Task).filter(Task.status == Status.IN_PROGRESS).count()
            completed = db.query(Task).filter(Task.status == Status.COMPLETED).count()

            high_priority = db.query(Task).filter(Task.priority == Priority.HIGH).count()

            display_stats_panel(total, pending, in_progress, completed, high_priority)

    except Exception as e:
        print_error(f"Failed to get statistics: {str(e)}")
        raise typer.Exit(code=1)


@app.command()
def menu():
    """
    Launch interactive menu mode

    Example:
        python src/main.py menu
    """
    run_interactive()


def main():
    """Main entry point for the CLI application"""
    app()


if __name__ == "__main__":
    main()
