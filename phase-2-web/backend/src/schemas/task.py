"""
Pydantic schemas for Task CRUD operations.
Follows @specs/features/task-crud.md.
"""
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from src.models.task import PriorityEnum, StatusEnum


class TaskCreate(BaseModel):
    """
    Schema for creating a new task.

    Required: title
    Optional: description, priority, due_date
    Status defaults to 'pending'
    """
    title: str = Field(
        min_length=1,
        max_length=255,
        description="Task title",
        examples=["Complete Phase 2 implementation"]
    )
    description: Optional[str] = Field(
        default=None,
        description="Task description (optional)",
        examples=["Implement auth, database, and all features"]
    )
    priority: PriorityEnum = Field(
        default=PriorityEnum.MEDIUM,
        description="Task priority (low, medium, high)"
    )
    due_date: Optional[datetime] = Field(
        default=None,
        description="Due date (optional, ISO 8601 format)",
        examples=["2025-12-14T00:00:00Z"]
    )


class TaskUpdate(BaseModel):
    """
    Schema for updating a task.
    All fields are optional.
    """
    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=255,
        description="Task title"
    )
    description: Optional[str] = Field(
        default=None,
        description="Task description"
    )
    priority: Optional[PriorityEnum] = Field(
        default=None,
        description="Task priority"
    )
    status: Optional[StatusEnum] = Field(
        default=None,
        description="Task status"
    )
    due_date: Optional[datetime] = Field(
        default=None,
        description="Due date"
    )


class TagInResponse(BaseModel):
    """Minimal tag info for task responses."""
    id: UUID
    name: str
    color: str

    class Config:
        """Pydantic configuration."""
        from_attributes = True


class TaskResponse(BaseModel):
    """
    Schema for task in responses.
    Includes all task fields.
    """
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    priority: PriorityEnum
    status: StatusEnum
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]

    class Config:
        """Pydantic configuration."""
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "user_id": "987e6543-e21b-98d7-a654-426614174111",
                "title": "Complete Phase 2 implementation",
                "description": "Implement auth, database, and all features",
                "priority": "high",
                "status": "in_progress",
                "due_date": "2025-12-14T00:00:00Z",
                "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z",
                "completed_at": None
            }
        }


class TaskWithTags(TaskResponse):
    """
    Task response with tags included.
    Used when tags are loaded.
    """
    tags: List[TagInResponse] = Field(default_factory=list)

    class Config:
        """Pydantic configuration."""
        from_attributes = True
