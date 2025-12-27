# API Specifications - Claude Guide

## Purpose
API specs define contracts between frontend and backend, or between services.

## Files in This Directory
- `rest-endpoints.md` - RESTful API endpoints for web app
- `mcp-tools.md` - MCP tool definitions for chatbot
- `event-schemas.md` - WebSocket event payloads

## How to Use
1. Read API spec when implementing backend endpoints or frontend API calls
2. Follow exact request/response formats
3. Implement all validation rules
4. Handle all error cases
5. Update spec if contract changes

## Creating a New API Spec
Use the template: `@.spec-kit/prompts/api-spec-template.md`
