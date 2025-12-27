"""Input validation functions"""

import re
from typing import Tuple


def validate_email(email: str) -> Tuple[bool, str]:
    """
    Validate email address format.

    Args:
        email: Email address to validate

    Returns:
        Tuple of (is_valid, error_message)

    Example:
        >>> validate_email("user@example.com")
        (True, "")
        >>> validate_email("invalid-email")
        (False, "Invalid email format")
    """
    if not email:
        return False, "Email is required"

    # Basic email regex pattern
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    if not re.match(pattern, email):
        return False, "Invalid email format"

    if len(email) > 255:
        return False, "Email must be less than 255 characters"

    return True, ""


def validate_username(username: str) -> Tuple[bool, str]:
    """
    Validate username.

    Requirements:
    - 3-50 characters
    - Alphanumeric and underscore only

    Args:
        username: Username to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not username:
        return False, "Username is required"

    if len(username) < 3:
        return False, "Username must be at least 3 characters"

    if len(username) > 50:
        return False, "Username must be less than 50 characters"

    # Only alphanumeric and underscore
    if not re.match(r"^[a-zA-Z0-9_]+$", username):
        return False, "Username can only contain letters, numbers, and underscores"

    return True, ""


def validate_password(password: str) -> Tuple[bool, str]:
    """
    Validate password strength.

    Requirements:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit

    Args:
        password: Password to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not password:
        return False, "Password is required"

    if len(password) < 8:
        return False, "Password must be at least 8 characters"

    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"

    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"

    if not re.search(r"\d", password):
        return False, "Password must contain at least one digit"

    return True, ""


def validate_priority(priority: str) -> Tuple[bool, str]:
    """
    Validate task priority.

    Args:
        priority: Priority level to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    valid_priorities = ["low", "medium", "high"]

    if not priority:
        return False, "Priority is required"

    if priority.lower() not in valid_priorities:
        return False, f"Priority must be one of: {', '.join(valid_priorities)}"

    return True, ""


def validate_status(status: str) -> Tuple[bool, str]:
    """
    Validate task status.

    Args:
        status: Status to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    valid_statuses = ["pending", "in_progress", "completed"]

    if not status:
        return False, "Status is required"

    if status.lower() not in valid_statuses:
        return False, f"Status must be one of: {', '.join(valid_statuses)}"

    return True, ""


def validate_task_title(title: str) -> Tuple[bool, str]:
    """
    Validate task title.

    Requirements:
    - 1-255 characters
    - Not empty/whitespace only

    Args:
        title: Task title to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not title:
        return False, "Title is required"

    if not title.strip():
        return False, "Title cannot be empty or whitespace only"

    if len(title) > 255:
        return False, "Title must be less than 255 characters"

    return True, ""
