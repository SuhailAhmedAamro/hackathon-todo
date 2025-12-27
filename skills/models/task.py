"""Base Task model - reusable across all phases"""

from datetime import datetime
from enum import Enum
from typing import Optional


class Priority(str, Enum):
    """Task priority levels"""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Status(str, Enum):
    """Task status"""

    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class TaskBase:
    """
    Base Task model with common fields.

    Phase-specific implementations should inherit from this and add
    ORM-specific configuration (SQLAlchemy, etc.)

    Example usage in Phase 1 (SQLite):
        from skills.models.task import TaskBase, Priority, Status
        from sqlalchemy.ext.declarative import declarative_base

        Base = declarative_base()

        class Task(TaskBase, Base):
            __tablename__ = "tasks"
            # Add SQLAlchemy-specific configuration

    Example usage in Phase 2+ (PostgreSQL):
        from skills.models.task import TaskBase, Priority, Status
        from sqlalchemy import Column, String, DateTime

        class Task(TaskBase, Base):
            __tablename__ = "tasks"
            id = Column(String, primary_key=True)
            # ... other SQLAlchemy columns
    """

    # Core fields present in all phases
    id: str
    title: str
    description: Optional[str] = None
    priority: Priority = Priority.MEDIUM
    status: Status = Status.PENDING
    due_date: Optional[datetime] = None
    recurrence_rule: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    def mark_complete(self) -> None:
        """Mark task as completed"""
        self.status = Status.COMPLETED
        self.completed_at = datetime.utcnow()

    def is_overdue(self) -> bool:
        """Check if task is overdue"""
        if self.due_date and self.status != Status.COMPLETED:
            return datetime.utcnow() > self.due_date
        return False

    def __repr__(self) -> str:
        return f"<Task(id={self.id}, title='{self.title}', priority={self.priority}, status={self.status})>"
