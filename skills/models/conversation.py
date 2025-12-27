"""Base Conversation model - for chatbot phase (Phase 3+)"""

from datetime import datetime
from enum import Enum
from typing import List, Optional


class MessageRole(str, Enum):
    """Message role in conversation"""

    USER = "user"
    ASSISTANT = "assistant"


class ConversationBase:
    """
    Base Conversation model for chatbot functionality.

    Applicable for Phase 3+ only.

    Example usage:
        from skills.models.conversation import ConversationBase, MessageRole

        class Conversation(ConversationBase, Base):
            __tablename__ = "conversations"
            # Add ORM configuration
    """

    id: str
    user_id: str
    title: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    def __repr__(self) -> str:
        return f"<Conversation(id={self.id}, user_id={self.user_id}, title='{self.title}')>"


class MessageBase:
    """
    Base Message model for conversation messages.

    Example usage:
        from skills.models.conversation import MessageBase, MessageRole

        class Message(MessageBase, Base):
            __tablename__ = "messages"
            # Add ORM configuration
    """

    id: str
    conversation_id: str
    role: MessageRole
    content: str
    tool_calls: Optional[dict] = None  # JSON/JSONB field for MCP tool calls
    created_at: datetime

    def __repr__(self) -> str:
        preview = self.content[:50] + "..." if len(self.content) > 50 else self.content
        return f"<Message(id={self.id}, role={self.role}, content='{preview}')>"
