"""Common helper functions used across all phases"""

import uuid
from datetime import datetime
from typing import Optional


def generate_uuid() -> str:
    """Generate a UUID string"""
    return str(uuid.uuid4())


def format_datetime(dt: Optional[datetime], format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    Format datetime object to string.

    Args:
        dt: Datetime object to format
        format_str: Format string (default: ISO-like format)

    Returns:
        Formatted datetime string or empty string if dt is None

    Example:
        >>> from datetime import datetime
        >>> dt = datetime(2025, 1, 26, 14, 30)
        >>> format_datetime(dt)
        '2025-01-26 14:30:00'
    """
    if dt is None:
        return ""
    return dt.strftime(format_str)


def truncate_string(text: str, max_length: int = 50, suffix: str = "...") -> str:
    """
    Truncate a string to specified length.

    Args:
        text: String to truncate
        max_length: Maximum length
        suffix: Suffix to add if truncated

    Returns:
        Truncated string

    Example:
        >>> truncate_string("This is a very long task description", 20)
        'This is a very lo...'
    """
    if len(text) <= max_length:
        return text
    return text[: max_length - len(suffix)] + suffix


def priority_to_int(priority: str) -> int:
    """
    Convert priority string to integer for sorting.

    Args:
        priority: Priority level ('low', 'medium', 'high')

    Returns:
        Integer representation (higher = more important)

    Example:
        >>> priority_to_int('high')
        3
        >>> priority_to_int('low')
        1
    """
    priority_map = {"low": 1, "medium": 2, "high": 3}
    return priority_map.get(priority.lower(), 2)


def calculate_percentage(completed: int, total: int) -> float:
    """
    Calculate completion percentage.

    Args:
        completed: Number of completed items
        total: Total number of items

    Returns:
        Percentage (0-100)

    Example:
        >>> calculate_percentage(7, 10)
        70.0
    """
    if total == 0:
        return 0.0
    return (completed / total) * 100


def get_status_color(status: str) -> str:
    """
    Get color code for task status (for CLI or UI).

    Args:
        status: Task status

    Returns:
        Color name or hex code
    """
    status_colors = {
        "pending": "#FFA500",  # Orange
        "in_progress": "#0000FF",  # Blue
        "completed": "#008000",  # Green
    }
    return status_colors.get(status.lower(), "#808080")  # Gray default


def get_priority_color(priority: str) -> str:
    """
    Get color code for priority level.

    Args:
        priority: Priority level

    Returns:
        Color name or hex code
    """
    priority_colors = {
        "low": "#008000",  # Green
        "medium": "#FFA500",  # Orange
        "high": "#FF0000",  # Red
    }
    return priority_colors.get(priority.lower(), "#808080")  # Gray default
