"use client";

/**
 * TaskItem Component
 * Display a single task with actions (edit, delete, complete)
 */

import { Task, Tag } from "@/lib/types";
import { useState } from "react";
import TagBadge from "../tags/TagBadge";

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface TaskItemProps {
  task: Task;
  tags?: Tag[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void;
  onRemoveTag?: (taskId: string, tagId: string) => void;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "pending":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
  }
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatStatus = (status: string) => {
  return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

// ============================================================================
// TASKITEM COMPONENT
// ============================================================================

export default function TaskItem({
  task,
  tags,
  onEdit,
  onDelete,
  onToggleComplete,
  onRemoveTag,
}: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    if (confirm("Are you sure you want to delete this task?")) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggleComplete = async () => {
    if (!onToggleComplete) return;
    setIsToggling(true);
    try {
      await onToggleComplete(task.id);
    } finally {
      setIsToggling(false);
    }
  };

  const isCompleted = task.status === "completed";
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isCompleted;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 ${
        isCompleted
          ? "border-green-500"
          : isOverdue
          ? "border-red-500"
          : task.priority === "high"
          ? "border-red-500"
          : task.priority === "medium"
          ? "border-yellow-500"
          : "border-blue-500"
      } hover-lift animate-fadeIn`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold text-gray-900 dark:text-white ${
              isCompleted ? "line-through opacity-60" : ""
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`mt-1 text-sm text-gray-600 dark:text-gray-400 ${
                isCompleted ? "line-through opacity-60" : ""
              }`}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          {/* Complete Toggle */}
          <button
            onClick={handleToggleComplete}
            disabled={isToggling}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isCompleted
                ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            } disabled:opacity-50`}
            title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {isCompleted ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </button>

          {/* Edit */}
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
              title="Edit task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}

          {/* Delete */}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Delete task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              size="sm"
              onRemove={onRemoveTag ? () => onRemoveTag(task.id, tag.id) : undefined}
            />
          ))}
        </div>
      )}

      {/* Footer - Badges and Dates */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {/* Priority Badge */}
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority.toUpperCase()}
        </span>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
            task.status
          )}`}
        >
          {formatStatus(task.status)}
        </span>

        {/* Due Date */}
        {task.due_date && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isOverdue
                ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            {formatDate(task.due_date)}
            {isOverdue && " (Overdue)"}
          </span>
        )}

        {/* Completed Date */}
        {task.completed_at && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Completed {formatDate(task.completed_at)}
          </span>
        )}
      </div>
    </div>
  );
}
