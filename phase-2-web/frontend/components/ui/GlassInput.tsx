/**
 * GlassInput Component
 * Modern glassmorphism input with floating labels and password visibility toggle
 */

"use client";

import { useState, forwardRef } from "react";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, icon, type = "text", className = "", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const isPasswordField = type === "password";
    const inputType = isPasswordField && showPassword ? "text" : type;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className="relative group">
        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={inputType}
          className={`
            peer w-full px-4 py-4 ${icon ? "pl-12" : ""} ${isPasswordField ? "pr-12" : ""}
            bg-white/10 dark:bg-gray-800/30
            backdrop-blur-xl
            border border-white/20 dark:border-gray-700/50
            rounded-2xl
            text-gray-900 dark:text-white
            placeholder-transparent
            focus:outline-none
            focus:border-blue-500/50 dark:focus:border-blue-400/50
            focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
            transition-all duration-300
            shadow-lg shadow-black/5
            hover:shadow-xl hover:shadow-black/10
            ${error ? "border-red-500/50 dark:border-red-400/50" : ""}
            ${className}
          `}
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(e.target.value.length > 0);
          }}
          onChange={handleChange}
          {...props}
        />

        {/* Floating Label */}
        <label
          className={`
            absolute left-4 ${icon ? "left-12" : ""}
            transition-all duration-300 pointer-events-none
            ${
              isFocused || hasValue || props.value
                ? "-top-3 text-xs bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent font-semibold px-2"
                : "top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            }
          `}
        >
          {label}
        </label>

        {/* Password Toggle */}
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400 animate-fadeIn flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Glass reflection effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";

export default GlassInput;
