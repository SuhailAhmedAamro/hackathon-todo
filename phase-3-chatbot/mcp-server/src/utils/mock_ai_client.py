"""
Mock AI Client - Fallback when API keys have no credits
Uses simple keyword matching to simulate AI responses
"""

import logging
from typing import List, Dict, Any, Optional
import re

logger = logging.getLogger(__name__)


class MockAIClient:
    """Mock AI client for testing without API credits"""

    def __init__(self):
        """Initialize mock client"""
        logger.info("Using Mock AI Client (no API credits required)")
        self.model = "mock-ai"

    async def chat(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict]] = None,
        max_tokens: int = 1024
    ) -> Dict[str, Any]:
        """
        Mock chat that uses keyword matching

        Args:
            messages: List of message dicts with 'role' and 'content'
            system_prompt: Optional system prompt (ignored)
            tools: Optional list of tool definitions (ignored)
            max_tokens: Maximum tokens in response (ignored)

        Returns:
            Dict with response content and potential tool calls
        """
        try:
            # Get user message
            user_message = messages[-1]["content"].lower()

            result = {
                "content": "",
                "tool_calls": [],
                "stop_reason": "end_turn"
            }

            # Keyword-based tool detection
            if any(word in user_message for word in ["create", "add", "new"]) and "task" in user_message:
                # Extract task details from message
                title = self._extract_task_title(user_message)
                priority = self._extract_priority(user_message)

                result["tool_calls"].append({
                    "id": "mock_1",
                    "name": "create_task",
                    "input": {
                        "title": title,
                        "description": f"Task created via chatbot",
                        "priority": priority
                    }
                })
                result["content"] = f"I'll create a task: '{title}' with {priority} priority."

            elif any(word in user_message for word in ["list", "show", "display", "get"]) and "task" in user_message:
                result["tool_calls"].append({
                    "id": "mock_2",
                    "name": "list_tasks",
                    "input": {
                        "limit": 10
                    }
                })
                result["content"] = "Let me show you your tasks."

            elif any(word in user_message for word in ["update", "edit", "change", "modify"]) and "task" in user_message:
                result["content"] = "To update a task, please provide the task ID and what you'd like to change."

            elif any(word in user_message for word in ["delete", "remove"]) and "task" in user_message:
                result["content"] = "To delete a task, please provide the task ID."

            elif any(word in user_message for word in ["search", "find"]) and "task" in user_message:
                query = self._extract_search_query(user_message)
                result["tool_calls"].append({
                    "id": "mock_3",
                    "name": "search_tasks",
                    "input": {
                        "query": query
                    }
                })
                result["content"] = f"Searching for tasks matching '{query}'..."

            else:
                # Default response
                result["content"] = "I can help you manage your tasks! Try saying:\n- 'Create a task to...'\n- 'Show my tasks'\n- 'Search for...'"

            logger.info(f"Mock AI response: {result['content'][:50]}...")
            return result

        except Exception as e:
            logger.error(f"Mock AI error: {e}")
            return {
                "content": "I'm here to help with your tasks!",
                "tool_calls": [],
                "stop_reason": "end_turn"
            }

    def _extract_task_title(self, message: str) -> str:
        """Extract task title from message"""
        # Remove common trigger words
        message = re.sub(r'\b(create|add|new|a|an|task|to)\b', '', message, flags=re.IGNORECASE)
        message = message.strip()

        # Capitalize first letter
        if message:
            return message[0].upper() + message[1:]
        return "New Task"

    def _extract_priority(self, message: str) -> str:
        """Extract priority from message"""
        if any(word in message for word in ["high", "urgent", "important", "asap"]):
            return "high"
        elif any(word in message for word in ["low", "minor", "later"]):
            return "low"
        return "medium"

    def _extract_search_query(self, message: str) -> str:
        """Extract search query from message"""
        # Remove common words
        message = re.sub(r'\b(search|find|for|tasks?)\b', '', message, flags=re.IGNORECASE)
        return message.strip() or "task"

    def get_system_prompt(self) -> str:
        """Get system prompt (for compatibility)"""
        return "Mock AI for task management"

    def get_tool_definitions(self) -> List[Dict]:
        """Get tool definitions (for compatibility)"""
        return []
