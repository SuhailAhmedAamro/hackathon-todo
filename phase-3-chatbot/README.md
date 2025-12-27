# Phase 3: Chatbot Interface

MCP-enabled chatbot for natural language task management.

## Setup
```bash
cd mcp-server
pip install -r requirements.txt
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
python src/server.py
```

## Environment Variables
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxx
DATABASE_URL=postgresql://user:pass@localhost/tododb
MCP_SERVER_PORT=3000
```

## Usage
Connect via WebSocket or use the chat interface at http://localhost:3000

## Example Conversations
```
You: Create a high priority task to review code
Bot: I've created a high priority task "Review code"

You: What tasks do I have?
Bot: You have 5 pending tasks...

You: Mark the review task as done
Bot: Marked "Review code" as completed
```

## Tech Stack
- Claude API (Anthropic)
- MCP (Model Context Protocol)
- FastAPI + WebSocket
- PostgreSQL

## Specs
See `@specs/phases/phase-3-chatbot.md`
