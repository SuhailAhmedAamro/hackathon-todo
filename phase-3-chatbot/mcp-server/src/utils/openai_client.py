"""
OpenAI Client
Handles communication with OpenAI's GPT API
"""

import os
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI
import logging
import json

logger = logging.getLogger(__name__)


class OpenAIClient:
    """Client for interacting with OpenAI API"""

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize OpenAI client

        Args:
            api_key: OpenAI API key (defaults to OPENAI_API_KEY env var)
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError(
                "OpenAI API key is required. "
                "Set OPENAI_API_KEY environment variable or pass api_key parameter."
            )

        self.client = AsyncOpenAI(api_key=self.api_key)
        self.model = "gpt-3.5-turbo"  # GPT-3.5 Turbo - widely accessible

    async def chat(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict]] = None,
        max_tokens: int = 1024
    ) -> Dict[str, Any]:
        """
        Send chat message to OpenAI and get response

        Args:
            messages: List of message dicts with 'role' and 'content'
            system_prompt: Optional system prompt
            tools: Optional list of tool definitions (Claude format, will be converted)
            max_tokens: Maximum tokens in response

        Returns:
            Dict with response content and potential tool calls
        """

        try:
            # Prepare messages - add system prompt if provided
            openai_messages = []
            if system_prompt:
                openai_messages.append({
                    "role": "system",
                    "content": system_prompt
                })
            openai_messages.extend(messages)

            # Build request parameters
            request_params = {
                "model": self.model,
                "max_tokens": max_tokens,
                "messages": openai_messages
            }

            # Convert Claude tool format to OpenAI function format
            if tools:
                openai_tools = self._convert_tools_to_openai_format(tools)
                request_params["tools"] = openai_tools
                request_params["tool_choice"] = "auto"

            # Call OpenAI API
            response = await self.client.chat.completions.create(**request_params)

            # Parse response
            result = {
                "content": "",
                "tool_calls": [],
                "stop_reason": response.choices[0].finish_reason
            }

            # Extract content
            message = response.choices[0].message
            if message.content:
                result["content"] = message.content

            # Extract tool calls
            if message.tool_calls:
                for tool_call in message.tool_calls:
                    result["tool_calls"].append({
                        "id": tool_call.id,
                        "name": tool_call.function.name,
                        "input": json.loads(tool_call.function.arguments)
                    })

            logger.info(f"OpenAI response: {result['content'][:100] if result['content'] else 'Tool calls only'}...")

            return result

        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise Exception(f"Failed to get response from OpenAI: {str(e)}")

    def _convert_tools_to_openai_format(self, claude_tools: List[Dict]) -> List[Dict]:
        """
        Convert Claude tool definitions to OpenAI function format

        Args:
            claude_tools: List of Claude tool definitions

        Returns:
            List of OpenAI tool definitions
        """
        openai_tools = []
        for tool in claude_tools:
            openai_tools.append({
                "type": "function",
                "function": {
                    "name": tool["name"],
                    "description": tool["description"],
                    "parameters": tool["input_schema"]
                }
            })
        return openai_tools

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
        Get MCP tool definitions for OpenAI

        Returns:
            List of tool definition dicts (Claude format, will be converted)
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
