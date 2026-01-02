# 🤖 Phase 3: AI Chatbot Interface

Natural language task management powered by Claude AI and Model Context Protocol (MCP).

## Overview

Phase 3 adds an AI-powered chatbot interface to the todo application, allowing users to manage tasks through natural language conversations. Built using Claude AI and the Model Context Protocol (MCP), it provides an intuitive way to create, update, search, and organize tasks.

## Features

### ✨ Natural Language Task Management
- Create tasks by describing what you need to do
- List tasks with conversational queries
- Update and modify tasks through chat
- Search tasks using keywords
- Get task statistics and summaries

### 🔧 MCP Tools
- **create_task** - Create new tasks with priority and due dates
- **list_tasks** - List and filter tasks by status/priority
- **update_task** - Update task properties
- **delete_task** - Remove tasks
- **search_tasks** - Find tasks by keyword

### 💬 Real-time Chat
- WebSocket-based communication
- Typing indicators
- Message history
- Conversation persistence

## Quick Start

### Prerequisites

- Phase 2 backend running (http://localhost:8000)
- Anthropic API key ([Get one here](https://console.anthropic.com))
- Python 3.11+
- Node.js 18+

### 1. Set Up MCP Server

```bash
# Navigate to MCP server directory
cd phase-3-chatbot/mcp-server

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run server
python src/server.py
```

Server will start on `http://localhost:8001`

### 2. Test WebSocket Connection

```bash
# Health check
curl http://localhost:8001

# List available tools
curl http://localhost:8001/tools
```

## Project Structure

```
phase-3-chatbot/
├── mcp-server/                    # MCP backend server
│   ├── src/
│   │   ├── server.py             # Main server entry point
│   │   ├── tools/                # MCP tool handlers
│   │   ├── models/               # Data models
│   │   └── utils/                # Claude API client
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
└── frontend-extension/            # Chat UI components
    └── src/
        ├── components/
        │   ├── ChatInterface.tsx
        │   ├── MessageList.tsx
        │   ├── MessageInput.tsx
        │   └── ConversationList.tsx
        └── types.ts
```

## Usage Examples

### Creating Tasks

```
User: "Create a high priority task to review the pull request"
AI: "✅ Created high priority task: Review the pull request"
```

### Listing Tasks

```
User: "What tasks do I have?"
AI: "📋 You have 5 tasks:
     1. Review pull request (High, Pending)
     2. Update documentation (Medium, Pending)
     ..."
```

### Updating Tasks

```
User: "Mark the documentation task as completed"
AI: "✅ Updated status to 'completed'"
```

## Configuration

### Environment Variables

```env
# Required
ANTHROPIC_API_KEY=your-api-key-here
BACKEND_URL=http://localhost:8000

# Optional
MCP_SERVER_PORT=8001
LOG_LEVEL=INFO
```

## Development

### Running Tests

```bash
cd mcp-server
pytest
```

### With Auto-reload

```bash
uvicorn src.server:app --reload --port 8001
```

## Documentation

- [MCP Server Documentation](mcp-server/README.md)
- [Phase 3 Specification](../specs/phases/phase-3-chatbot.md)
- [Implementation Guide](CLAUDE.md)

## Tech Stack

- **AI**: Claude API (Anthropic)
- **Protocol**: MCP (Model Context Protocol)
- **Backend**: FastAPI + WebSocket
- **Frontend**: React + TypeScript
- **Database**: PostgreSQL

## Troubleshooting

### WebSocket Connection Fails

Ensure MCP server is running on port 8001 and check CORS settings.

### Claude API Errors

Verify `ANTHROPIC_API_KEY` is set in `.env` file.

### Backend Connection Errors

Ensure Phase 2 backend is running on port 8000.

## Next Steps

1. Get Anthropic API key from https://console.anthropic.com
2. Install dependencies and configure environment
3. Run MCP server
4. Test WebSocket connection
5. Integrate chat UI into Phase 2 frontend

---

**Status:** ✅ Structure Complete | 🔄 Integration Pending

Ready for Phase 4: Kubernetes Deployment! 🚀
