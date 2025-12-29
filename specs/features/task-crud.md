# Feature: Task CRUD Operations

## Overview
Core task management functionality allowing users to create, read, update, and delete tasks.

## User Stories

### As a user, I want to create tasks so that I can track things I need to do
**Acceptance Criteria:**
- [ ] Can create a task with title (required)
- [ ] Can add optional description
- [ ] Can set priority (low, medium, high)
- [ ] Can set due date
- [ ] Task is saved and appears in my task list
- [ ] Get confirmation after successful creation

### As a user, I want to view my tasks so that I can see what needs to be done
**Acceptance Criteria:**
- [ ] Can view list of all tasks
- [ ] Can view details of individual task
- [ ] Can filter by status, priority
- [ ] Can search by title/description
- [ ] Can sort by date, priority
- [ ] See task count and statistics

### As a user, I want to update tasks so that I can modify details as needed
**Acceptance Criteria:**
- [ ] Can update title, description
- [ ] Can change priority
- [ ] Can change status
- [ ] Can update due date
- [ ] Changes are saved immediately
- [ ] Get confirmation after update

### As a user, I want to delete tasks so that I can remove completed or irrelevant items
**Acceptance Criteria:**
- [ ] Can delete a task
- [ ] Get confirmation prompt before deletion
- [ ] Task is permanently removed
- [ ] Cannot undo deletion

## Functional Requirements

### Create Task
- Title: 1-255 characters, required
- Description: Optional, unlimited text
- Priority: Enum (low, medium, high), default: medium
- Status: Auto-set to "pending"
- Due Date: Optional ISO date
- Created timestamp: Auto-generated
- User association: Auto-assigned to current user

### Read Tasks
- List view: Paginated (20 per page)
- Filters: status, priority, date range
- Search: Full-text on title and description
- Sort: by created_at, due_date, priority, status

### Update Task
- Can update any field except id, created_at, user_id
- Updated timestamp auto-updated
- Validation same as create

### Delete Task
- Requires confirmation
- Hard delete (permanent removal)
- Cascade delete related data (tags, etc.)

## API Integration
See `@specs/api/rest-endpoints.md` for API contracts

## Data Model
See `@specs/database/schema.md` for database schema

## UI Requirements
See `@specs/ui/components.md` and `@specs/ui/pages.md`

## Phase Applicability
- [x] Phase 1: Console CLI
- [x] Phase 2: Web Application
- [x] Phase 3: Chatbot (via MCP tools)
- [x] Phase 4: Kubernetes
- [x] Phase 5: Cloud

---

## Phase 2: Web Application Implementation

### Technology Stack

#### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API / Zustand
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios / Fetch API

#### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Validation**: Pydantic v2
- **Authentication**: Better Auth with JWT tokens
- **CORS**: Configured for Next.js frontend

#### Database
- **Provider**: Neon PostgreSQL (Serverless)
- **Migrations**: Alembic
- **Connection Pooling**: Async SQLAlchemy engine

#### Authentication
- **Library**: Better Auth
- **Strategy**: JWT tokens (access + refresh)
- **Session Management**: HTTP-only cookies
- **Password**: Bcrypt hashing

---

### REST API Endpoints

#### List Tasks
```
GET /api/tasks
```
**Query Parameters:**
- `status` (optional): pending | in_progress | completed
- `priority` (optional): low | medium | high
- `search` (optional): search term for title/description
- `sort_by` (optional): created_at | due_date | priority | title
- `sort_order` (optional): asc | desc
- `page` (optional): page number (default: 1)
- `limit` (optional): items per page (default: 20, max: 100)

