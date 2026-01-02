"""
Update Task Tool Handler
Updates existing task properties
"""

from typing import Dict, Any
import httpx
import os

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")


async def update_task_handler(parameters: Dict[str, Any], user_id: str) -> Dict[str, Any]:
    """
    Update an existing task

    Args:
        parameters: Update parameters
            - task_id (required): ID of task to update
            - title (optional): New title
            - description (optional): New description
            - priority (optional): New priority
            - status (optional): New status
        user_id: ID of the user

    Returns:
        Updated task object
    """

    # Extract and validate parameters
    task_id = parameters.get("task_id")
    if not task_id:
        raise ValueError("Task ID is required")

    # Build update data (only include provided fields)
    update_data = {}
    if "title" in parameters:
        update_data["title"] = parameters["title"]
    if "description" in parameters:
        update_data["description"] = parameters["description"]
    if "priority" in parameters:
        update_data["priority"] = parameters["priority"]
    if "status" in parameters:
        update_data["status"] = parameters["status"]
    if "due_date" in parameters:
        update_data["due_date"] = parameters["due_date"]

    if not update_data:
        raise ValueError("No update fields provided")

    # Call Phase 2 backend API
    async with httpx.AsyncClient() as client:
        try:
            response = await client.put(
                f"{BACKEND_URL}/api/tasks/{task_id}",
                json=update_data,
                headers={
                    # TODO: Add authentication token
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )
            response.raise_for_status()

            task = response.json()

            # Create descriptive message
            updates = []
            if "title" in update_data:
                updates.append(f"title to '{update_data['title']}'")
            if "status" in update_data:
                updates.append(f"status to '{update_data['status']}'")
            if "priority" in update_data:
                updates.append(f"priority to '{update_data['priority']}'")

            update_msg = ", ".join(updates) if updates else "task"

            return {
                "message": f"✅ Updated {update_msg}",
                "task": task
            }

        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise Exception(f"Task with ID {task_id} not found")
            raise Exception(f"Failed to update task: {e.response.text}")
        except httpx.RequestError as e:
            raise Exception(f"Error connecting to backend: {str(e)}")
