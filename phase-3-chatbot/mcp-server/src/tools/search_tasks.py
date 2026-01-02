"""
Search Tasks Tool Handler
Searches tasks by keyword
"""

from typing import Dict, Any
import httpx
import os

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")


async def search_tasks_handler(parameters: Dict[str, Any], user_id: str) -> Dict[str, Any]:
    """
    Search tasks by keyword in title or description

    Args:
        parameters: Search parameters
            - query (required): Search keyword
        user_id: ID of the user

    Returns:
        List of matching tasks
    """

    # Extract and validate parameters
    query = parameters.get("query")
    if not query:
        raise ValueError("Search query is required")

    # Call Phase 2 backend API (using list with filter)
    # Note: Phase 2 might not have search endpoint, so we filter client-side
    async with httpx.AsyncClient() as client:
        try:
            # Get all user tasks
            response = await client.get(
                f"{BACKEND_URL}/api/tasks",
                params={"user_id": user_id},
                headers={
                    # TODO: Add authentication token
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )
            response.raise_for_status()

            all_tasks = response.json()

            # Filter tasks by query (case-insensitive)
            query_lower = query.lower()
            matching_tasks = [
                task for task in all_tasks
                if query_lower in task.get("title", "").lower()
                or query_lower in task.get("description", "").lower()
            ]

            if not matching_tasks:
                return {
                    "message": f"🔍 No tasks found matching '{query}'",
                    "tasks": []
                }

            return {
                "message": f"🔍 Found {len(matching_tasks)} task(s) matching '{query}'",
                "tasks": matching_tasks,
                "query": query
            }

        except httpx.HTTPStatusError as e:
            raise Exception(f"Failed to search tasks: {e.response.text}")
        except httpx.RequestError as e:
            raise Exception(f"Error connecting to backend: {str(e)}")
