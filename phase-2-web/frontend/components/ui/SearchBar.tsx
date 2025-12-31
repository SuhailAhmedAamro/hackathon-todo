/**
 * SearchBar Component
 * Search input with icon and keyboard shortcut hint
 */

"use client";

import { InputHTMLAttributes, useState, useEffect } from "react";

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  showShortcut?: boolean;
}

export default function SearchBar({
  onSearch,
  showShortcut = true,
  className = "",
  ...props
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch?.(newValue);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className={`h-5 w-5 transition-colors ${
            isFocused
              ? "text-blue-500"
              : "text-gray-400 dark:text-gray-500"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        id="search-input"
        type="text"
        className="w-full pl-10 pr-20 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        placeholder="Search tasks..."
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />

      {/* Keyboard Shortcut Hint */}
      {showShortcut && !isFocused && !value && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs font-semibold text-gray-500 dark:text-gray-400">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      )}

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => {
            setValue("");
            onSearch?.("");
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
