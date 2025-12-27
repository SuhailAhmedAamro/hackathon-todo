# UI Component Library

## Overview
Reusable React components for the web application.

## Core Components

### TaskCard
**Purpose**: Display task in card format
**Props**:
- task: Task object
- onEdit: (taskId) => void
- onDelete: (taskId) => void
- onComplete: (taskId) => void

### TaskList
**Purpose**: List of tasks with filters
**Props**:
- tasks: Task[]
- filters: FilterObject
- onTaskClick: (taskId) => void

### TaskForm
**Purpose**: Create/edit task form
**Props**:
- task?: Task (for editing)
- onSubmit: (taskData) => void
- onCancel: () => void

### TagBadge
**Purpose**: Display tag with color
**Props**:
- tag: Tag object
- size: 'small' | 'medium' | 'large'
- removable?: boolean
- onRemove?: () => void

### PriorityIndicator
**Purpose**: Visual priority indicator
**Props**:
- priority: 'low' | 'medium' | 'high'
- variant: 'badge' | 'icon' | 'text'

### Header
**Purpose**: App header with navigation
**Props**:
- user: User object
- onLogout: () => void

### Layout
**Purpose**: Page layout wrapper
**Props**:
- children: ReactNode
- sidebar?: ReactNode

## Form Components
- Input
- TextArea
- Select
- DatePicker
- Checkbox
- Button

## Styling
- Tailwind CSS
- Design tokens from `.spec-kit/`
- Responsive (mobile-first)
- Dark mode support

## Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation
- ARIA labels
- Screen reader support

## Phase Applicability
- [x] Phase 2: Web
- [x] Phase 3-5
