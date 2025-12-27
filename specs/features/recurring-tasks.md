# Feature: Recurring Tasks

## Overview
Support for tasks that repeat on a schedule.

## Functionality
- Define recurrence rules (daily, weekly, monthly, custom)
- Use iCal RRULE format for flexibility
- Auto-create instances on schedule
- Mark individual instances complete without affecting series
- Edit series or single instance

## Recurrence Patterns
- Daily: Every N days
- Weekly: Every N weeks on specific days
- Monthly: Specific day of month or day of week
- Yearly: Specific date
- Custom: Full RRULE support

## User Stories
- As a user, I want tasks to repeat daily/weekly so I don't have to recreate them
- As a user, I want to customize recurrence patterns
- As a user, I want to complete one instance without affecting future occurrences

## Phase Applicability
- [x] Phase 2-5 (optional in Phase 1)

See `@specs/database/schema.md` for recurrence_rule field
