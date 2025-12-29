/**
 * TagSelect Component
 * Multi-select dropdown for choosing tags
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Tag } from "@/lib/types";
import TagBadge from "./TagBadge";

interface TagSelectProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
}

export default function TagSelect({
  availableTags,
  selectedTags,
  onTagsChange,
  placeholder = "Select tags...",
}: TagSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTags = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTags.some((selected) => selected.id === tag.id)
  );

  const handleToggleTag = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) {
      onTagsChange(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Tags Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[42px] w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {selectedTags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {selectedTags.map((tag) => (
              <TagBadge
                key={tag.id}
                tag={tag}
                size="sm"
                onRemove={() => handleRemoveTag(tag.id)}
              />
            ))}
          </div>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-600">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tags..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Tag List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    handleToggleTag(tag);
                    setSearchTerm("");
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded-full border-2"
                    style={{ borderColor: tag.color, backgroundColor: `${tag.color}40` }}
                  />
                  <span className="text-gray-900 dark:text-white">{tag.name}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                {searchTerm ? "No tags found" : "No more tags available"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
