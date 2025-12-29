"""
User model for authentication and user management.
Follows specification from @specs/database/schema.md
"""
from datetime import datetime
from typing import Optional, List
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    """
    User model with authentication fields.

    Follows @specs/features/authentication.md:
    - Username: 3-50 chars, alphanumeric + underscore, unique
    - Email: valid format, unique, max 255 chars
    - Password: hashed with bcrypt (cost 12)
    """
    __tablename__ = "users"

    # Primary Key
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Authentication Fields
    username: str = Field(
        min_length=3,
        max_length=50,
        regex=r"^[a-zA-Z0-9_]+$",
        unique=True,
        index=True,
        description="Unique username (alphanumeric + underscore)"
    )
    email: str = Field(
        max_length=255,
        unique=True,
        index=True,
        description="Unique email address"
    )
    password_hash: str = Field(
        max_length=255,
        description="Bcrypt hashed password"
    )

    # Account Status
    is_active: bool = Field(default=True, description="Account active status")

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    tasks: List["Task"] = Relationship(back_populates="user", cascade_delete=True)
    tags: List["Tag"] = Relationship(back_populates="user", cascade_delete=True)

    def update_timestamp(self):
        """Update the updated_at timestamp."""
        self.updated_at = datetime.utcnow()

    class Config:
        """SQLModel configuration."""
        json_schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "john@example.com",
                "is_active": True
            }
        }
