"""
Tag models for task categorization.
Follows specification from @specs/database/schema.md
"""
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship
import re

if TYPE_CHECKING:
    from src.models.user import User
    from src.models.task import Task


class Tag(SQLModel, table=True):
    """
    Tag model for task categorization.

    Follows @specs/database/schema.md:
    - Name: max 100 chars, unique per user
    - Color: hex color code (#RRGGBB)
    - User-specific tags
    """
    __tablename__ = "tags"

    # Primary Key
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Foreign Key
    user_id: UUID = Field(foreign_key="users.id", index=True)

    # Tag Fields
    name: str = Field(
        min_length=1,
        max_length=100,
        description="Tag name"
    )
    color: Optional[str] = Field(
        default="#3B82F6",  # Default blue color
        max_length=7,
        regex=r"^#[0-9A-Fa-f]{6}$",
        description="Hex color code (#RRGGBB)"
    )

    # Timestamp
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="tags")
    task_tags: List["TaskTag"] = Relationship(
        back_populates="tag",
        cascade_delete=True
    )

    @classmethod
    def validate_color(cls, color: str) -> bool:
        """Validate hex color format."""
        pattern = r"^#[0-9A-Fa-f]{6}$"
        return bool(re.match(pattern, color))

    class Config:
        """SQLModel configuration."""
        # Unique constraint on (user_id, name)
        # This ensures each user can't have duplicate tag names
        table_args = (
            {"sqlite_autoincrement": True},
        )
        json_schema_extra = {
            "example": {
                "name": "urgent",
                "color": "#EF4444"
            }
        }


class TaskTag(SQLModel, table=True):
    """
    Junction table for Task-Tag many-to-many relationship.
    """
    __tablename__ = "task_tags"

    # Composite Primary Key
    task_id: UUID = Field(foreign_key="tasks.id", primary_key=True)
    tag_id: UUID = Field(foreign_key="tags.id", primary_key=True)

    # Timestamp
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    task: "Task" = Relationship(back_populates="task_tags")
    tag: "Tag" = Relationship(back_populates="task_tags")

    class Config:
        """SQLModel configuration."""
        json_schema_extra = {
            "example": {
                "task_id": "123e4567-e89b-12d3-a456-426614174000",
                "tag_id": "987e6543-e21b-98d7-a654-426614174111"
            }
        }
