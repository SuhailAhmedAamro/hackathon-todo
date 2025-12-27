# Database Specification Template

Use this template when documenting database schemas and migration strategies.

## Database Overview
**Type**: [PostgreSQL, MySQL, SQLite, MongoDB, etc.]
**Version**: [Version number]
**Purpose**: [What this database stores]

## Schema Design

### Table/Collection: `table_name`
**Description**: [What this table stores]

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INTEGER | PRIMARY KEY, NOT NULL | Unique identifier |
| field1 | VARCHAR(255) | NOT NULL | Description |
| field2 | INTEGER | DEFAULT 0 | Description |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes**:
```sql
CREATE INDEX idx_field1 ON table_name(field1);
CREATE INDEX idx_created_at ON table_name(created_at);
```

**Constraints**:
```sql
-- Foreign keys
ALTER TABLE table_name
  ADD CONSTRAINT fk_other_table
  FOREIGN KEY (other_id) REFERENCES other_table(id);

-- Unique constraints
ALTER TABLE table_name
  ADD CONSTRAINT unique_field1
  UNIQUE (field1);

-- Check constraints
ALTER TABLE table_name
  ADD CONSTRAINT check_positive
  CHECK (field2 >= 0);
```

## Relationships

### One-to-Many
```
users (1) -----> (N) tasks
  id                 user_id
```

### Many-to-Many
```
tasks (N) <-----> (N) tags
              task_tags
          (task_id, tag_id)
```

## Entity Relationship Diagram
```
┌─────────────┐       ┌─────────────┐
│    users    │       │    tasks    │
├─────────────┤       ├─────────────┤
│ id (PK)     │───┐   │ id (PK)     │
│ username    │   └──<│ user_id (FK)│
│ email       │       │ title       │
│ created_at  │       │ description │
└─────────────┘       │ priority    │
                      │ status      │
                      │ created_at  │
                      └─────────────┘
```

## Sample Data

### Users
```sql
INSERT INTO users (id, username, email) VALUES
  ('uuid-1', 'john_doe', 'john@example.com'),
  ('uuid-2', 'jane_smith', 'jane@example.com');
```

### Tasks
```sql
INSERT INTO tasks (id, user_id, title, priority, status) VALUES
  ('uuid-3', 'uuid-1', 'Complete project', 'high', 'in_progress'),
  ('uuid-4', 'uuid-1', 'Review code', 'medium', 'pending');
```

## Queries

### Common Queries
```sql
-- Get all tasks for a user
SELECT * FROM tasks
WHERE user_id = ?
ORDER BY created_at DESC;

-- Get high priority tasks
SELECT * FROM tasks
WHERE priority = 'high' AND status != 'completed'
ORDER BY created_at ASC;

-- Get task statistics by user
SELECT
  user_id,
  COUNT(*) as total_tasks,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks
FROM tasks
GROUP BY user_id;
```

## Migrations

### Migration: 001_initial_schema
**Description**: Create initial database schema

**Up Migration**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

**Down Migration**:
```sql
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;
```

## Performance Considerations
- Index strategy: [Explain indexing decisions]
- Query optimization: [Common query patterns]
- Caching strategy: [If applicable]
- Partitioning: [If applicable]

## Backup and Recovery
- Backup schedule: [Daily, weekly, etc.]
- Retention policy: [How long to keep backups]
- Recovery procedure: [Steps to restore from backup]

## Security
- Encryption at rest: [Yes/No, method]
- Encryption in transit: [SSL/TLS]
- Access control: [User permissions, roles]
- Sensitive data handling: [Password hashing, PII protection]

## Scaling Strategy
- Vertical scaling: [When and how]
- Horizontal scaling: [Sharding, replication]
- Read replicas: [If applicable]

## Testing Data
[Sample datasets for testing, development, and demo purposes]

## Phase-Specific Considerations
- **Phase 1 (Console)**: SQLite, single user
- **Phase 2 (Web)**: PostgreSQL, multi-user
- **Phase 3 (Chatbot)**: Same as Phase 2
- **Phase 4 (K8s)**: StatefulSet for database
- **Phase 5 (Cloud)**: Managed database service (RDS, Cloud SQL)
