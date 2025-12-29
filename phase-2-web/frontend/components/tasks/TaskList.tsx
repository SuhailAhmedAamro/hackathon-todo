"use client";

/**
 * TaskList Component
 * Display a list of tasks with loading and empty states
 */

import { Task, Tag } from "@/lib/types";
import TaskItem from "./TaskItem";
import { InlineLoading } from "../ui/Loading";

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface TaskListProps {
  tasks: Task[];
  taskTags?: Record<string, Tag[]>;
  loading?: boolean;
  emptyMessage?: string;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void;
  onRemoveTag?: (taskId: string, tagId: string) => void;
}

// ============================================================================
// TASKLIST COMPONENT
// ============================================================================

export default function TaskList({
  tasks,
  taskTags = {},
  loading = false,
  emptyMessage = "No tasks found. Create your first task to get started!",
  onEdit,
  onDelete,
  onToggleComplete,
  onRemoveTag,
}: TaskListProps) {
  // Loading state
  if (loading) {
    return <InlineLoading message="Loading tasks..." />;
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          No tasks
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  // Task list
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          tags={taskTags[task.id]}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onRemoveTag={onRemoveTag}
        />
      ))}
    </div>
  );
}
