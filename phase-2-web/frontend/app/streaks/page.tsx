"use client";

/**
 * Streaks Page
 * Track daily habits and productivity streaks
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { FullPageLoading } from "@/components/ui/Loading";
import CompleteNavbar from "@/components/CompleteNavbar";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function StreaksPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  // Mock streak data (in production, this would come from backend)
  const [currentStreak, setCurrentStreak] = useState(7);
  const [longestStreak, setLongestStreak] = useState(14);
  const [totalDaysActive, setTotalDaysActive] = useState(42);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/streaks");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return <FullPageLoading message="Loading..." />;
  }

  if (!user) {
    return null;
  }

  // Generate calendar data for the last 30 days
  const getLast30Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      // Mock activity (random for demo)
      const active = Math.random() > 0.3;
      days.push({ date, active });
    }
    return days;
  };

  const last30Days = getLast30Days();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <CompleteNavbar user={user} onLogout={handleLogout} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Productivity Streaks
              </h1>
              <Badge variant="warning" size="lg">
                🔥 {currentStreak} days
              </Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Build consistent habits and track your daily progress
            </p>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card variant="gradient" className="text-center animate-fadeIn">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{currentStreak}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Current Streak</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">consecutive days</p>
            </Card>

            <Card variant="default" className="text-center animate-fadeIn" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">{longestStreak}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Longest Streak</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">personal best</p>
            </Card>

            <Card variant="default" className="text-center animate-fadeIn" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{totalDaysActive}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Days Active</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">all time</p>
            </Card>
          </div>

          {/* Activity Calendar */}
          <Card variant="default" className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Last 30 Days Activity
            </h2>
            <div className="grid grid-cols-10 gap-2">
              {last30Days.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                      day.active
                        ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                    }`}
                    title={day.date.toLocaleDateString()}
                  />
                  {index % 5 === 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {day.date.getDate()}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">Less</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="w-4 h-4 rounded bg-green-200 dark:bg-green-900/30" />
                <div className="w-4 h-4 rounded bg-green-400 dark:bg-green-700/50" />
                <div className="w-4 h-4 rounded bg-green-500 dark:bg-green-600" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">More</span>
            </div>
          </Card>

          {/* Achievements */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="bordered" className="text-center">
                <div className="text-4xl mb-2">🏆</div>
                <p className="font-semibold text-gray-900 dark:text-white">Week Warrior</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">7-day streak achieved</p>
              </Card>

              <Card variant="bordered" className="text-center opacity-50">
                <div className="text-4xl mb-2 grayscale">🎯</div>
                <p className="font-semibold text-gray-900 dark:text-white">Perfect Month</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">30-day streak (locked)</p>
              </Card>

              <Card variant="bordered" className="text-center opacity-50">
                <div className="text-4xl mb-2 grayscale">💎</div>
                <p className="font-semibold text-gray-900 dark:text-white">Century Club</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">100-day streak (locked)</p>
              </Card>
            </div>
          </div>

          {/* Motivation */}
          <Card variant="gradient">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Keep the Momentum Going!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentStreak >= 7
                    ? "Amazing work! You're on a roll. Keep showing up every day!"
                    : "Build the habit of daily productivity. Start your streak today!"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
