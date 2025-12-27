# Skill: MCP Tool Definition - AI Agent Tool Creation

## Purpose
Defines and implements MCP (Model Context Protocol) tools that enable Claude AI to interact with the Evolution of Todo application through natural language. Creates tool schemas, implementations, and integration patterns.

## Capabilities
- Define MCP tool schemas (JSON Schema)
- Implement tool execution logic
- Create tool response formatters
- Handle tool errors gracefully
- Chain multiple tools
- Validate tool inputs
- Document tool usage
- Test tool execution

## Usage

### Command Syntax
```
"Define MCP tool for [operation] using @skills/mcp-tool-skill.md"
"Implement [tool_name] MCP tool using @skills/mcp-tool-skill.md"
"Create tool schema for [feature] using @skills/mcp-tool-skill.md"
```

### Input Format
```yaml
tool_name: create_task
description: "Create a new task"
operation: CREATE | READ | UPDATE | DELETE
entity: Task
required_params:
  - title
optional_params:
  - description
  - priority
  - due_date
```

## MCP Tool Structure

### Complete Tool Definition
```python
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class MCPTool:
    """Base class for MCP tools"""

    def __init__(self, name: str, description: str, input_schema: Dict[str, Any]):
        self.name = name
        self.description = description
        self.input_schema = input_schema

    async def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the tool with given parameters"""
        raise NotImplementedError

    def to_schema(self) -> Dict[str, Any]:
        """Convert tool to MCP schema"""
        return {
            "name": self.name,
            "description": self.description,
            "input_schema": self.input_schema
        }
```

## Standard MCP Tools for Evolution of Todo

### 1. create_task

**Schema:**
```json
{
  "name": "create_task",
  "description": "Create a new task with title, optional description, priority, and due date",
  "input_schema": {
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "description": "Task title (required, 1-255 characters)",
        "minLength": 1,
        "maxLength": 255
      },
      "description": {
        "type": "string",
        "description": "Detailed task description (optional)"
      },
      "priority": {
        "type": "string",
        "enum": ["low", "medium", "high"],
        "description": "Task priority level",
        "default": "medium"
      },
      "due_date": {
        "type": "string",
        "format": "date-time",
        "description": "Due date in ISO 8601 format (optional)"
      },
      "tags": {
        "type": "array",
        "items": {"type": "string"},
        "description": "List of tag names to apply (optional)"
      }
    },
    "required": ["title"]
  }
}
```

**Implementation:**
```python
class CreateTaskTool(MCPTool):
    """MCP Tool: Create a new task"""

    def __init__(self, db_session):
        super().__init__(
            name="create_task",
            description="Create a new task with title, optional description, priority, and due date",
            input_schema={
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "Task title",
                        "minLength": 1,
                        "maxLength": 255
                    },
                    "description": {"type": "string"},
                    "priority": {
                        "type": "string",
                        "enum": ["low", "medium", "high"],
                        "default": "medium"
                    },
                    "due_date": {
                        "type": "string",
                        "format": "date-time"
                    }
                },
                "required": ["title"]
            }
        )
        self.db = db_session

    async def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute task creation"""
        try:
            # Validate input
            title = params["title"].strip()
            if not title:
                return {
                    "success": False,
                    "error": "Title cannot be empty"
                }

            # Create task
            task = Task(
                title=title,
                description=params.get("description"),
                priority=params.get("priority", "medium"),
                due_date=params.get("due_date"),
                status="pending",
                user_id=params["user_id"]  # From context
            )

            self.db.add(task)
            self.db.commit()
            self.db.refresh(task)

            return {
                "success": True,
                "task": {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "priority": task.priority,
                    "status": task.status,
                    "due_date": task.due_date.isoformat() if task.due_date else None,
                    "created_at": task.created_at.isoformat()
                },
                "message": f"Created task: {task.title}"
            }

        except Exception as e:
            self.db.rollback()
            return {
                "success": False,
                "error": f"Failed to create task: {str(e)}"
            }
```

### 2. list_tasks

