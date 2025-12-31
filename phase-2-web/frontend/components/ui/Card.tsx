/**
 * Card Component
 * Reusable card container with variants
 */

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "bordered" | "elevated" | "gradient";
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = "default",
  className = "",
  hover = false,
  onClick,
}: CardProps) {
  const baseStyles = "rounded-xl p-6 transition-all duration-300";

  const variants = {
    default: "bg-white dark:bg-gray-800 shadow-sm",
    bordered:
      "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700",
    elevated: "bg-white dark:bg-gray-800 shadow-lg",
    gradient:
      "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-purple-900",
  };

  const hoverStyles = hover
    ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl"
    : "";

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
