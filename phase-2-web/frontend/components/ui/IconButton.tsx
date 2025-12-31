/**
 * IconButton Component
 * Button with icon only, no text
 */

import { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: "default" | "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  ariaLabel: string;
}

export default function IconButton({
  icon,
  variant = "default",
  size = "md",
  ariaLabel,
  className = "",
  ...props
}: IconButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default:
      "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 focus:ring-gray-500",
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-md hover:shadow-lg active:scale-95",
    ghost:
      "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-md hover:shadow-lg active:scale-95",
  };

  const sizes = {
    sm: "p-1.5 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {icon}
    </button>
  );
}
