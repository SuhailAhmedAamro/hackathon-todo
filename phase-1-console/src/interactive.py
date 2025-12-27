"""Interactive menu for Evolution Todo CLI"""

import typer
from rich.console import Console
from rich.prompt import Prompt, Confirm
from rich.panel import Panel
from rich import box
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
    console,
)

def show_menu():
    """Display interactive menu"""
    menu = """
[bold cyan]:rocket: Evolution Todo - Interactive Menu :rocket:[/bold cyan]

[bold yellow]1.[/bold yellow] :heavy_plus_sign:  Add New Task
[bold yellow]2.[/bold yellow] :clipboard:  View All Tasks
[bold yellow]3.[/bold yellow] :mag:  View Task Details
[bold yellow]4.[/bold yellow] :pencil2:  Update Task
[bold yellow]5.[/bold yellow] :white_check_mark:  Complete Task
[bold yellow]6.[/bold yellow] :wastebasket:  Delete Task
[bold yellow]7.[/bold yellow] :bar_chart:  View Statistics
[bold yellow]8.[/bold yellow] :fire:  View High Priority Tasks
[bold yellow]9.[/bold yellow] :hourglass_not_done:  View Pending Tasks
[bold yellow]0.[/bold yellow] :wave:  Exit

    """
    console.print(Panel(menu, border_style="cyan", box=box.DOUBLE))


def interactive_add():
    """Interactive task creation"""
    console.print("\n[bold cyan]:heavy_plus_sign: Create New Task[/bold cyan]\n")

    title = Prompt.ask(":memo: [bold]Task Title[/bold]")
    description = Prompt.ask(":page_facing_up: [bold]Description[/bold] (optional)", default="")

    priority_choice = Prompt.ask(
        ":signal_strength: [bold]Priority[/bold]",
        choices=["1", "2", "3"],
        default="2"
    )

    priority_map = {"1": Priority.LOW, "2": Priority.MEDIUM, "3": Priority.HIGH}
    priority = priority_map[priority_choice]

    has_due_date = Confirm.ask(":calendar: [bold]Set due date?[/bold]", default=False)
    due_date = None

    if has_due_date:
        date_str = Prompt.ask(":alarm_clock: [bold]Due date (YYYY-MM-DD)[/bold]")
        try:
            due_date = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            print_error("Invalid date format! Task will be created without due date.")

    try:
        with get_db() as db:
            task = Task(
                title=title,
                description=description if description else None,
                priority=priority,
                due_date=due_date,
            )
            db.add(task)
            db.commit()
            db.refresh(task)

            print_success("Task created successfully! :tada:")
            display_task_detail(task)

    except Exception as e:
        print_error(f"Failed to create task: {str(e)}")


def interactive_list(filter_status=None, filter_priority=None):
    """Interactive task listing"""
    try:
        with get_db() as db:
            query = db.query(Task)

            if filter_status:
                query = query.filter(Task.status == filter_status)
            if filter_priority:
                query = query.filter(Task.priority == filter_priority)

            query = query.order_by(Task.created_at.desc())
            tasks = query.all()

            title_parts = [":clipboard: Tasks"]
            if filter_status:
                title_parts.append(f"Status: {filter_status.value}")
            if filter_priority:
                title_parts.append(f"Priority: {filter_priority.value}")

            title = " | ".join(title_parts)
            display_tasks_table(tasks, title=title)

    except Exception as e:
        print_error(f"Failed to list tasks: {str(e)}")


def interactive_view():
    """Interactive task viewing"""
    task_id = Prompt.ask("\n:mag: [bold]Enter Task ID (first 8 characters)[/bold]")

    try:
        with get_db() as db:
            task = db.query(Task).filter(
                (Task.id == task_id) | (Task.id.like(f"{task_id}%"))
            ).first()

            if not task:
                print_error(f"Task not found with ID: {task_id}")
                return

            display_task_detail(task)

    except Exception as e:
        print_error(f"Failed to view task: {str(e)}")


