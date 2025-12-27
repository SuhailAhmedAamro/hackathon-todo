# Phase 3: Chatbot Interface - Claude Guide

## Overview
Add conversational AI interface using MCP and Claude API.

## Before You Start
1. Read: `@specs/phases/phase-3-chatbot.md`
2. Read: `@specs/features/chatbot.md`
3. Read: `@specs/api/mcp-tools.md`
4. Read: `@specs/ui/chat-interface.md`
5. Get Claude API key from Anthropic

## Implementation Order
1. Set up MCP server
2. Implement MCP tools (create_task, list_tasks, etc.)
3. Integrate Claude API
4. Add conversation persistence
5. Create chat UI components
6. Integrate with Phase 2 web app
7. Write tests

## MCP Tools to Implement
- create_task
- list_tasks
- update_task
- delete_task
- search_tasks
- get_task_stats

## Run Locally
```bash
cd mcp-server
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your_key_here
python src/server.py
```

## Key Additions
- MCP protocol integration
- Claude API integration
- WebSocket for real-time chat
- Conversation persistence
- Hybrid UI (chat + traditional)

## Next Phase
Phase 4 containerizes everything for Kubernetes.
