# Event Schemas (WebSocket)

## Overview
WebSocket event payloads for real-time communication.

## Events

### Client → Server

#### chat_message
```json
{
  "type": "chat_message",
  "conversation_id": "uuid",
  "message": "Create a high priority task to review code"
}
```

### Server → Client

#### message_response
```json
{
  "type": "message_response",
  "conversation_id": "uuid",
  "role": "assistant",
  "content": "I've created a high priority task titled 'Review code'",
  "tool_calls": [
    {
      "name": "create_task",
      "input": {"title": "Review code", "priority": "high"},
      "output": {"id": "task-uuid", "title": "Review code"}
    }
  ]
}
```

#### task_created
```json
{
  "type": "task_created",
  "task": {
    "id": "uuid",
    "title": "Review code",
    "priority": "high"
  }
}
```

#### error
```json
{
  "type": "error",
  "message": "Failed to create task",
  "code": "TASK_CREATE_ERROR"
}
```

## Connection Flow
1. Client connects to `ws://localhost:8000/ws/chat`
2. Client sends authentication message
3. Server confirms connection
4. Client sends chat messages
5. Server responds with assistant messages
6. Server sends real-time updates (task created/updated)

## Phase Applicability
- [x] Phase 3: Chatbot
- [x] Phase 4-5
