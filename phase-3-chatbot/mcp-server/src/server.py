"""
MCP Server Entry Point
Handles WebSocket connections and routes tool calls to appropriate handlers
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
import json
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import tool handlers
from tools.create_task import create_task_handler
from tools.list_tasks import list_tasks_handler
from tools.update_task import update_task_handler
from tools.delete_task import delete_task_handler
from tools.search_tasks import search_tasks_handler
from utils.claude_client import ClaudeClient

app = FastAPI(
    title="MCP Task Management Server",
    description="Model Context Protocol server for AI-powered task management",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tool registry
TOOLS = {
    "create_task": create_task_handler,
    "list_tasks": list_tasks_handler,
    "update_task": update_task_handler,
    "delete_task": delete_task_handler,
    "search_tasks": search_tasks_handler,
}

# Active WebSocket connections
active_connections: List[WebSocket] = []


class ConnectionManager:
    """Manages WebSocket connections"""

    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        logger.info(f"User {user_id} connected")

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            logger.info(f"User {user_id} disconnected")

    async def send_message(self, user_id: str, message: dict):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)


manager = ConnectionManager()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "MCP Task Management Server",
        "version": "1.0.0",
        "phase": "Phase 3 - Chatbot Interface"
    }


@app.get("/tools")
async def list_tools():
    """List available MCP tools"""
    return {
        "tools": [
            {
                "name": "create_task",
                "description": "Create a new task with title, description, and priority",
                "parameters": ["title", "description", "priority", "due_date"]
            },
            {
                "name": "list_tasks",
                "description": "List tasks with optional filters",
                "parameters": ["status", "priority", "limit"]
            },
            {
                "name": "update_task",
                "description": "Update an existing task",
                "parameters": ["task_id", "title", "description", "priority", "status"]
            },
            {
                "name": "delete_task",
                "description": "Delete a task by ID",
                "parameters": ["task_id"]
            },
            {
                "name": "search_tasks",
                "description": "Search tasks by keyword",
                "parameters": ["query"]
            }
        ]
    }


@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    """
    WebSocket endpoint for chat interface
    Handles bidirectional communication between client and MCP server
    """
    # TODO: Get user_id from authentication
    user_id = "demo_user"  # Placeholder for demo

    await manager.connect(websocket, user_id)

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            logger.info(f"Received message from {user_id}: {data}")

            message_type = data.get("type")

            if message_type == "chat":
                # Process chat message with Claude AI
                user_message = data.get("message")
                conversation_id = data.get("conversation_id")

                # Send typing indicator
                await manager.send_message(user_id, {
                    "type": "typing",
                    "is_typing": True
                })

                # Process with Claude AI (will implement)
                response = await process_chat_message(
                    user_message=user_message,
                    user_id=user_id,
                    conversation_id=conversation_id
                )

                # Send response
                await manager.send_message(user_id, {
                    "type": "message",
                    "role": "assistant",
                    "content": response["content"],
                    "tool_calls": response.get("tool_calls", []),
                    "timestamp": datetime.utcnow().isoformat()
                })

            elif message_type == "tool_call":
                # Execute tool directly
                tool_name = data.get("tool")
                tool_params = data.get("parameters", {})

                result = await execute_tool(tool_name, tool_params, user_id)

                await manager.send_message(user_id, {
                    "type": "tool_result",
                    "tool": tool_name,
                    "result": result,
                    "timestamp": datetime.utcnow().isoformat()
                })

    except WebSocketDisconnect:
        manager.disconnect(user_id)
        logger.info(f"User {user_id} disconnected")
    except Exception as e:
        logger.error(f"Error in WebSocket connection: {e}")
        manager.disconnect(user_id)


async def process_chat_message(
    user_message: str,
    user_id: str,
    conversation_id: str = None
) -> Dict[str, Any]:
    """
    Process chat message with Claude AI
    Returns assistant response with potential tool calls
    """
    # TODO: Implement Claude AI integration
    # For now, return a placeholder response

    # Placeholder: Simple keyword detection
    if "create" in user_message.lower() and "task" in user_message.lower():
        return {
            "content": "I'll help you create a task. What would you like to call it?",
            "tool_calls": []
        }
    elif "list" in user_message.lower() or "show" in user_message.lower():
        return {
            "content": "Let me fetch your tasks...",
            "tool_calls": [{"tool": "list_tasks", "parameters": {}}]
        }
    else:
        return {
            "content": f"I received your message: '{user_message}'. I'm ready to help with task management!",
            "tool_calls": []
        }


async def execute_tool(
    tool_name: str,
    parameters: Dict[str, Any],
    user_id: str
) -> Dict[str, Any]:
    """Execute MCP tool and return result"""

    if tool_name not in TOOLS:
        return {
            "success": False,
            "error": f"Unknown tool: {tool_name}"
        }

    try:
        handler = TOOLS[tool_name]
        result = await handler(parameters, user_id)
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        logger.error(f"Error executing tool {tool_name}: {e}")
        return {
            "success": False,
            "error": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
