"""
Pydantic schemas for API request/response validation.
"""
from src.schemas.user import UserCreate, UserLogin, UserResponse, Token, TokenData
from src.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskWithTags
from src.schemas.tag import TagCreate, TagUpdate, TagResponse
from src.schemas.common import PaginatedResponse, MessageResponse

__all__ = [
    # User schemas
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "Token",
    "TokenData",
    # Task schemas
    "TaskCreate",
    "TaskUpdate",
    "TaskResponse",
    "TaskWithTags",
    # Tag schemas
    "TagCreate",
    "TagUpdate",
    "TagResponse",
    # Common schemas
    "PaginatedResponse",
    "MessageResponse",
]
