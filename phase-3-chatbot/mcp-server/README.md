# MCP Server - Task Management Chatbot

Model Context Protocol (MCP) server for AI-powered task management using Claude.

## Features

- 🤖 Natural language task management
- 🔧 5 MCP tools (create, list, update, delete, search)
- 💬 WebSocket-based real-time chat
- 📝 Conversation persistence
- 🔗 Integrates with Phase 2 backend

## Quick Start

### 1. Install Dependencies

```bash
cd phase-3-chatbot/mcp-server
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 3. Run Server

```bash
python src/server.py
```

Server will start on `http://localhost:8001`

## API Endpoints

### HTTP Endpoints

- `GET /` - Health check
- `GET /tools` - List available MCP tools

### WebSocket

- `WS /ws/chat` - Chat interface endpoint

## MCP Tools

### 1. create_task
Create a new task with title, description, and priority.

**Parameters:**
- `title` (required): Task title
- `description` (optional): Task description
- `priority` (optional): low | medium | high
- `due_date` (optional): ISO date string

### 2. list_tasks
List tasks with optional filters.

**Parameters:**
- `status` (optional): pending | in_progress | completed
- `priority` (optional): low | medium | high
- `limit` (optional): Number of tasks to return

### 3. update_task
Update an existing task.

**Parameters:**
- `task_id` (required): Task ID to update
- `title` (optional): New title
- `description` (optional): New description
- `priority` (optional): New priority
- `status` (optional): New status

### 4. delete_task
Delete a task by ID.

**Parameters:**
- `task_id` (required): Task ID to delete

### 5. search_tasks
Search tasks by keyword.

**Parameters:**
- `query` (required): Search keyword

## WebSocket Protocol

### Client → Server Messages

#### Chat Message
```json
{
  "type": "chat",
  "message": "Create a high priority task to review code",
  "conversation_id": "uuid"
}
```

#### Direct Tool Call
```json
{
  "type": "tool_call",
  "tool": "create_task",
  "parameters": {
    "title": "Review code",
    "priority": "high"
  }
}
```

### Server → Client Messages

#### Assistant Response
```json
{
  "type": "message",
  "role": "assistant",
  "content": "I've created a high priority task: Review code",
  "tool_calls": [...],
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### Typing Indicator
```json
{
  "type": "typing",
  "is_typing": true
}
```

#### Tool Result
```json
{
  "type": "tool_result",
  "tool": "create_task",
  "result": {
    "success": true,
    "data": {...}
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Example Conversations

```
User: "Create a high priority task to review the code"
→ Claude calls create_task tool
→ Task created in Phase 2 backend
Assistant: "✅ Created high priority task: Review the code"

User: "What tasks do I have?"
→ Claude calls list_tasks tool
→ Fetches from Phase 2 backend
Assistant: "📋 You have 3 tasks:
1. Review the code (High, Pending)
2. Update docs (Medium, Pending)
3. Fix login bug (High, Completed)"

User: "Mark the docs task as complete"
→ Claude calls update_task tool
→ Updates in Phase 2 backend
Assistant: "✅ Updated status to 'completed'"
```

## Architecture

```
┌─────────────┐         WebSocket        ┌──────────────┐
│   Frontend  │ ◄─────────────────────► │  MCP Server  │
│  (Next.js)  │                          │  (FastAPI)   │
└─────────────┘                          └───────┬──────┘
                                                  │
                                                  │ HTTP
                                                  ▼
                                          ┌──────────────┐
                                          │   Claude API  │
                                          │  (Anthropic) │
                                          └──────────────┘
                                                  │
                                                  │ Tools
                                                  ▼
                                          ┌──────────────┐
                                          │  Phase 2 API │
                                          │  (FastAPI)   │
                                          └───────┬──────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │  PostgreSQL  │
                                          └──────────────┘
```

## Development

### Run Tests
```bash
pytest
```

### Run with Auto-reload
```bash
uvicorn src.server:app --reload --port 8001
```

### View Logs
Logs are written to console with INFO level by default.

## Environment Variables

See `.env.example` for all configuration options.

Required:
- `ANTHROPIC_API_KEY` - Your Claude API key from console.anthropic.com
- `BACKEND_URL` - Phase 2 backend URL (default: http://localhost:8000)

## Troubleshooting

### "Anthropic API key is required"
Set `ANTHROPIC_API_KEY` in `.env` file.

### "Error connecting to backend"
Ensure Phase 2 backend is running on `http://localhost:8000`.

### WebSocket connection fails
Check CORS settings in `server.py` - ensure your frontend origin is allowed.

## Next Steps

- [ ] Add conversation persistence to database
- [ ] Implement authentication/authorization
- [ ] Add more sophisticated natural language understanding
- [ ] Support multi-turn conversations with context
- [ ] Add conversation search and management

## License

Part of Evolution of Todo - Hackathon II Project
