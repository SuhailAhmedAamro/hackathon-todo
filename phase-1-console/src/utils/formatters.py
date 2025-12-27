"""Output formatting utilities using Rich library"""

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text
from rich import box
from rich.prompt import Prompt, Confirm
from typing import List
from datetime import datetime

from ..models.task import Task, Priority, Status

# Use Rich console with legacy Windows support disabled for better emoji handling
console = Console(emoji=False, markup=True, legacy_windows=False, force_terminal=True)

# Color schemes with emojis
PRIORITY_COLORS = {
    Priority.LOW: "green",
    Priority.MEDIUM: "yellow",
    Priority.HIGH: "red",
}

PRIORITY_EMOJIS = {
    Priority.LOW: "●",
    Priority.MEDIUM: "●",
    Priority.HIGH: "●",
}

STATUS_COLORS = {
    Status.PENDING: "yellow",
    Status.IN_PROGRESS: "blue",
    Status.COMPLETED: "green",
}

STATUS_EMOJIS = {
    Status.PENDING: "○",
    Status.IN_PROGRESS: "◐",
    Status.COMPLETED: "✓",
}


def format_priority(priority: Priority) -> Text:
    """Format priority with color and emoji"""
    color = PRIORITY_COLORS.get(priority, "white")
    emoji = PRIORITY_EMOJIS.get(priority, "")
    return Text(f"{emoji} {priority.value.upper()}", style=f"bold {color}")


def format_status(status: Status) -> Text:
    """Format status with color and emoji"""
    color = STATUS_COLORS.get(status, "white")
    emoji = STATUS_EMOJIS.get(status, "")
    status_text = status.value.replace('_', ' ').title()
    return Text(f"{emoji} {status_text}", style=color)


def format_date(dt: datetime) -> str:
    """Format datetime for display"""
    if not dt:
        return "N/A"
    return dt.strftime("%Y-%m-%d %H:%M")


def truncate_text(text: str, max_length: int = 50) -> str:
    """Truncate text with ellipsis"""
    if not text:
        return ""
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."


def display_tasks_table(tasks: List[Task], title: str = "📋 Tasks"):
    """Display tasks in a formatted table"""
    if not tasks:
        console.print(f"\n[yellow]No tasks found.[/yellow]\n")
        return

    table = Table(
        title=title,
        show_header=True,
        header_style="bold cyan",
        border_style="blue",
        box=box.ROUNDED,
        title_style="bold magenta"
    )

    table.add_column("ID", style="cyan", no_wrap=True, width=8)
    table.add_column("Title", style="white")
    table.add_column("Priority", justify="center")
    table.add_column("Status", justify="center")
    table.add_column("Due Date", style="dim")
    table.add_column("Created", style="dim")

    for task in tasks:
        table.add_row(
            task.id[:8],  # Show first 8 chars of UUID
            truncate_text(task.title, 40),
            format_priority(task.priority),
            format_status(task.status),
            format_date(task.due_date) if task.due_date else "-",
            format_date(task.created_at),
        )

    console.print()
    console.print(table)
    console.print()
    console.print(f"[dim]📊 Total: {len(tasks)} task(s)[/dim]\n")


def display_task_detail(task: Task):
    """Display detailed view of a single task"""

    # Create priority badge
    priority_badge = format_priority(task.priority)
    status_badge = format_status(task.status)

    content = f"""[bold cyan]Title:[/bold cyan] {task.title}
[bold cyan]ID:[/bold cyan] {task.id}
[bold cyan]Description:[/bold cyan] {task.description or 'No description'}

[bold cyan]Priority:[/bold cyan] {priority_badge}
[bold cyan]Status:[/bold cyan] {status_badge}

[bold cyan]Created:[/bold cyan] 📅 {format_date(task.created_at)}
[bold cyan]Updated:[/bold cyan] 🔄 {format_date(task.updated_at)}
[bold cyan]Due Date:[/bold cyan] ⏰ {format_date(task.due_date) if task.due_date else 'Not set'}
[bold cyan]Completed:[/bold cyan] 🏆 {format_date(task.completed_at) if task.completed_at else 'Not completed'}
    """.strip()

    panel = Panel(
        content,
        title="📄 [bold]Task Details[/bold]",
        border_style="blue",
        box=box.DOUBLE
    )
    console.print()
    console.print(panel)
    console.print()


def print_success(message: str):
    """Print success message with emoji"""
    console.print(f"\n✓ [green]{message}[/green]\n")


def print_error(message: str):
    """Print error message with emoji"""
    console.print(f"\n✗ [red]Error: {message}[/red]\n")


def print_warning(message: str):
    """Print warning message with emoji"""
    console.print(f"\n⚠ [yellow]Warning: {message}[/yellow]\n")


def print_info(message: str):
    """Print info message with emoji"""
    console.print(f"\nℹ [blue]{message}[/blue]\n")


def print_welcome():
    """Print welcome banner"""
    welcome = """
[bold cyan]╔═══════════════════════════════════════════════╗
║                                               ║
║       🚀 EVOLUTION TODO - PHASE 1 🚀         ║
║                                               ║
║          Your Smart Task Manager 🧠          ║
║                                               ║
╚═══════════════════════════════════════════════╝[/bold cyan]
    """
    console.print(welcome)


def display_stats_panel(total: int, pending: int, in_progress: int, completed: int, high_priority: int):
    """Display statistics in a beautiful panel"""

    stats_content = f"""
[bold yellow]📊 Total Tasks:[/bold yellow] {total}

[bold cyan]Status Breakdown:[/bold cyan]
  ⏳ Pending: {pending}
  ⚙  In Progress: {in_progress}
  ✓ Completed: {completed}

[bold red]🔴 High Priority:[/bold red] {high_priority}

[dim]Keep going! You're doing great! 💪[/dim]
    """.strip()

    panel = Panel(
        stats_content,
        title="📈 [bold]Task Statistics[/bold]",
        border_style="green",
        box=box.DOUBLE
    )

    console.print()
    console.print(panel)
    console.print()
