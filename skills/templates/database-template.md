# Database: [Database/Table Name]

## Overview
[Brief description of what this database/table stores]

## Database Information

**Type**: PostgreSQL | MySQL | SQLite | MongoDB
**Version**: [X.X]
**Connection**: [Connection string pattern]
**Collation**: UTF-8

## Schema Design

### Table: `[table_name]`

**Description**: [What this table stores]

**Columns**:
| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | gen_random_uuid() | Unique identifier |
| field1 | VARCHAR(255) | NOT NULL | - | Field description |
| field2 | INTEGER | NOT NULL | 0 | Field description |
| field3 | TEXT | NULL | NULL | Field description |
| is_active | BOOLEAN | NOT NULL | true | Soft delete flag |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL | NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL | NOW() | Last update timestamp |

**SQL Definition**:
```sql
CREATE TABLE table_name (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field1 VARCHAR(255) NOT NULL,
    field2 INTEGER NOT NULL DEFAULT 0,
    field3 TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes**:
```sql
-- Primary key (automatic)
-- Additional indexes
CREATE INDEX idx_table_name_field1 ON table_name(field1);
CREATE INDEX idx_table_name_field2 ON table_name(field2);
CREATE INDEX idx_table_name_created_at ON table_name(created_at DESC);

-- Composite indexes
CREATE INDEX idx_table_name_field1_field2 ON table_name(field1, field2);

-- Partial indexes (for common queries)
CREATE INDEX idx_table_name_active ON table_name(field1)
WHERE is_active = true;

-- Full-text search index (if applicable)
CREATE INDEX idx_table_name_search ON table_name
USING GIN (to_tsvector('english', field1 || ' ' || COALESCE(field3, '')));
```

**Constraints**:
```sql
-- Unique constraints
ALTER TABLE table_name
ADD CONSTRAINT unique_field1
UNIQUE (field1);

-- Check constraints
ALTER TABLE table_name
ADD CONSTRAINT check_field2_positive
CHECK (field2 >= 0);

-- Foreign key constraints
ALTER TABLE table_name
ADD CONSTRAINT fk_other_table
FOREIGN KEY (other_id) REFERENCES other_table(id)
ON DELETE CASCADE
ON UPDATE CASCADE;
```

**Triggers** (if applicable):
```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_table_name_updated_at
BEFORE UPDATE ON table_name
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## Relationships

### One-to-Many
```
parent_table (1) ----< (N) table_name
    id                      parent_id
```

### Many-to-Many
```
table_a (N) <-----> (N) table_b
          table_a_table_b
      (table_a_id, table_b_id)
```

### One-to-One
```
table_name (1) ----< (1) detail_table
    id                      table_name_id (UNIQUE)
```

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│  parent_table   │       │   table_name    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │
│ name            │   └──<│ parent_id (FK)  │
│ created_at      │       │ field1          │
└─────────────────┘       │ field2          │
                          │ created_at      │
                          └─────────────────┘
```

## Sample Data

### Seed Data
```sql
-- Insert sample records
INSERT INTO table_name (field1, field2, field3) VALUES
    ('Sample 1', 100, 'Description 1'),
    ('Sample 2', 200, 'Description 2'),
    ('Sample 3', 300, 'Description 3');
```

### Test Data
```sql
-- Test data for development
INSERT INTO table_name (field1, field2) VALUES
    ('Test Record', 999);
```

## Common Queries

### Create
```sql
INSERT INTO table_name (field1, field2, field3)
VALUES ($1, $2, $3)
RETURNING *;
```

### Read (Single)
```sql
SELECT * FROM table_name
WHERE id = $1 AND is_active = true;
```

### Read (List)
```sql
SELECT * FROM table_name
WHERE is_active = true
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;
```

### Read (with Join)
```sql
SELECT t.*, p.name as parent_name
FROM table_name t
INNER JOIN parent_table p ON t.parent_id = p.id
WHERE t.is_active = true
ORDER BY t.created_at DESC;
```

### Update
```sql
UPDATE table_name
SET field1 = $1, field2 = $2
WHERE id = $3 AND is_active = true
RETURNING *;
```

### Delete (Soft Delete)
```sql
UPDATE table_name
SET is_active = false
WHERE id = $1
RETURNING *;
```

### Delete (Hard Delete)
```sql
DELETE FROM table_name
WHERE id = $1;
```

### Search
```sql
SELECT * FROM table_name
WHERE (field1 ILIKE $1 OR field3 ILIKE $1)
  AND is_active = true
