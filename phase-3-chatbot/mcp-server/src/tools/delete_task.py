"""
Delete Task Tool Handler
Deletes a task by ID
"""

from typing import Dict, Any
import httpx
import os

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")


async def delete_task_handler(parameters: Dict[str, Any], user_id: str) -> Dict[str, Any]:
    """
    Delete a task by ID

    Args:
        parameters: Delete parameters
            - task_id (required): ID of task to delete
        user_id: ID of the user

    Returns:
        Deletion confirmation
    """

    # Extract and validate parameters
    task_id = parameters.get("task_id")
    if not task_id:
        raise ValueError("Task ID is required")

    # Call Phase 2 backend API
    async with httpx.AsyncClient() as client:
        try:
            response = await client.delete(
                f"{BACKEND_URL}/api/tasks/{task_id}",
                headers={
                    # TODO: Add authentication token
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )
            response.raise_for_status()

            return {
                "message": f"🗑️ Task deleted successfully",
                "task_id": task_id
            }

        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise Exception(f"Task with ID {task_id} not found")
            raise Exception(f"Failed to delete task: {e.response.text}")
        except httpx.RequestError as e:
            raise Exception(f"Error connecting to backend: {str(e)}")
