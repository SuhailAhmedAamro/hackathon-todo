# Phase 3: Chatbot Interface - Specification

## Overview
Add a conversational AI interface using the Model Context Protocol (MCP), allowing users to manage tasks through natural language.

## Goals
- Implement MCP server with task management tools
- Create chat UI integrated with existing web app
- Enable natural language task operations
- Persist conversation history

## Tech Stack
- **AI**: Claude API (Anthropic)
- **Protocol**: MCP (Model Context Protocol)
- **Backend**: FastAPI (extended from Phase 2)
- **Communication**: WebSocket
- **Frontend**: React chat components

## Features

### Natural Language Interface
- Create tasks via conversation
- List/search tasks conversationally
- Update tasks by description
- Delete tasks via chat
- Ask questions about tasks
- Get task statistics and summaries

### MCP Tools
Expose task management as MCP tools:
- `create_task` - Create a new task
- `list_tasks` - List tasks with filters
- `update_task` - Update task properties
- `delete_task` - Delete a task
- `search_tasks` - Search tasks by keyword
- `get_task_stats` - Get task statistics

### Conversation Management
- Persist conversation history
- Support multiple conversations
- Context-aware responses
- Conversation search

## MCP Server Implementation

### Tool Definitions

```json
{
  "tools": [
    {
      "name": "create_task",
      "description": "Create a new task with title, description, and priority",
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
            "description": "Task priority"
          },
          "due_date": {
            "type": "string",
            "format": "date-time",
            "description": "Due date (optional)"
          }
        },
        "required": ["title"]
      }
    },
    {
      "name": "list_tasks",
      "description": "List tasks with optional filters",
      "input_schema": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "enum": ["pending", "in_progress", "completed"]
          },
          "priority": {
            "type": "string",
            "enum": ["low", "medium", "high"]
          },
          "limit": {
            "type": "integer",
            "default": 10
          }
        }
      }
    },
    {
      "name": "update_task",
      "description": "Update an existing task",
      "input_schema": {
        "type": "object",
        "properties": {
          "task_id": {
            "type": "string",
            "description": "Task ID to update"
          },
          "title": {"type": "string"},
          "description": {"type": "string"},
          "priority": {
            "type": "string",
            "enum": ["low", "medium", "high"]
          },
          "status": {
            "type": "string",
            "enum": ["pending", "in_progress", "completed"]
          }
        },
        "required": ["task_id"]
      }
    },
    {
      "name": "delete_task",
      "description": "Delete a task",
      "input_schema": {
        "type": "object",
        "properties": {
          "task_id": {
            "type": "string",
            "description": "Task ID to delete"
          }
        },
        "required": ["task_id"]
      }
    },
    {
      "name": "search_tasks",
      "description": "Search tasks by keyword",
      "input_schema": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "Search query"
          }
        },
        "required": ["query"]
      }
    }
  ]
}
```

## Chat Interface

### UI Components
- Chat message list
- Message input field
- Task quick actions from chat
- Hybrid UI (chat + traditional views)
- Conversation sidebar

### Example Conversations

```
User: Create a high priority task to review the code
Assistant: I've created a high priority task titled "Review the code" for you.
[Shows task card]

User: What tasks do I have for today?
Assistant: You have 3 tasks pending for today:
1. Review the code (High priority)
2. Update documentation (Medium priority)
3. Fix bug in login (High priority)

User: Mark the documentation task as complete
Assistant: I've marked "Update documentation" as completed.

User: Show me all my high priority tasks
Assistant: Here are your high priority tasks:
1. Review the code (Pending)
2. Fix bug in login (Pending)
```

## Project Structure

```
phase-3-chatbot/
├── mcp-server/
│   ├── src/
│   │   ├── server.py         # MCP server entry point
│   │   ├── tools/
│   │   │   ├── __init__.py
│   │   │   ├── create_task.py
│   │   │   ├── list_tasks.py
│   │   │   ├── update_task.py
│   │   │   ├── delete_task.py
│   │   │   └── search_tasks.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── conversation.py
│   │   │   └── message.py
│   │   └── utils/
│   │       └── claude_client.py
│   ├── requirements.txt
│   └── README.md
├── frontend-extension/
│   └── src/
│       └── components/
│           ├── ChatInterface.tsx
│           ├── MessageList.tsx
│           ├── MessageInput.tsx
│           └── ConversationList.tsx
└── README.md
```

## API Endpoints

### WebSocket
```
WS /ws/chat
```

### HTTP
```
GET  /api/conversations       # List conversations
POST /api/conversations       # Create conversation
GET  /api/conversations/:id   # Get conversation history
DELETE /api/conversations/:id # Delete conversation
```

## Database Schema

```sql
-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,  -- 'user' or 'assistant'
    content TEXT NOT NULL,
    tool_calls JSONB,            -- MCP tool calls
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Implementation Checklist

### MCP Server
- [ ] Set up MCP server with FastAPI
- [ ] Implement tool definitions
- [ ] Implement create_task tool
- [ ] Implement list_tasks tool
- [ ] Implement update_task tool
- [ ] Implement delete_task tool
- [ ] Implement search_tasks tool
- [ ] Add conversation persistence
- [ ] Integrate Claude API
- [ ] Add error handling
- [ ] Write tool tests

### Frontend
- [ ] Create chat interface component
- [ ] Implement WebSocket connection
- [ ] Add message rendering
- [ ] Create message input
- [ ] Add conversation list
- [ ] Implement hybrid UI toggle
- [ ] Add loading states
- [ ] Handle errors gracefully
- [ ] Write component tests

### Integration
- [ ] Test end-to-end chat flows
- [ ] Verify tool execution
- [ ] Test conversation persistence
- [ ] Verify error handling
- [ ] Test WebSocket reconnection

## Success Criteria
- [ ] Natural language task creation works
- [ ] All MCP tools functional
- [ ] Conversations persist correctly
- [ ] Chat UI is responsive and accessible
- [ ] WebSocket handles disconnections
- [ ] Tests pass
- [ ] Documentation complete

## Next Phase
Phase 4 will containerize the application and deploy to Kubernetes.
