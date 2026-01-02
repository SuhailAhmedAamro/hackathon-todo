"""
Claude AI Client
Handles communication with Anthropic's Claude API
"""

import os
from typing import List, Dict, Any, Optional
import anthropic
import logging

logger = logging.getLogger(__name__)


class ClaudeClient:
    """Client for interacting with Claude AI API"""

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Claude client

        Args:
            api_key: Anthropic API key (defaults to ANTHROPIC_API_KEY env var)
        """
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError(
                "Anthropic API key is required. "
                "Set ANTHROPIC_API_KEY environment variable or pass api_key parameter."
            )

        self.client = anthropic.Anthropic(api_key=self.api_key)
        self.model = "claude-3-5-sonnet-20241022"  # Latest Claude model

    async def chat(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict]] = None,
        max_tokens: int = 1024
    ) -> Dict[str, Any]:
        """
        Send chat message to Claude and get response

        Args:
            messages: List of message dicts with 'role' and 'content'
            system_prompt: Optional system prompt
            tools: Optional list of tool definitions
            max_tokens: Maximum tokens in response

        Returns:
            Dict with response content and potential tool calls
        """

        try:
            # Build request parameters
            request_params = {
                "model": self.model,
                "max_tokens": max_tokens,
                "messages": messages
            }

            if system_prompt:
                request_params["system"] = system_prompt

            if tools:
                request_params["tools"] = tools

            # Call Claude API
            response = self.client.messages.create(**request_params)

            # Parse response
            result = {
                "content": "",
                "tool_calls": [],
                "stop_reason": response.stop_reason
            }

            # Extract content and tool calls
            for block in response.content:
                if block.type == "text":
                    result["content"] += block.text
                elif block.type == "tool_use":
                    result["tool_calls"].append({
                        "id": block.id,
                        "name": block.name,
                        "input": block.input
                    })

            logger.info(f"Claude response: {result['content'][:100]}...")

            return result

        except anthropic.APIError as e:
            logger.error(f"Claude API error: {e}")
            raise Exception(f"Failed to get response from Claude: {str(e)}")

    def get_system_prompt(self) -> str:
        """
        Get system prompt for task management chatbot

        Returns:
            System prompt string
        """
        return """You are a helpful AI assistant for managing tasks and todos.

Your capabilities:
- Create tasks with title, description, priority (low/medium/high), and optional due date
- List and filter tasks by status or priority
- Update existing tasks
- Delete tasks
- Search tasks by keyword
- Provide task statistics and summaries

Guidelines:
- Be concise and friendly
- Always confirm actions before executing them
- Use the available tools to interact with the task management system
- Format task information clearly with emojis
- If the user's intent is unclear, ask clarifying questions
- Provide helpful suggestions when appropriate

Available tools:
- create_task: Create a new task
- list_tasks: List tasks with optional filters
- update_task: Update an existing task
- delete_task: Delete a task
- search_tasks: Search tasks by keyword

Always use these tools to perform actions on tasks instead of just describing what to do."""

    def get_tool_definitions(self) -> List[Dict]:
        """
        Get MCP tool definitions for Claude

        Returns:
            List of tool definition dicts
        """
        return [
            {
                "name": "create_task",
                "description": "Create a new task with title, description, priority, and optional due date",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "Task title"
                        },
                        "description": {
                            "type": "string",
                            "description": "Task description (optional)"
                        },
                        "priority": {
                            "type": "string",
                            "enum": ["low", "medium", "high"],
                            "description": "Task priority (default: medium)"
                        },
                        "due_date": {
                            "type": "string",
                            "description": "Due date in ISO format (optional)"
                        }
                    },
                    "required": ["title"]
                }
            },
            {
                "name": "list_tasks",
                "description": "List tasks with optional filters for status and priority",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "status": {
                            "type": "string",
                            "enum": ["pending", "in_progress", "completed"],
                            "description": "Filter by status (optional)"
                        },
                        "priority": {
                            "type": "string",
                            "enum": ["low", "medium", "high"],
                            "description": "Filter by priority (optional)"
                        },
                        "limit": {
                            "type": "integer",
                            "description": "Maximum number of tasks to return (default: 10)"
                        }
                    }
                }
            },
            {
                "name": "update_task",
                "description": "Update an existing task's properties",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "task_id": {
                            "type": "string",
                            "description": "ID of the task to update"
                        },
                        "title": {
                            "type": "string",
                            "description": "New title (optional)"
                        },
                        "description": {
                            "type": "string",
                            "description": "New description (optional)"
                        },
                        "priority": {
                            "type": "string",
                            "enum": ["low", "medium", "high"],
                            "description": "New priority (optional)"
                        },
                        "status": {
                            "type": "string",
                            "enum": ["pending", "in_progress", "completed"],
                            "description": "New status (optional)"
                        }
                    },
                    "required": ["task_id"]
                }
            },
            {
                "name": "delete_task",
                "description": "Delete a task by its ID",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "task_id": {
                            "type": "string",
                            "description": "ID of the task to delete"
                        }
                    },
                    "required": ["task_id"]
                }
            },
            {
                "name": "search_tasks",
                "description": "Search tasks by keyword in title or description",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "Search query keyword"
                        }
                    },
                    "required": ["query"]
                }
            }
        ]
