/**
 * Loading Components
 * Reusable loading spinners and skeletons
 */

// ============================================================================
// SPINNER COMPONENT
// ============================================================================

export function Spinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-blue-600 dark:border-blue-400 ${sizeClasses[size]} ${className}`}></div>
  );
}

// ============================================================================
// FULL PAGE LOADING
// ============================================================================

export function FullPageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}

// ============================================================================
// INLINE LOADING
// ============================================================================

export function InlineLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <Spinner size="md" className="mr-3" />
      <span className="text-gray-600 dark:text-gray-300">{message}</span>
    </div>
  );
}

// ============================================================================
// BUTTON LOADING
// ============================================================================

export function ButtonLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <span className="flex items-center">
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {message}
    </span>
  );
}

// ============================================================================
// SKELETON LOADERS
// ============================================================================

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" style={{ width: `${100 - i * 10}%` }}></div>
      ))}
    </div>
  );
}

export default Spinner;
