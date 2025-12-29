"""
Pydantic schemas for Tag operations.
"""
from pydantic import BaseModel, Field, field_validator
from uuid import UUID
from datetime import datetime
from typing import Optional
import re


class TagCreate(BaseModel):
    """
    Schema for creating a new tag.

    Required: name
    Optional: color (defaults to blue #3B82F6)
    """
    name: str = Field(
        min_length=1,
        max_length=100,
        description="Tag name",
        examples=["urgent", "personal", "work"]
    )
    color: str = Field(
        default="#3B82F6",
        max_length=7,
        description="Hex color code (#RRGGBB)",
        examples=["#EF4444", "#10B981", "#F59E0B"]
    )

    @field_validator("color")
    @classmethod
    def validate_color(cls, v: str) -> str:
        """Validate hex color format."""
        if not re.match(r"^#[0-9A-Fa-f]{6}$", v):
            raise ValueError("Color must be a valid hex code (#RRGGBB)")
        return v.upper()  # Normalize to uppercase


class TagUpdate(BaseModel):
    """
    Schema for updating a tag.
    All fields are optional.
    """
    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100,
        description="Tag name"
    )
    color: Optional[str] = Field(
        default=None,
        max_length=7,
        description="Hex color code"
    )

    @field_validator("color")
    @classmethod
    def validate_color(cls, v: Optional[str]) -> Optional[str]:
        """Validate hex color format."""
        if v is not None and not re.match(r"^#[0-9A-Fa-f]{6}$", v):
            raise ValueError("Color must be a valid hex code (#RRGGBB)")
        return v.upper() if v else v


class TagResponse(BaseModel):
    """
    Schema for tag in responses.
    """
    id: UUID
    user_id: UUID
    name: str
    color: str
    created_at: datetime

    class Config:
        """Pydantic configuration."""
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "user_id": "987e6543-e21b-98d7-a654-426614174111",
                "name": "urgent",
                "color": "#EF4444",
                "created_at": "2025-01-01T00:00:00Z"
            }
        }


class AssignTagRequest(BaseModel):
    """
    Schema for assigning a tag to a task.
    """
    tag_id: UUID = Field(description="Tag ID to assign")

    class Config:
        """Pydantic configuration."""
        json_schema_extra = {
            "example": {
                "tag_id": "123e4567-e89b-12d3-a456-426614174000"
            }
        }
