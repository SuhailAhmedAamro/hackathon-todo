/**
 * Footer Component
 * Displays app information and developer credits
 */

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* App Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              HACKATHON II - PHASE 2
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              TODO APP
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Modern task management with tags & dark mode
            </p>
          </div>

          {/* Developer Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Developed By
            </h4>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              Suhail Ahmed
            </p>
            <a
              href="mailto:suhailahmedaamro786@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
            >
              <svg
                className="w-4 h-4 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              suhailahmedaamro786@gmail.com
            </a>
          </div>

          {/* Copyright */}
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-end gap-2 text-gray-600 dark:text-gray-400">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">2025 - All Rights Reserved</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Built with Next.js, FastAPI & PostgreSQL
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-xs text-gray-500 dark:text-gray-500">
            Hackathon II - Phase 2: Multi-user Todo Application with JWT Authentication, Tags System & Dark Mode
          </p>
        </div>
      </div>
    </footer>
  );
}
