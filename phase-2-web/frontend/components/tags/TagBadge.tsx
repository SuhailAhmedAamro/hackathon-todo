/**
 * TagBadge Component
 * Displays a tag with its color as a badge
 */

import { Tag } from "@/lib/types";

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  size?: "sm" | "md";
}

export default function TagBadge({ tag, onRemove, size = "md" }: TagBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${tag.color}20`,
        color: tag.color,
        border: `1px solid ${tag.color}40`,
      }}
    >
      <span>{tag.name}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
          title="Remove tag"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