def interactive_update():
    """Interactive task update"""
    task_id = Prompt.ask("\n:pencil2: [bold]Enter Task ID to update[/bold]")

    try:
        with get_db() as db:
            task = db.query(Task).filter(
                (Task.id == task_id) | (Task.id.like(f"{task_id}%"))
            ).first()

            if not task:
                print_error(f"Task not found with ID: {task_id}")
                return

            # Show current task
            console.print("\n[bold cyan]Current Task:[/bold cyan]")
            display_task_detail(task)

            # Ask what to update
            console.print("[bold yellow]What would you like to update? (Leave blank to skip)[/bold yellow]\n")

            new_title = Prompt.ask(":memo: [bold]New Title[/bold]", default=task.title)
            new_description = Prompt.ask(":page_facing_up: [bold]New Description[/bold]", default=task.description or "")

            priority_choice = Prompt.ask(
                ":signal_strength: [bold]Priority[/bold] (1=Low, 2=Medium, 3=High)",
                choices=["1", "2", "3"],
                default=str(["low", "medium", "high"].index(task.priority.value) + 1)
            )

            status_choice = Prompt.ask(
                ":gear: [bold]Status[/bold] (1=Pending, 2=In Progress, 3=Completed)",
                choices=["1", "2", "3"],
                default=str(["pending", "in_progress", "completed"].index(task.status.value) + 1)
            )

            priority_map = {"1": Priority.LOW, "2": Priority.MEDIUM, "3": Priority.HIGH}
            status_map = {"1": Status.PENDING, "2": Status.IN_PROGRESS, "3": Status.COMPLETED}

            task.title = new_title
            task.description = new_description if new_description else None
            task.priority = priority_map[priority_choice]
            task.status = status_map[status_choice]

            if task.status == Status.COMPLETED and not task.completed_at:
                task.completed_at = datetime.utcnow()

            task.updated_at = datetime.utcnow()

            db.commit()
            db.refresh(task)

            print_success("Task updated successfully! :sparkles:")
            display_task_detail(task)

    except Exception as e:
        print_error(f"Failed to update task: {str(e)}")


def interactive_complete():
    """Interactive task completion"""
    task_id = Prompt.ask("\n:white_check_mark: [bold]Enter Task ID to complete[/bold]")

    try:
        with get_db() as db:
            task = db.query(Task).filter(
                (Task.id == task_id) | (Task.id.like(f"{task_id}%"))
            ).first()

            if not task:
                print_error(f"Task not found with ID: {task_id}")
                return

            if task.status == Status.COMPLETED:
                print_warning(f"Task '{task.title}' is already completed! :tada:")
                return

            task.mark_complete()
            db.commit()
            db.refresh(task)

            print_success("Task marked as completed! Great job! :trophy:")
            display_task_detail(task)

    except Exception as e:
        print_error(f"Failed to complete task: {str(e)}")


def interactive_delete():
    """Interactive task deletion"""
    task_id = Prompt.ask("\n:wastebasket: [bold]Enter Task ID to delete[/bold]")

    try:
        with get_db() as db:
            task = db.query(Task).filter(
                (Task.id == task_id) | (Task.id.like(f"{task_id}%"))
            ).first()

            if not task:
                print_error(f"Task not found with ID: {task_id}")
                return

            # Show task before deletion
            console.print("\n[bold red]Task to be deleted:[/bold red]")
            display_task_detail(task)

            # Confirm deletion
            confirm = Confirm.ask("[bold red]Are you sure you want to delete this task?[/bold red]", default=False)

            if not confirm:
                print_warning("Deletion cancelled. :relieved:")
                return

            task_title = task.title
            db.delete(task)
            db.commit()

            print_success(f"Task '{task_title}' deleted successfully! :broom:")

    except Exception as e:
        print_error(f"Failed to delete task: {str(e)}")


def interactive_stats():
    """Show statistics"""
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


def run_interactive():
    """Run interactive mode"""
    init_db()
    print_welcome()

    while True:
        show_menu()

        choice = Prompt.ask(
            "\n[bold cyan]:point_right: Select an option[/bold cyan]",
            choices=["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
        )

        if choice == "0":
            console.print("\n[bold cyan]:wave: Thanks for using Evolution Todo! Goodbye! :sparkles:[/bold cyan]\n")
            break
        elif choice == "1":
            interactive_add()
        elif choice == "2":
            interactive_list()
        elif choice == "3":
            interactive_view()
        elif choice == "4":
            interactive_update()
        elif choice == "5":
            interactive_complete()
        elif choice == "6":
            interactive_delete()
        elif choice == "7":
            interactive_stats()
        elif choice == "8":
            interactive_list(filter_priority=Priority.HIGH)
        elif choice == "9":
            interactive_list(filter_status=Status.PENDING)

        # Pause before showing menu again
        console.print()
        Prompt.ask("[dim]Press Enter to continue...[/dim]", default="")
        console.clear()
