"""
List Tasks Tool Handler
Retrieves and filters tasks
"""

from typing import Dict, Any, Optional
import httpx
import os

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
BACKEND_AUTH_TOKEN = os.getenv("BACKEND_AUTH_TOKEN", "")


async def list_tasks_handler(parameters: Dict[str, Any], user_id: str) -> Dict[str, Any]:
    """
    List tasks with optional filters

    Args:
        parameters: Filter parameters
            - status (optional): Filter by status (pending, in_progress, completed)
            - priority (optional): Filter by priority (low, medium, high)
            - limit (optional): Maximum number of tasks to return
        user_id: ID of the user

    Returns:
        List of tasks
    """

    # Extract parameters
    status = parameters.get("status")
    priority = parameters.get("priority")
    limit = parameters.get("limit", 10)

    # Build query parameters
    params = {"user_id": user_id}
    if status:
        params["status"] = status
    if priority:
        params["priority"] = priority
    if limit:
        params["limit"] = limit

    # Call Phase 2 backend API
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{BACKEND_URL}/api/tasks",
                params=params,
                headers={
                    "Authorization": f"Bearer {BACKEND_AUTH_TOKEN}",
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )
            response.raise_for_status()

            tasks = response.json()

            # Format response
            if not tasks:
                return {
                    "message": "You have no tasks.",
                    "tasks": []
                }

            # Create summary
            total = len(tasks)
            pending_count = sum(1 for t in tasks if t.get("status") == "pending")
            completed_count = sum(1 for t in tasks if t.get("status") == "completed")

            message = f"📋 You have {total} task(s)"
            if status:
                message += f" with status '{status}'"
            if priority:
                message += f" and priority '{priority}'"

            return {
                "message": message,
                "tasks": tasks,
                "summary": {
                    "total": total,
                    "pending": pending_count,
                    "completed": completed_count
                }
            }

        except httpx.HTTPStatusError as e:
            raise Exception(f"Failed to list tasks: {e.response.text}")
        except httpx.RequestError as e:
            raise Exception(f"Error connecting to backend: {str(e)}")
