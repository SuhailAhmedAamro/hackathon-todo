/**
 * SessionStats Component
 * Display Pomodoro statistics
 */

"use client";

import { PomodoroStats } from "@/lib/usePomodoro";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

interface SessionStatsProps {
  stats: PomodoroStats;
  sessionCount: number;
}

export default function SessionStats({ stats, sessionCount }: SessionStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Today's Sessions */}
      <Card variant="default" className="text-center animate-fadeIn">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {sessionCount}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Sessions Today</p>
        </div>
      </Card>

      {/* Completed */}
      <Card variant="default" className="text-center animate-fadeIn" style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
            {stats.completedSessions}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
        </div>
      </Card>

      {/* Focus Time */}
      <Card variant="default" className="text-center animate-fadeIn" style={{ animationDelay: "0.2s" }}>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {stats.totalFocusTime}m
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Focus Time</p>
        </div>
      </Card>

      {/* Streak */}
      <Card variant="default" className="text-center animate-fadeIn" style={{ animationDelay: "0.3s" }}>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-orange-600 dark:text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
            {stats.currentStreak}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Streak {stats.longestStreak > 0 && `(Best: ${stats.longestStreak})`}
          </p>
        </div>
      </Card>
    </div>
  );
}
