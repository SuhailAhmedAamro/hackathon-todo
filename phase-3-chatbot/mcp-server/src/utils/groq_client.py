"""
Groq AI Client - FREE API
Handles communication with Groq's fast inference API
Get your free API key at: https://console.groq.com
"""

import os
from typing import List, Dict, Any, Optional
import httpx
import json
import logging

logger = logging.getLogger(__name__)

# Groq API endpoint
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


class GroqClient:
    """Client for interacting with Groq AI API (FREE!)"""

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Groq client

        Args:
            api_key: Groq API key (defaults to GROQ_API_KEY env var)

        Get your FREE API key at: https://console.groq.com
        """
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError(
                "Groq API key is required. "
                "Get your FREE key at: https://console.groq.com\n"
                "Set GROQ_API_KEY environment variable or pass api_key parameter."
            )

        # Available models (all free!)
        self.models = {
            "llama": "llama-3.3-70b-versatile",      # Best quality
            "mixtral": "mixtral-8x7b-32768",          # Good for long context
            "gemma": "gemma2-9b-it",                  # Fast and efficient
            "llama-small": "llama-3.1-8b-instant",    # Fastest
        }
        self.model = self.models["llama"]  # Default to best model

    async def chat(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict]] = None,
        max_tokens: int = 2048,
        model: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send chat message to Groq and get response

        Args:
            messages: List of message dicts with 'role' and 'content'
            system_prompt: Optional system prompt
            tools: Optional list of tool definitions (OpenAI format)
            max_tokens: Maximum tokens in response
            model: Optional model override

        Returns:
            Dict with response content and potential tool calls
        """

        try:
            # Build messages with system prompt
            full_messages = []
            if system_prompt:
                full_messages.append({
                    "role": "system",
                    "content": system_prompt
                })
            full_messages.extend(messages)

            # Build request
            request_body = {
                "model": model or self.model,
                "messages": full_messages,
                "max_tokens": max_tokens,
                "temperature": 0.7,
            }

            # Add tools if provided (Groq supports OpenAI-compatible function calling)
            if tools:
                request_body["tools"] = self._convert_tools_to_openai_format(tools)
                request_body["tool_choice"] = "auto"

            # Call Groq API
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    GROQ_API_URL,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json=request_body,
                    timeout=60.0
                )

                if response.status_code != 200:
                    error_detail = response.text
                    logger.error(f"Groq API error: {response.status_code} - {error_detail}")
                    raise Exception(f"Groq API error: {response.status_code}")

                data = response.json()

            # Parse response
            choice = data["choices"][0]
            message = choice["message"]

            result = {
                "content": message.get("content", ""),
                "tool_calls": [],
                "stop_reason": choice.get("finish_reason", "stop"),
                "model": data.get("model", self.model),
                "usage": data.get("usage", {})
            }

            # Extract tool calls if any
            if message.get("tool_calls"):
                for tool_call in message["tool_calls"]:
                    result["tool_calls"].append({
                        "id": tool_call["id"],
                        "name": tool_call["function"]["name"],
                        "input": json.loads(tool_call["function"]["arguments"])
                    })

            logger.info(f"Groq response ({result['model']}): {result['content'][:100]}...")

            return result

        except httpx.TimeoutException:
            logger.error("Groq API timeout")
            raise Exception("Groq API request timed out")
        except Exception as e:
            logger.error(f"Groq API error: {e}")
            raise Exception(f"Failed to get response from Groq: {str(e)}")

    def _convert_tools_to_openai_format(self, tools: List[Dict]) -> List[Dict]:
        """Convert Claude-style tools to OpenAI format for Groq"""
        openai_tools = []
        for tool in tools:
            openai_tools.append({
                "type": "function",
                "function": {
                    "name": tool["name"],
                    "description": tool["description"],
                    "parameters": tool.get("input_schema", {})
                }
            })
        return openai_tools

    def get_system_prompt(self) -> str:
        """
        Get system prompt for task management chatbot

        Returns:
            System prompt string
        """
        return """You are a helpful AI assistant for managing tasks and todos. You speak both English and Urdu/Hindi.

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
- Format task information clearly
- If the user's intent is unclear, ask clarifying questions
- Provide helpful suggestions when appropriate
- You can respond in English, Urdu, or Hindi based on user's language

Available tools:
- create_task: Create a new task
- list_tasks: List tasks with optional filters
- update_task: Update an existing task
- delete_task: Delete a task
- search_tasks: Search tasks by keyword

Always use these tools to perform actions on tasks instead of just describing what to do.

When a user asks to create a task, use the create_task tool.
When a user asks to see/show tasks, use the list_tasks tool.
When a user asks to update/edit a task, use the update_task tool.
When a user asks to delete/remove a task, use the delete_task tool.
When a user searches for tasks, use the search_tasks tool."""

    def get_tool_definitions(self) -> List[Dict]:
        """
        Get MCP tool definitions

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
                            "description": "Due date in ISO format YYYY-MM-DD (optional)"
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
