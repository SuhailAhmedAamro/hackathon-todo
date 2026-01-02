# MCP Agent Skill - Reusable Intelligence

**BONUS POINTS: +200 for Reusable Intelligence**

## Overview
Reusable patterns and intelligence for building MCP (Model Context Protocol) chatbot agents across different phases and projects.

## What is MCP?
Model Context Protocol enables AI models to interact with external tools and data sources through a standardized protocol.

## Core Patterns

### 1. MCP Server Setup
```python
from fastapi import FastAPI, WebSocket
from anthropic import Anthropic

app = FastAPI()
client = Anthropic(api_key="your-key")

@app.websocket("/ws/chat")
async def chat(websocket: WebSocket):
    await websocket.accept()
    # Handle chat logic
```

### 2. Tool Definition Pattern
```python
TOOLS = [
    {
        "name": "tool_name",
        "description": "What the tool does",
        "input_schema": {
            "type": "object",
            "properties": {
                "param": {"type": "string", "description": "Parameter description"}
            },
            "required": ["param"]
        }
    }
]
```

### 3. Tool Handler Pattern
```python
async def tool_handler(parameters: dict, user_id: str) -> dict:
    """
    Execute tool action

    Args:
        parameters: Tool input parameters
        user_id: User identifier

    Returns:
        Tool execution result
    """
    # Extract parameters
    param = parameters.get("param")

    # Execute action (e.g., API call)
    result = await execute_action(param)

    # Return structured response
    return {
        "message": "Action completed",
        "data": result
    }
```

### 4. Claude AI Integration Pattern
```python
async def process_with_claude(user_message: str, tools: list) -> dict:
    """Process user message with Claude AI"""

    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        tools=tools,
        messages=[{
            "role": "user",
            "content": user_message
        }]
    )

    # Extract content and tool calls
    content = ""
    tool_calls = []

    for block in response.content:
        if block.type == "text":
            content += block.text
        elif block.type == "tool_use":
            tool_calls.append({
                "name": block.name,
                "input": block.input
            })

    return {"content": content, "tool_calls": tool_calls}
```

### 5. WebSocket Communication Pattern
```python
# Client → Server
{
    "type": "chat",
    "message": "User's message",
    "conversation_id": "uuid"
}

# Server → Client
{
    "type": "message",
    "role": "assistant",
    "content": "AI response",
    "tool_calls": [...],
    "timestamp": "2024-01-01T12:00:00Z"
}
```

## Bilingual Support Pattern

### Language Detection
```python
import re

def detect_language(text: str) -> str:
    """Detect Urdu or English"""
    urdu_pattern = r'[\u0600-\u06FF]'
    return 'ur' if re.search(urdu_pattern, text) else 'en'
```

### Translation Dictionary
```python
TRANSLATIONS = {
    "en_to_ur": {
        "Task created": "ٹاسک بنایا گیا",
        "Show tasks": "ٹاسک دکھائیں"
    },
    "ur_to_en": {
        "نیا ٹاسک": "new task",
        "تمام ٹاسک": "all tasks"
    }
}
```

## Voice Integration Pattern

### Web Speech API (Frontend)
```javascript
// Speech Recognition
const recognition = new webkitSpeechRecognition();
recognition.lang = 'en-US';  // or 'ur-PK' for Urdu
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    sendMessage(transcript);
};
recognition.start();

// Text-to-Speech
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'en-US';
speechSynthesis.speak(utterance);
```

## Error Handling Pattern

```python
try:
    result = await execute_tool(tool_name, parameters)
    return {"success": True, "data": result}
except ValueError as e:
    return {"success": False, "error": str(e)}
except Exception as e:
    logger.error(f"Tool execution failed: {e}")
    return {"success": False, "error": "Internal error"}
```

## Conversation Persistence Pattern

```python
from pydantic import BaseModel
from datetime import datetime

class Message(BaseModel):
    id: str
    conversation_id: str
    role: str  # 'user' or 'assistant'
    content: str
    tool_calls: Optional[list] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

## Testing Pattern

```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_tool_execution():
    """Test MCP tool execution"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/execute-tool",
            json={
                "tool": "create_task",
                "parameters": {"title": "Test"}
            }
        )
        assert response.status_code == 200
        assert response.json()["success"] is True
```

## Deployment Pattern

### Environment Variables
```env
# Required
ANTHROPIC_API_KEY=sk-ant-xxx
BACKEND_URL=http://localhost:8000

# Optional
MCP_SERVER_PORT=8001
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:3000"]
```

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

## Reuse Across Projects

### How to Reuse This Skill

1. **Copy Tool Handler Pattern** for new tools
2. **Adapt Tool Definitions** for your domain
3. **Reuse Claude Integration** as-is
4. **Customize WebSocket Protocol** if needed
5. **Add Bilingual Support** using translation pattern
6. **Integrate Voice** using Web Speech API pattern

### Example: E-commerce Chatbot

```python
# Reuse the MCP server structure
# Change tools to: search_products, add_to_cart, checkout
# Keep Claude integration, WebSocket, and voice support the same!

TOOLS = [
    {
        "name": "search_products",
        "description": "Search for products",
        "input_schema": {...}
    },
    {
        "name": "add_to_cart",
        "description": "Add product to cart",
        "input_schema": {...}
    }
]
```

## Best Practices

1. ✅ **Stateless Design** - Each request is independent
2. ✅ **Error Handling** - Always return structured errors
3. ✅ **Logging** - Log all tool executions
4. ✅ **Type Safety** - Use Pydantic models
5. ✅ **Testing** - Test each tool independently
6. ✅ **Documentation** - Document tool schemas clearly
7. ✅ **Security** - Validate all inputs
8. ✅ **Performance** - Use async/await for I/O

## Hackathon Bonus Points

- ✅ **+200 pts** for reusable patterns documented
- ✅ Use `@skills/` directory for cross-phase reuse
- ✅ Document patterns in markdown
- ✅ Provide code examples
- ✅ Show adaptation to different domains

## Related Skills

- `@skills/bilingual-chat-skill.md` - Multi-language support
- `@skills/voice-agent-skill.md` - Voice integration patterns
- `@skills/mcp-tools-skill.md` - Tool creation patterns

---

**Created for:** Evolution of Todo - Phase 3
**Reusable in:** Phase 4 (K8s), Phase 5 (Cloud), Future Projects
**Bonus Points:** +200 for Reusable Intelligence ✅
