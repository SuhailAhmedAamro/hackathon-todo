"""Task model for Phase 1 - SQLite implementation"""

import sys
from pathlib import Path

# Add skills directory to path to import shared models
skills_path = Path(__file__).parent.parent.parent.parent / "skills"
sys.path.insert(0, str(skills_path))

from models.task import TaskBase, Priority, Status
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
import uuid

from ..database import Base


class Task(Base, TaskBase):
    """
    Task model for Phase 1 Console App (SQLite)

    Extends TaskBase from @skills/models/task.py
    Adds SQLAlchemy configuration for SQLite persistence
    """

    __tablename__ = "tasks"

    # SQLAlchemy columns
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    priority = Column(SQLEnum(Priority), default=Priority.MEDIUM, nullable=False)
    status = Column(SQLEnum(Status), default=Status.PENDING, nullable=False)
    due_date = Column(DateTime, nullable=True)
    recurrence_rule = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    completed_at = Column(DateTime, nullable=True)

    def __init__(self, title: str, description: str = None, priority: Priority = Priority.MEDIUM, **kwargs):
        """Initialize a new task"""
        super().__init__()
        self.id = str(uuid.uuid4())
        self.title = title
        self.description = description
        self.priority = priority
        self.status = Status.PENDING
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

        # Handle optional fields from kwargs
        if 'due_date' in kwargs:
            self.due_date = kwargs['due_date']
        if 'recurrence_rule' in kwargs:
            self.recurrence_rule = kwargs['recurrence_rule']

    def to_dict(self) -> dict:
        """Convert task to dictionary for display"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'priority': self.priority.value if self.priority else 'medium',
            'status': self.status.value if self.status else 'pending',
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
        }

    def mark_complete(self) -> None:
        """Mark task as completed (override from TaskBase)"""
        self.status = Status.COMPLETED
        self.completed_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()


# Re-export for convenience
__all__ = ["Task", "Priority", "Status"]
