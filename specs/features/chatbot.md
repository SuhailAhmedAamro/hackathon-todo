# Feature: Chatbot Interface

## Overview
Natural language task management using Claude and MCP.

## User Stories
- As a user, I want to create tasks by chatting so that task management feels natural
- As a user, I want to ask about my tasks conversationally
- As a user, I want the chatbot to understand context from previous messages

## Key Features
- Natural language task creation/modification
- Conversational task queries
- Context-aware responses
- Hybrid UI (chat + traditional)
- Conversation history persistence

## MCP Tools
- create_task
- list_tasks
- update_task
- delete_task
- search_tasks
- get_task_stats

## Phase Applicability
- [ ] Phase 1-2
- [x] Phase 3: Chatbot
- [x] Phase 4-5

See `@specs/api/mcp-tools.md` and `@specs/ui/chat-interface.md`
