# Database Schema

## Overview
Complete database schema for all phases of the Evolution of Todo application.

## Supported Databases
- **Phase 1**: SQLite
- **Phase 2+**: PostgreSQL 15+

## Tables

### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

### tasks
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    due_date TIMESTAMP WITH TIME ZONE,
    recurrence_rule TEXT,  -- iCal RRULE format for recurring tasks
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
```

### tags
```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7),  -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

CREATE INDEX idx_tags_user_id ON tags(user_id);
```

### task_tags (many-to-many)
```sql
CREATE TABLE task_tags (
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (task_id, tag_id)
);

CREATE INDEX idx_task_tags_task_id ON task_tags(task_id);
CREATE INDEX idx_task_tags_tag_id ON task_tags(tag_id);
```

### conversations (Phase 3+)
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);
```

### messages (Phase 3+)
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    tool_calls JSONB,  -- Stores MCP tool calls and responses
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

## Relationships

```
users (1) ────< (N) tasks
users (1) ────< (N) tags
users (1) ────< (N) conversations

tasks (N) ────< (N) tags (through task_tags)

conversations (1) ────< (N) messages
```

## Sample Queries

### Get all tasks for a user with tags
```sql
SELECT
    t.*,
    ARRAY_AGG(tg.name) AS tag_names
FROM tasks t
LEFT JOIN task_tags tt ON t.id = tt.task_id
LEFT JOIN tags tg ON tt.tag_id = tg.id
WHERE t.user_id = $1
GROUP BY t.id
ORDER BY t.created_at DESC;
```

### Get task statistics
```sql
SELECT
    COUNT(*) AS total_tasks,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_tasks,
    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_tasks,
    SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) AS high_priority_tasks
FROM tasks
WHERE user_id = $1;
```

### Search tasks
```sql
SELECT *
FROM tasks
WHERE user_id = $1
    AND (
        title ILIKE $2
        OR description ILIKE $2
    )
ORDER BY created_at DESC;
```

## Phase-Specific Notes

### Phase 1 (SQLite)
- Use INTEGER PRIMARY KEY for id
- No UUID support (use strings)
- Simplified timestamp handling
- No JSONB type (use TEXT)

### Phase 2+ (PostgreSQL)
- Use UUID for all primary keys
- TIMESTAMP WITH TIME ZONE for all timestamps
- JSONB for structured data
- Full-text search capability

## Migration Strategy
See `@specs/database/migrations.md`
