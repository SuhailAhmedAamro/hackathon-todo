/**
 * GlassButton Component
 * Modern glassmorphism button with premium styling
 */

"use client";

import { ButtonHTMLAttributes } from "react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

export default function GlassButton({
  children,
  variant = "primary",
  isLoading = false,
  loadingText = "Loading...",
  icon,
  className = "",
  disabled,
  ...props
}: GlassButtonProps) {
  const baseStyles = `
    relative group w-full px-6 py-4 rounded-2xl font-semibold
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-purple-600
      hover:from-blue-700 hover:to-purple-700
      text-white shadow-lg shadow-blue-500/50
      hover:shadow-xl hover:shadow-blue-500/60
      hover:-translate-y-0.5
      focus:ring-blue-500
    `,
    secondary: `
      bg-white/10 dark:bg-gray-800/30
      backdrop-blur-xl
      border border-white/20 dark:border-gray-700/50
      text-gray-900 dark:text-white
      hover:bg-white/20 dark:hover:bg-gray-800/40
      hover:shadow-lg hover:shadow-black/10
      focus:ring-blue-500
    `,
    outline: `
      bg-transparent
      border-2 border-blue-500/50
      text-blue-600 dark:text-blue-400
      hover:bg-blue-500/10
      hover:border-blue-500
      focus:ring-blue-500
    `,
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <span className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText}
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </span>
    </button>
  );
}
