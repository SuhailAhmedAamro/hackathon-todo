/**
 * Badge Component
 * Status indicators and labels
 */

import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "purple";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className = "",
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full transition-all duration-200";

  const variants = {
    default:
      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    success:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    warning:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    error: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    info: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    purple:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-base gap-2",
  };

  const dotColors = {
    default: "bg-gray-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    purple: "bg-purple-500",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} ${
            variant === "success" ? "animate-pulse" : ""
          }`}
        />
      )}
      {children}
    </span>
  );
}
