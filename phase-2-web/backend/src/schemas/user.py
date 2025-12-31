"""
Pydantic schemas for User authentication.
Follows @specs/features/authentication.md validation rules.
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from uuid import UUID
from datetime import datetime
from typing import Optional
import re


class UserCreate(BaseModel):
    """
    Schema for user registration.

    Validation rules from @specs/features/authentication.md:
    - Username: 3-50 chars, alphanumeric + underscore
    - Email: valid format, max 255 chars
    - Password: min 8 chars, must have uppercase, lowercase, number
    """
    username: str = Field(
        min_length=3,
        max_length=50,
        description="Unique username (alphanumeric + underscore)",
        examples=["johndoe"]
    )
    email: EmailStr = Field(
        max_length=255,
        description="Valid email address",
        examples=["john@example.com"]
    )
    password: str = Field(
        min_length=8,
        description="Password (min 8 chars, upper, lower, number)",
        examples=["SecurePass123"]
    )

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        """Validate username format (alphanumeric + underscore)."""
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("Username must contain only letters, numbers, and underscores")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength."""
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        return v


class UserLogin(BaseModel):
    """
    Schema for user login.
    Accepts username OR email.
    """
    username_or_email: str = Field(
        description="Username or email address",
        examples=["johndoe", "john@example.com"]
    )
    password: str = Field(
        description="User password",
        examples=["SecurePass123"]
    )


class UserResponse(BaseModel):
    """
    Schema for user data in responses.
    Excludes password_hash for security.
    """
    id: UUID
    username: str
    email: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        """Pydantic configuration."""
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "username": "johndoe",
                "email": "john@example.com",
                "is_active": True,
                "created_at": "2025-01-01T00:00:00",
                "updated_at": "2025-01-01T00:00:00"
            }
        }


class Token(BaseModel):
    """
    Schema for JWT token response.

    Token expiration:
    - access_token: 30 minutes
    - refresh_token: 7 days
    """
    access_token: str = Field(description="JWT access token (30min)")
    refresh_token: str = Field(description="JWT refresh token (7 days)")
    token_type: str = Field(default="bearer", description="Token type")
    user: UserResponse = Field(description="User information")

    class Config:
        """Pydantic configuration."""
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": UserResponse.Config.json_schema_extra["example"]
            }
        }


class TokenData(BaseModel):
    """
    Schema for JWT token payload data.
    Used internally for token validation.
    """
    user_id: UUID
    username: str
    exp: Optional[datetime] = None

    class Config:
        """Pydantic configuration."""
        from_attributes = True


class ChangePassword(BaseModel):
    """
    Schema for password change request.
    User must provide current password for verification.
    """
    current_password: str = Field(
        description="Current password for verification",
        examples=["OldPass123"]
    )
    new_password: str = Field(
        min_length=8,
        description="New password (min 8 chars, upper, lower, number)",
        examples=["NewSecurePass456"]
    )
    confirm_password: str = Field(
        description="Confirm new password",
        examples=["NewSecurePass456"]
    )

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        """Validate new password strength."""
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        return v

    def validate_passwords_match(self) -> bool:
        """Validate that new password and confirm password match."""
        return self.new_password == self.confirm_password
