"use client";

/**
 * TaskForm Component
 * Form for creating and editing tasks with validation
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TaskCreate, Priority, Status, Tag } from "@/lib/types";
import TagSelect from "../tags/TagSelect";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in_progress", "completed"]),
  due_date: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface TaskFormProps {
  onSubmit: (data: TaskCreate, tagIds: string[]) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<TaskFormData>;
  availableTags?: Tag[];
  initialTags?: Tag[];
  submitLabel?: string;
  isLoading?: boolean;
}

// ============================================================================
// TASKFORM COMPONENT
// ============================================================================

export default function TaskForm({
  onSubmit,
  onCancel,
  initialData,
  availableTags = [],
  initialTags = [],
  submitLabel = "Create Task",
  isLoading = false,
}: TaskFormProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialTags);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData || {
      priority: "medium",
      status: "pending",
    },
  });

  const handleFormSubmit = async (data: TaskFormData) => {
    const tagIds = selectedTags.map((tag) => tag.id);
    await onSubmit(data, tagIds);
    reset();
    setSelectedTags([]);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title")}
          id="title"
          type="text"
          placeholder="Enter task title"
          className={`w-full px-4 py-2 border ${
            errors.title ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition duration-200`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          Description
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={3}
          placeholder="Enter task description (optional)"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition duration-200"
        />
      </div>

      {/* Priority and Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority */}
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Priority
          </label>
          <select
            {...register("priority")}
            id="priority"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition duration-200"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Status
          </label>
          <select
            {...register("status")}
            id="status"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition duration-200"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label
          htmlFor="due_date"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          Due Date
        </label>
        <input
          {...register("due_date")}
          id="due_date"
          type="datetime-local"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition duration-200"
        />
      </div>

      {/* Tags */}
      {availableTags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Tags
          </label>
          <TagSelect
            availableTags={availableTags}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            placeholder="Select tags (optional)"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-medium"
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
