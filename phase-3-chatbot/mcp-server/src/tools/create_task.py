"""
Create Task Tool Handler
Handles task creation requests from the chatbot
"""

from typing import Dict, Any
import httpx
import os
from datetime import datetime

# Phase 2 backend URL
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")


async def create_task_handler(parameters: Dict[str, Any], user_id: str) -> Dict[str, Any]:
    """
    Create a new task via Phase 2 backend API

    Args:
        parameters: Task creation parameters
            - title (required): Task title
            - description (optional): Task description
            - priority (optional): Task priority (low, medium, high)
            - due_date (optional): Due date in ISO format
        user_id: ID of the user creating the task

    Returns:
        Created task object
    """

    # Extract and validate parameters
    title = parameters.get("title")
    if not title:
        raise ValueError("Task title is required")

    description = parameters.get("description", "")
    priority = parameters.get("priority", "medium")
    due_date = parameters.get("due_date")

    # Prepare task data
    task_data = {
        "title": title,
        "description": description,
        "priority": priority,
        "status": "pending",
        "user_id": user_id
    }

    if due_date:
        task_data["due_date"] = due_date

    # Call Phase 2 backend API
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{BACKEND_URL}/api/tasks",
                json=task_data,
                headers={
                    # TODO: Add authentication token
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )
            response.raise_for_status()

            task = response.json()

            return {
                "message": f"✅ Created task: {title}",
                "task": task
            }

        except httpx.HTTPStatusError as e:
            raise Exception(f"Failed to create task: {e.response.text}")
        except httpx.RequestError as e:
            raise Exception(f"Error connecting to backend: {str(e)}")