**Response:**
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string | null",
      "priority": "low | medium | high",
      "status": "pending | in_progress | completed",
      "due_date": "ISO 8601 string | null",
      "created_at": "ISO 8601 string",
      "updated_at": "ISO 8601 string",
      "completed_at": "ISO 8601 string | null",
      "user_id": "uuid"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "total_pages": 5
}
```

**Acceptance Criteria:**
- [ ] Returns only tasks belonging to authenticated user
- [ ] Filters work correctly for all combinations
- [ ] Search performs case-insensitive matching
- [ ] Pagination works correctly
- [ ] Returns 401 if not authenticated
- [ ] Returns 200 with empty array if no tasks found

---

#### Create Task
```
POST /api/tasks
```
**Request Body:**
```json
{
  "title": "string (required, 1-255 chars)",
  "description": "string (optional)",
  "priority": "low | medium | high (optional, default: medium)",
  "due_date": "ISO 8601 string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "priority": "medium",
  "status": "pending",
  "due_date": "ISO 8601 string | null",
  "created_at": "ISO 8601 string",
  "updated_at": "ISO 8601 string",
  "completed_at": null,
  "user_id": "uuid"
}
```

**Acceptance Criteria:**
- [ ] Title is required and validated (1-255 chars)
- [ ] Priority defaults to "medium" if not provided
- [ ] Status is auto-set to "pending"
- [ ] User_id is auto-assigned from JWT token
- [ ] Created_at and updated_at are auto-generated
- [ ] Returns 400 for validation errors
- [ ] Returns 401 if not authenticated
- [ ] Returns 201 with created task on success

---

#### Get Task by ID
```
GET /api/tasks/{id}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "priority": "low | medium | high",
  "status": "pending | in_progress | completed",
  "due_date": "ISO 8601 string | null",
  "created_at": "ISO 8601 string",
  "updated_at": "ISO 8601 string",
  "completed_at": "ISO 8601 string | null",
  "user_id": "uuid"
}
```

**Acceptance Criteria:**
- [ ] Returns task if it belongs to authenticated user
- [ ] Returns 404 if task not found
- [ ] Returns 403 if task belongs to different user
- [ ] Returns 401 if not authenticated
- [ ] Returns 200 with task data on success

---

#### Update Task
```
PUT /api/tasks/{id}
```

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "priority": "low | medium | high (optional)",
  "status": "pending | in_progress | completed (optional)",
  "due_date": "ISO 8601 string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "priority": "low | medium | high",
  "status": "pending | in_progress | completed",
  "due_date": "ISO 8601 string | null",
  "created_at": "ISO 8601 string",
  "updated_at": "ISO 8601 string",
  "completed_at": "ISO 8601 string | null",
  "user_id": "uuid"
}
```

**Acceptance Criteria:**
- [ ] Can update any field except id, created_at, user_id
- [ ] Updated_at is auto-updated to current timestamp
- [ ] If status changed to "completed", completed_at is set
- [ ] Validation same as create for each field
- [ ] Returns 404 if task not found
- [ ] Returns 403 if task belongs to different user
- [ ] Returns 401 if not authenticated
- [ ] Returns 400 for validation errors
- [ ] Returns 200 with updated task on success

---

#### Delete Task
```
DELETE /api/tasks/{id}
```

**Response:** `204 No Content`

**Acceptance Criteria:**
- [ ] Permanently deletes the task
- [ ] Returns 404 if task not found
- [ ] Returns 403 if task belongs to different user
- [ ] Returns 401 if not authenticated
- [ ] Returns 204 on successful deletion

---

#### Toggle Task Completion
```
PATCH /api/tasks/{id}/complete
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "title": "string",
  "status": "completed | pending",
  "completed_at": "ISO 8601 string | null",
  "updated_at": "ISO 8601 string"
}
```

**Acceptance Criteria:**
- [ ] Toggles status between "pending" and "completed"
- [ ] Sets completed_at when marking complete
- [ ] Clears completed_at when marking incomplete
- [ ] Updates updated_at timestamp
- [ ] Returns 404 if task not found
- [ ] Returns 403 if task belongs to different user
- [ ] Returns 401 if not authenticated
- [ ] Returns 200 with updated task on success

---

### Frontend Components

#### TaskList Component
**Location**: `src/components/tasks/TaskList.tsx`

**Props:**
```typescript
interface TaskListProps {
  initialTasks?: Task[];
  filters?: TaskFilters;
  onTaskSelect?: (task: Task) => void;
}
```

**Features:**
- Display tasks in a responsive grid/list
- Show task cards with priority color indicators
- Support filtering by status, priority
- Search functionality
- Pagination controls
- Loading states and skeletons
- Empty state when no tasks
- Refresh button

**Acceptance Criteria:**
- [ ] Renders list of tasks correctly
- [ ] Shows loading skeleton while fetching
- [ ] Displays empty state when no tasks
- [ ] Filters update the list immediately
- [ ] Search debounced (300ms)
- [ ] Pagination works correctly
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessible (keyboard navigation, ARIA labels)

---

#### TaskForm Component
**Location**: `src/components/tasks/TaskForm.tsx`

**Props:**
```typescript
interface TaskFormProps {
  mode: 'create' | 'edit';
  task?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
}
```

