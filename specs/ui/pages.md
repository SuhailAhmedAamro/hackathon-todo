# UI Pages

## Overview
Page layouts and routing for the web application.

## Pages

### / (Home/Dashboard)
**Route**: `/`
**Auth**: Required
**Layout**: Sidebar + Main
**Content**:
- Task statistics cards
- Recent tasks
- High priority tasks
- Quick add task form

### /auth/login
**Route**: `/auth/login`
**Auth**: Public
**Layout**: Centered form
**Content**:
- Login form
- Link to register
- Forgot password (future)

### /auth/register
**Route**: `/auth/register`
**Auth**: Public
**Layout**: Centered form
**Content**:
- Registration form
- Link to login

### /tasks
**Route**: `/tasks`
**Auth**: Required
**Layout**: Sidebar + Main
**Content**:
- Task list with filters
- Search bar
- Sort options
- Pagination
- Add task button

### /tasks/:id
**Route**: `/tasks/:id`
**Auth**: Required
**Layout**: Modal or Full Page
**Content**:
- Task details
- Edit form
- Delete button
- Activity history

### /chat
**Route**: `/chat`
**Auth**: Required
**Layout**: Chat interface
**Content**:
- Message list
- Input field
- Conversation selector
- Hybrid toggle (chat/traditional view)

### /profile
**Route**: `/profile`
**Auth**: Required
**Layout**: Sidebar + Main
**Content**:
- User information
- Settings
- Change password
- Delete account

## Routing
```typescript
// Next.js App Router structure
app/
├── layout.tsx           # Root layout
├── page.tsx             # Dashboard
├── auth/
│   ├── login/page.tsx
│   └── register/page.tsx
├── tasks/
│   ├── page.tsx         # Task list
│   └── [id]/page.tsx    # Task details
├── chat/page.tsx
└── profile/page.tsx
```

## Navigation
- Sidebar navigation (desktop)
- Bottom tab bar (mobile)
- Breadcrumbs
- Back button

## Phase Applicability
- [x] Phase 2: Web
- [x] Phase 3-5