ORDER BY created_at DESC;
```

### Full-Text Search
```sql
SELECT * FROM table_name
WHERE to_tsvector('english', field1 || ' ' || COALESCE(field3, ''))
  @@ to_tsquery('english', $1)
  AND is_active = true;
```

### Aggregation
```sql
SELECT
    field1,
    COUNT(*) as count,
    AVG(field2) as avg_field2,
    SUM(field2) as sum_field2
FROM table_name
WHERE is_active = true
GROUP BY field1
HAVING COUNT(*) > 1
ORDER BY count DESC;
```

## Migrations

### Migration: [001_create_table_name]

**Up Migration**:
```sql
-- Create table
CREATE TABLE table_name (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field1 VARCHAR(255) NOT NULL,
    field2 INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_table_name_field1 ON table_name(field1);

-- Add constraints
ALTER TABLE table_name
ADD CONSTRAINT check_field2_positive
CHECK (field2 >= 0);
```

**Down Migration**:
```sql
DROP TABLE IF EXISTS table_name CASCADE;
```

### Migration: [002_add_field3]

**Up Migration**:
```sql
ALTER TABLE table_name
ADD COLUMN field3 TEXT;

CREATE INDEX idx_table_name_field3 ON table_name(field3);
```

**Down Migration**:
```sql
DROP INDEX IF EXISTS idx_table_name_field3;
ALTER TABLE table_name
DROP COLUMN field3;
```

## Performance Optimization

### Index Strategy
- Primary key: `id` (automatic)
- Foreign keys: All FKs indexed
- Common filters: `is_active`, `created_at`
- Search fields: Full-text index on `field1`, `field3`

### Query Optimization
```sql
-- Use EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT * FROM table_name WHERE field1 = 'value';

-- Optimize with indexes
-- Avoid SELECT *
-- Use LIMIT for large datasets
-- Use prepared statements
```

### Partitioning (if needed)
```sql
-- Partition by date range
CREATE TABLE table_name_2025_01 PARTITION OF table_name
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

## Backup and Recovery

### Backup Command
```bash
# Full database backup
pg_dump dbname > backup.sql

# Table-specific backup
pg_dump -t table_name dbname > table_backup.sql
```

### Restore Command
```bash
# Restore from backup
psql dbname < backup.sql

# Restore specific table
psql dbname < table_backup.sql
```

## Security

### Permissions
```sql
-- Grant read access
GRANT SELECT ON table_name TO readonly_user;

-- Grant read/write access
GRANT SELECT, INSERT, UPDATE, DELETE ON table_name TO readwrite_user;

-- Revoke access
REVOKE ALL ON table_name FROM some_user;
```

### Row-Level Security (if needed)
```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY user_isolation ON table_name
FOR ALL
TO authenticated_users
USING (user_id = current_user_id());
```

## Monitoring

### Table Statistics
```sql
-- Table size
SELECT pg_size_pretty(pg_total_relation_size('table_name'));

-- Row count
SELECT COUNT(*) FROM table_name;

-- Index usage
SELECT * FROM pg_stat_user_indexes WHERE relname = 'table_name';
```

### Slow Query Identification
```sql
-- Enable query logging in postgresql.conf
-- log_min_duration_statement = 1000  # Log queries > 1s

-- View slow queries
SELECT * FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Testing

### Test Scenarios
- [ ] Create record with valid data
- [ ] Create record with invalid data (constraint violation)
- [ ] Update existing record
- [ ] Delete record (soft delete)
- [ ] Query with filters
- [ ] Query with pagination
- [ ] Query with sorting
- [ ] Full-text search
- [ ] Cascade delete on foreign key

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-26 | Initial schema |
| | | |

## References

- Feature Spec: `@specs/features/[feature].md`
- API Spec: `@specs/api/rest-endpoints.md`
- Migration files: `/alembic/versions/`

---

**Template Version**: 1.0
**Last Updated**: 2025-01-26
**Usage**: `@skills/templates/database-template.md`
