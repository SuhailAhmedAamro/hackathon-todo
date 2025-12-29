/**
 * TagManager Component
 * Manage tags (create, edit, delete) with color picker
 */

"use client";

import { useState } from "react";
import { Tag, TagCreate } from "@/lib/types";
import { api } from "@/lib/api";
import { showSuccess, showError } from "@/lib/toast";
import TagBadge from "./TagBadge";

interface TagManagerProps {
  tags: Tag[];
  onTagsChange: () => void;
}

const PRESET_COLORS = [
  "#EF4444", // Red
  "#F59E0B", // Orange
  "#EAB308", // Yellow
  "#22C55E", // Green
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#A855F7", // Purple
  "#EC4899", // Pink
  "#F43F5E", // Rose
];

export default function TagManager({ tags, onTagsChange }: TagManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState<TagCreate>({
    name: "",
    color: "#3B82F6",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError("Tag name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingTag) {
        await api.updateTag(editingTag.id, formData);
        showSuccess("Tag updated successfully!");
      } else {
        await api.createTag(formData);
        showSuccess("Tag created successfully!");
      }

      setFormData({ name: "", color: "#3B82F6" });
      setShowForm(false);
      setEditingTag(null);
      onTagsChange();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to save tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, color: tag.color });
    setShowForm(true);
  };

  const handleDelete = async (tagId: string) => {
    if (!confirm("Delete this tag? It will be removed from all tasks.")) {
      return;
    }

    try {
      await api.deleteTag(tagId);
      showSuccess("Tag deleted successfully!");
      onTagsChange();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to delete tag");
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", color: "#3B82F6" });
    setShowForm(false);
    setEditingTag(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Manage Tags
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + New Tag
          </button>
        )}
      </div>

      {/* Tag Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Tag Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Urgent, Personal, Work"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={100}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-full h-10 rounded-lg border-2 transition-all ${
                    formData.color === color
                      ? "border-gray-900 dark:border-white scale-110"
                      : "border-gray-300 dark:border-gray-600 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                  disabled={isSubmitting}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Custom:</span>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value.toUpperCase() })}
                className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                disabled={isSubmitting}
              />
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {formData.color}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? "Saving..." : editingTag ? "Update Tag" : "Create Tag"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Tags List */}
      <div className="space-y-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <TagBadge tag={tag} />
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tag)}
                  className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  title="Edit tag"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Delete tag"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg
              className="mx-auto h-12 w-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <p className="text-sm">No tags yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
