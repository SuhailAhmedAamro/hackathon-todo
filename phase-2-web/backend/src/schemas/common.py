"""
Common Pydantic schemas for API responses.
"""
from pydantic import BaseModel, Field
from typing import Generic, TypeVar, List, Optional


# Generic type for paginated responses
T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """
    Generic paginated response schema.

    Usage:
        PaginatedResponse[TaskResponse]
        PaginatedResponse[TagResponse]
    """
    items: List[T] = Field(description="List of items")
    total: int = Field(description="Total number of items")
    page: int = Field(description="Current page number")
    limit: int = Field(description="Items per page")
    total_pages: int = Field(description="Total number of pages")

    class Config:
        """Pydantic configuration."""
        json_schema_extra = {
            "example": {
                "items": [],
                "total": 100,
                "page": 1,
                "limit": 20,
                "total_pages": 5
            }
        }


class MessageResponse(BaseModel):
    """
    Simple message response schema.
    Used for success/error messages.
    """
    message: str = Field(description="Response message")
    detail: Optional[str] = Field(default=None, description="Additional details")

    class Config:
        """Pydantic configuration."""
        json_schema_extra = {
            "example": {
                "message": "Task deleted successfully",
                "detail": None
            }
        }
