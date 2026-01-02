"""
Conversation Model
Represents a chat conversation session
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
import uuid


class Conversation(BaseModel):
    """Conversation model for chat sessions"""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str = "New Conversation"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    message_count: int = 0

    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "user_id": "user123",
                "title": "Task Management Chat",
                "created_at": "2024-01-01T12:00:00Z",
                "updated_at": "2024-01-01T12:30:00Z",
                "message_count": 10
            }
        }


class ConversationCreate(BaseModel):
    """Schema for creating a new conversation"""

    user_id: str
    title: Optional[str] = "New Conversation"


class ConversationUpdate(BaseModel):
    """Schema for updating a conversation"""

    title: Optional[str] = None


class ConversationResponse(BaseModel):
    """Response model for conversation with messages"""

    id: str
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int
    messages: List[dict] = []  # List of Message objects

    class Config:
        from_attributes = True
