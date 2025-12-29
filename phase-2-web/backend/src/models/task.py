"""
Task model for todo items.
Follows specification from @specs/database/schema.md and @specs/features/task-crud.md
"""
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from uuid import UUID, uuid4
from enum import Enum
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from src.models.user import User
    from src.models.tag import Tag, TaskTag


class PriorityEnum(str, Enum):
    """Task priority levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class StatusEnum(str, Enum):
    """Task status values."""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class Task(SQLModel, table=True):
    """
    Task model with user association.

    Follows @specs/features/task-crud.md:
    - Title: 1-255 chars, required
    - Description: optional text
    - Priority: low, medium, high
    - Status: pending, in_progress, completed
    - Due date: optional
    - Timestamps: created_at, updated_at, completed_at
    """
    __tablename__ = "tasks"

    # Primary Key
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Foreign Key
    user_id: UUID = Field(foreign_key="users.id", index=True)

    # Task Fields
    title: str = Field(
        min_length=1,
        max_length=255,
        description="Task title"
    )
    description: Optional[str] = Field(
        default=None,
        description="Task description (optional)"
    )

    # Status and Priority
    priority: PriorityEnum = Field(
        default=PriorityEnum.MEDIUM,
        index=True,
        description="Task priority (low, medium, high)"
    )
    status: StatusEnum = Field(
        default=StatusEnum.PENDING,
        index=True,
        description="Task status (pending, in_progress, completed)"
    )

    # Dates
    due_date: Optional[datetime] = Field(
        default=None,
        index=True,
        description="Due date (optional)"
    )

    # Timestamps
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        index=True,
        description="Creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp"
    )
    completed_at: Optional[datetime] = Field(
        default=None,
        description="Completion timestamp"
    )

    # Future: Recurrence rule (iCal format)
    recurrence_rule: Optional[str] = Field(
        default=None,
        description="Recurrence rule in iCal format (for future use)"
    )

    # Relationships
    user: "User" = Relationship(back_populates="tasks")
    task_tags: List["TaskTag"] = Relationship(
        back_populates="task",
        cascade_delete=True
    )

    def mark_completed(self):
        """Mark task as completed with timestamp."""
        self.status = StatusEnum.COMPLETED
        self.completed_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def mark_incomplete(self):
        """Mark task as incomplete (pending)."""
        self.status = StatusEnum.PENDING
        self.completed_at = None
        self.updated_at = datetime.utcnow()

    def update_timestamp(self):
        """Update the updated_at timestamp."""
        self.updated_at = datetime.utcnow()

    class Config:
        """SQLModel configuration."""
        json_schema_extra = {
            "example": {
                "title": "Complete Phase 2 implementation",
                "description": "Implement authentication, database, and all features",
                "priority": "high",
                "status": "in_progress",
                "due_date": "2025-12-14T00:00:00"
            }
        }