**Schema:**
```json
{
  "name": "list_tasks",
  "description": "List tasks with optional filtering by status, priority, tags, and search query",
  "input_schema": {
    "type": "object",
    "properties": {
      "status": {
        "type": "string",
        "enum": ["pending", "in_progress", "completed", "all"],
        "description": "Filter by task status",
        "default": "all"
      },
      "priority": {
        "type": "string",
        "enum": ["low", "medium", "high", "all"],
        "description": "Filter by priority",
        "default": "all"
      },
      "tags": {
        "type": "array",
        "items": {"type": "string"},
        "description": "Filter by tag names (AND logic)"
      },
      "search": {
        "type": "string",
        "description": "Search in title and description"
      },
      "limit": {
        "type": "integer",
        "minimum": 1,
        "maximum": 100,
        "default": 10,
        "description": "Maximum number of tasks to return"
      },
      "sort_by": {
        "type": "string",
        "enum": ["created_at", "due_date", "priority", "title"],
        "default": "created_at"
      },
      "sort_order": {
        "type": "string",
        "enum": ["asc", "desc"],
        "default": "desc"
      }
    }
  }
}
```

### 3. update_task

**Schema:**
```json
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
        "description": "New task title"
      },
      "description": {
        "type": "string",
        "description": "New description"
      },
      "priority": {
        "type": "string",
        "enum": ["low", "medium", "high"]
      },
      "status": {
        "type": "string",
        "enum": ["pending", "in_progress", "completed"]
      },
      "due_date": {
        "type": "string",
        "format": "date-time"
      }
    },
    "required": ["task_id"]
  }
}
```

### 4. delete_task

**Schema:**
```json
{
  "name": "delete_task",
  "description": "Delete a task permanently",
  "input_schema": {
    "type": "object",
    "properties": {
      "task_id": {
        "type": "string",
        "description": "ID of the task to delete"
      },
      "confirm": {
        "type": "boolean",
        "description": "Confirmation flag (must be true)",
        "default": false
      }
    },
    "required": ["task_id", "confirm"]
  }
}
```

### 5. search_tasks

**Schema:**
```json
{
  "name": "search_tasks",
  "description": "Search tasks by keyword in title and description",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search query",
        "minLength": 1
      },
      "limit": {
        "type": "integer",
        "default": 10
      }
    },
    "required": ["query"]
  }
}
```

### 6. get_task_stats

**Schema:**
```json
{
  "name": "get_task_stats",
  "description": "Get statistics about user's tasks",
  "input_schema": {
    "type": "object",
    "properties": {
      "period": {
        "type": "string",
        "enum": ["today", "week", "month", "all"],
        "default": "all"
      }
    }
  }
}
```

## MCP Server Implementation

### Server Setup
```python
from fastapi import FastAPI, WebSocket
from typing import List, Dict, Any
import json

app = FastAPI(title="Evolution Todo MCP Server")

# Registry of available tools
TOOLS: Dict[str, MCPTool] = {}

def register_tool(tool: MCPTool):
    """Register an MCP tool"""
    TOOLS[tool.name] = tool

@app.get("/tools")
async def list_tools():
    """List all available MCP tools"""
    return {
        "tools": [tool.to_schema() for tool in TOOLS.values()]
    }

@app.post("/execute/{tool_name}")
async def execute_tool(tool_name: str, params: Dict[str, Any]):
    """Execute a specific tool"""
    if tool_name not in TOOLS:
        return {
            "success": False,
            "error": f"Tool '{tool_name}' not found"
        }

    tool = TOOLS[tool_name]
    result = await tool.execute(params)

    return {
        "tool": tool_name,
        "result": result
    }

@app.websocket("/ws/chat")
async def chat_websocket(websocket: WebSocket):
    """WebSocket endpoint for chat with tool execution"""
    await websocket.accept()

    while True:
        # Receive message from client
        data = await websocket.receive_json()

        # Process with Claude + MCP tools
        response = await process_with_claude(data["message"], data["user_id"])

        # Send response back
        await websocket.send_json(response)
```

