"""Base User model - reusable across phases with authentication"""

from datetime import datetime
from typing import Optional


class UserBase:
    """
    Base User model with common fields.

    Phase-specific implementations should inherit and add ORM configuration.

    Note: Phase 1 (Console) doesn't use authentication, so User model
    is only applicable for Phase 2+

    Example usage:
        from skills.models.user import UserBase
        from sqlalchemy import Column, String, Boolean

        class User(UserBase, Base):
            __tablename__ = "users"
            id = Column(String, primary_key=True)
            username = Column(String(50), unique=True, nullable=False)
            # ... other columns
    """

    # Core fields
    id: str
    username: str
    email: str
    password_hash: str  # Never store plain text passwords!
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    @property
    def is_authenticated(self) -> bool:
        """Check if user is authenticated"""
        return True  # Assumes valid instance = authenticated

    def __repr__(self) -> str:
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"
