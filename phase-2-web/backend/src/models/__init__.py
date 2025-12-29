"""
SQLModel models for the application.
Import all models here to ensure they're registered with SQLModel.metadata.
"""
from src.models.user import User
from src.models.task import Task
from src.models.tag import Tag, TaskTag

__all__ = ["User", "Task", "Tag", "TaskTag"]
