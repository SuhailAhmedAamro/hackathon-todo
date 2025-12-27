# Chat Interface

## Overview
Conversational UI for task management using Claude.

## Layout
```
┌────────────────────────────────────┐
│  Header (Conversation Title)       │
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │  Message List                │  │
│  │  ├─ User: Create task        │  │
│  │  ├─ Assistant: Done!         │  │
│  │  │   [Task Card Preview]     │  │
│  │  └─ User: List tasks         │  │
│  └──────────────────────────────┘  │
├────────────────────────────────────┤
│  Message Input                     │
│  [Type message...]      [Send]     │
└────────────────────────────────────┘
```

## Components

### ChatInterface
- Message list (scrollable)
- Message input
- Send button
- Loading indicator
- Error display

### Message
- User messages (right-aligned)
- Assistant messages (left-aligned)
- Timestamps
- Tool call visualizations
- Embedded task cards

### ConversationList
- List of conversations
- Create new conversation
- Switch conversations
- Delete conversation

### HybridToggle
- Switch between chat and traditional UI
- Preserve state when toggling

## Features
- Real-time streaming responses
- Message history
- Context-aware conversations
- Task previews inline
- Quick actions from chat
- Markdown rendering

## Accessibility
- Keyboard navigation
- Screen reader announcements for new messages
- ARIA live regions
- Focus management

## Phase Applicability
- [x] Phase 3: Chatbot
- [x] Phase 4-5