### Tool Registration
```python
# Initialize tools
from database import get_db

db = next(get_db())

# Register all tools
register_tool(CreateTaskTool(db))
register_tool(ListTasksTool(db))
register_tool(UpdateTaskTool(db))
register_tool(DeleteTaskTool(db))
register_tool(SearchTasksTool(db))
register_tool(GetTaskStatsTool(db))
```

## Usage Examples

### Example 1: Natural Language to Tool Call

**User Input:**
```
"Create a high priority task to review the pull request by tomorrow"
```

**Claude Processing:**
```json
{
  "tool": "create_task",
  "parameters": {
    "title": "Review pull request",
    "priority": "high",
    "due_date": "2025-01-27T23:59:59Z"
  }
}
```

**Tool Response:**
```json
{
  "success": true,
  "task": {
    "id": "uuid-here",
    "title": "Review pull request",
    "priority": "high",
    "status": "pending",
    "due_date": "2025-01-27T23:59:59Z"
  },
  "message": "Created task: Review pull request"
}
```

**Claude Response to User:**
```
I've created a high priority task "Review pull request" with a due date of tomorrow (January 27, 2025 at 11:59 PM).
```

### Example 2: Multiple Tool Calls

**User Input:**
```
"Show me all my high priority pending tasks"
```

**Tool Call:**
```json
{
  "tool": "list_tasks",
  "parameters": {
    "status": "pending",
    "priority": "high",
    "limit": 20
  }
}
```

### Example 3: Tool Chaining

**User Input:**
```
"Mark all my urgent tasks as in progress"
```

**Tool Sequence:**
1. list_tasks (filter by tag "urgent")
2. update_task (for each result, set status = "in_progress")

## Error Handling

### Input Validation Errors
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "title": ["Title is required"],
    "priority": ["Must be one of: low, medium, high"]
  }
}
```

### Database Errors
```json
{
  "success": false,
  "error": "Database error: Task not found"
}
```

### Permission Errors
```json
{
  "success": false,
  "error": "Permission denied: You can only modify your own tasks"
}
```

## Testing MCP Tools

```python
import pytest

@pytest.mark.asyncio
async def test_create_task_tool():
    """Test create_task tool"""
    tool = CreateTaskTool(db)

    result = await tool.execute({
        "title": "Test task",
        "priority": "high",
        "user_id": "test-user-id"
    })

    assert result["success"] is True
    assert result["task"]["title"] == "Test task"
    assert result["task"]["priority"] == "high"

@pytest.mark.asyncio
async def test_create_task_validation():
    """Test input validation"""
    tool = CreateTaskTool(db)

    result = await tool.execute({
        "title": "",  # Empty title
        "user_id": "test-user-id"
    })

    assert result["success"] is False
    assert "error" in result
```

## Best Practices

### 1. Clear Tool Names
Use verb_noun pattern:
- create_task
- list_tasks
- update_task
- delete_task

### 2. Comprehensive Descriptions
Include:
- What the tool does
- Required parameters
- Optional parameters
- Example use cases

### 3. Input Validation
Always validate:
- Required parameters present
- Data types correct
- Values within allowed ranges
- Enum values valid

### 4. Error Messages
Make errors actionable:
- ❌ "Error"
- ✅ "Title is required and must be 1-255 characters"

### 5. Response Format
Always include:
- success: boolean
- data or error
- Optional message for user

## Dependencies
- FastAPI (MCP server)
- Pydantic (validation)
- SQLAlchemy (database)
- Anthropic SDK (Claude API)
- WebSocket (real-time chat)

## Integration Points
- Used by: Phase 3 (Chatbot)
- Uses: `@specs/api/mcp-tools.md` (specifications)
- Uses: `@specs/features/chatbot.md` (requirements)
- Uses: `@skills/models/task.py` (data models)

## Success Metrics
- Tool execution time < 200ms
- Input validation catches all errors
- 100% tool schema compliance
- Zero unhandled exceptions
- Clear error messages

## Notes for Claude Code
When using this skill:
1. Define schema before implementation
2. Validate all inputs
3. Handle errors gracefully
4. Return consistent response format
5. Test with various inputs
6. Document usage examples
7. Consider tool chaining needs
