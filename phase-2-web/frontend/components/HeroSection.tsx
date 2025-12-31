/**
 * HeroSection Component
 * Motivational dashboard entry with productivity focus
 */

"use client";

import { useState, useEffect } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";

interface HeroSectionProps {
  username: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  onStartFocusMode?: () => void;
  onAddTask?: () => void;
}

export default function HeroSection({
  username,
  totalTasks,
  completedTasks,
  pendingTasks,
  onStartFocusMode,
  onAddTask,
}: HeroSectionProps) {
  const [greeting, setGreeting] = useState("");
  const [focusMessage, setFocusMessage] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();

    // Personalized greeting
    if (hour < 12) {
      setGreeting("Good Morning");
      setFocusMessage("Start your day with focus and intention");
    } else if (hour < 17) {
      setGreeting("Good Afternoon");
      setFocusMessage("Keep the momentum going strong");
    } else if (hour < 21) {
      setGreeting("Good Evening");
      setFocusMessage("Finish strong and prepare for tomorrow");
    } else {
      setGreeting("Good Night");
      setFocusMessage("Reflect on today's accomplishments");
    }
  }, []);

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl border border-blue-100 dark:border-gray-700 animate-fadeIn">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl"></div>

      <div className="relative px-8 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Greeting */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              {greeting}, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{username}</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
              {focusMessage}
            </p>
          </div>

          {/* Task Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Total Tasks */}
            <Card variant="default" className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalTasks}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Tasks</p>
              </div>
            </Card>

            {/* Completed */}
            <Card variant="default" className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{completedTasks}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Completed</p>
              </div>
            </Card>

            {/* Pending */}
            <Card variant="default" className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">{pendingTasks}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Pending</p>
              </div>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Today's Progress
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {completionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionRate}%` }}
              >
                <div className="h-full w-full animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onStartFocusMode}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            >
              Start Focus Mode
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onAddTask}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Add New Task
            </Button>
          </div>

          {/* Motivational Quote */}
          {completionRate === 100 && totalTasks > 0 && (
            <div className="mt-6 text-center animate-bounceIn">
              <p className="text-lg font-semibold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                🎉 Amazing! You've completed all your tasks today!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
