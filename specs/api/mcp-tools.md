# MCP Tool Specifications

## Overview
MCP tools expose task management functionality to Claude for natural language interaction.

## Tools

### create_task
```json
{
  "name": "create_task",
  "description": "Create a new task",
  "input_schema": {
    "type": "object",
    "properties": {
      "title": {"type": "string"},
      "description": {"type": "string"},
      "priority": {"type": "string", "enum": ["low", "medium", "high"]},
      "due_date": {"type": "string", "format": "date-time"}
    },
    "required": ["title"]
  }
}
```

### list_tasks
```json
{
  "name": "list_tasks",
  "description": "List tasks with optional filters",
  "input_schema": {
    "type": "object",
    "properties": {
      "status": {"type": "string", "enum": ["pending", "in_progress", "completed"]},
      "priority": {"type": "string", "enum": ["low", "medium", "high"]},
      "limit": {"type": "integer", "default": 10}
    }
  }
}
```

### update_task
```json
{
  "name": "update_task",
  "description": "Update a task",
  "input_schema": {
    "type": "object",
    "properties": {
      "task_id": {"type": "string"},
      "title": {"type": "string"},
      "description": {"type": "string"},
      "priority": {"type": "string"},
      "status": {"type": "string"}
    },
    "required": ["task_id"]
  }
}
```

### delete_task
```json
{
  "name": "delete_task",
  "description": "Delete a task",
  "input_schema": {
    "type": "object",
    "properties": {
      "task_id": {"type": "string"}
    },
    "required": ["task_id"]
  }
}
```

### search_tasks
```json
{
  "name": "search_tasks",
  "description": "Search tasks by keyword",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": {"type": "string"}
    },
    "required": ["query"]
  }
}
```

## Implementation
See `/phase-3-chatbot/mcp-server/src/tools/` for tool implementations

## Testing
- Test each tool independently
- Test with Claude API
- Verify error handling
- Test edge cases (missing params, invalid IDs)