**Fields:**
- Title (required, text input)
- Description (optional, textarea)
- Priority (required, select/radio)
- Due Date (optional, date picker)
- Submit and Cancel buttons

**Acceptance Criteria:**
- [ ] Form validation with Zod schema
- [ ] Shows error messages inline
- [ ] Disables submit while submitting
- [ ] Shows success message on submit
- [ ] Pre-fills data in edit mode
- [ ] Cancel button discards changes
- [ ] Form is responsive
- [ ] Accessible (labels, error announcements)

---

#### TaskItem Component
**Location**: `src/components/tasks/TaskItem.tsx`

**Props:**
```typescript
interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
}
```

**Features:**
- Display task title, description (truncated)
- Priority badge with color
- Status indicator
- Due date display
- Checkbox for completion
- Edit and delete buttons
- Hover effects

**Acceptance Criteria:**
- [ ] Shows all task details correctly
- [ ] Priority color matches design system
- [ ] Complete checkbox toggles status
- [ ] Edit button opens edit modal/form
- [ ] Delete button shows confirmation dialog
- [ ] Responsive layout
- [ ] Accessible (semantic HTML, ARIA)

---

#### Authentication Components

##### LoginForm Component
**Location**: `src/components/auth/LoginForm.tsx`

**Fields:**
- Email (required, email validation)
- Password (required, min 8 chars)
- Remember me (checkbox)
- Submit button

**Acceptance Criteria:**
- [ ] Email validation
- [ ] Password visibility toggle
- [ ] Shows validation errors
- [ ] Redirects to dashboard on success
- [ ] Shows error toast on failure
- [ ] Remember me persists session

---

##### SignupForm Component
**Location**: `src/components/auth/SignupForm.tsx`

**Fields:**
- Name (required)
- Email (required, email validation)
- Password (required, min 8 chars, strength indicator)
- Confirm Password (required, must match)
- Submit button

**Acceptance Criteria:**
- [ ] All validations working
- [ ] Password strength indicator
- [ ] Confirm password matches
- [ ] Creates user account
- [ ] Auto-login after signup
- [ ] Shows error messages

---

### Database Schema (Phase 2)

#### Users Table (Managed by Better Auth)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

---

#### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,

  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed'))
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

---

### Security Requirements

1. **Authentication:**
   - [ ] All API endpoints require valid JWT token (except auth endpoints)
   - [ ] Tokens expire after 15 minutes (access) / 7 days (refresh)
   - [ ] Refresh token rotation implemented

2. **Authorization:**
   - [ ] Users can only access their own tasks
   - [ ] User ID from JWT token, not request body
   - [ ] 403 Forbidden for unauthorized access

3. **Input Validation:**
   - [ ] All inputs validated with Pydantic
   - [ ] SQL injection prevention via ORM
   - [ ] XSS prevention in frontend

4. **CORS:**
   - [ ] Configured for Next.js frontend only
   - [ ] Credentials allowed for cookies

---

### Performance Requirements

1. **API Response Times:**
   - [ ] GET /api/tasks: < 200ms (p95)
   - [ ] POST /api/tasks: < 300ms (p95)
   - [ ] PUT /api/tasks/{id}: < 250ms (p95)
   - [ ] DELETE /api/tasks/{id}: < 100ms (p95)

2. **Frontend Performance:**
   - [ ] First Contentful Paint < 1.5s
   - [ ] Time to Interactive < 3s
   - [ ] Lighthouse Performance Score > 90

3. **Database:**
   - [ ] Connection pooling configured
   - [ ] Indexes on frequently queried columns
   - [ ] Query optimization for list endpoint

---

## Testing

### Unit Tests (Backend)
- Task CRUD service methods
- Input validation
- Business logic
- Authorization checks

### Unit Tests (Frontend)
- Component rendering
- Form validation
- State management
- User interactions

### Integration Tests
- API endpoint flows
- Database operations
- Authentication flows
- Error handling

### E2E Tests
- Complete user workflows
- Task creation to completion
- Login to task management
- Error scenarios

### Test Coverage Requirements
- Backend: > 80%
- Frontend: > 75%
- Critical paths: 100%

---

## Success Metrics
- Task creation success rate > 99%
- Task list load time < 200ms
- Search results in < 100ms
- API uptime > 99.9%
- Zero SQL injection vulnerabilities
- Zero XSS vulnerabilities
- WCAG 2.1 AA compliance
