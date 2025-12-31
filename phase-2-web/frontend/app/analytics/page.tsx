"use client";

/**
 * Analytics Page
 * Productivity insights and task statistics
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Task } from "@/lib/types";
import { FullPageLoading } from "@/components/ui/Loading";
import CompleteNavbar from "@/components/CompleteNavbar";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function AnalyticsPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await api.getTasks();
      setTasks(response.items);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/analytics");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return <FullPageLoading message="Loading..." />;
  }

  if (!user) {
    return null;
  }

  // Calculate analytics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority breakdown
  const highPriority = tasks.filter((t) => t.priority === "high").length;
  const mediumPriority = tasks.filter((t) => t.priority === "medium").length;
  const lowPriority = tasks.filter((t) => t.priority === "low").length;

  // Status percentages
  const completedPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const inProgressPercent = totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0;
  const pendingPercent = totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <CompleteNavbar user={user} onLogout={handleLogout} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics & Insights
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your productivity and understand your work patterns
            </p>
          </div>

          {loading ? (
            <Card variant="default" className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading analytics...</p>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Overview Stats */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card variant="gradient" className="text-center animate-fadeIn">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalTasks}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
                  </Card>

                  <Card variant="default" className="text-center animate-fadeIn" style={{ animationDelay: "0.1s" }}>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{completedTasks}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  </Card>

                  <Card variant="default" className="text-center animate-fadeIn" style={{ animationDelay: "0.2s" }}>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{inProgressTasks}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                  </Card>

                  <Card variant="default" className="text-center animate-fadeIn" style={{ animationDelay: "0.3s" }}>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">{pendingTasks}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  </Card>
                </div>
              </div>

              {/* Completion Rate */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Completion Rate
                </h2>
                <Card variant="gradient">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {completionRate}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        of all tasks completed
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={completionRate >= 75 ? "success" : completionRate >= 50 ? "warning" : "default"} size="lg">
                        {completionRate >= 75 ? "Excellent" : completionRate >= 50 ? "Good" : "Keep Going"}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className="h-full bg-gradient-to-r from-green-600 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </Card>
              </div>

              {/* Status Breakdown */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Status Breakdown
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card variant="default">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completed</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">{completedPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="h-full bg-green-600 rounded-full" style={{ width: `${completedPercent}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{completedTasks} tasks</p>
                  </Card>

                  <Card variant="default">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">In Progress</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{inProgressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${inProgressPercent}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{inProgressTasks} tasks</p>
                  </Card>

                  <Card variant="default">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pending</span>
                      <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{pendingPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="h-full bg-orange-600 rounded-full" style={{ width: `${pendingPercent}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{pendingTasks} tasks</p>
                  </Card>
                </div>
              </div>

              {/* Priority Distribution */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Priority Distribution
                </h2>
                <Card variant="default">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Badge variant="error">High</Badge>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="h-full bg-red-600 rounded-full transition-all duration-500"
                            style={{ width: `${totalTasks > 0 ? (highPriority / totalTasks) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white ml-4">{highPriority}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Badge variant="warning">Medium</Badge>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="h-full bg-yellow-600 rounded-full transition-all duration-500"
                            style={{ width: `${totalTasks > 0 ? (mediumPriority / totalTasks) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white ml-4">{mediumPriority}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Badge variant="success">Low</Badge>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="h-full bg-green-600 rounded-full transition-all duration-500"
                            style={{ width: `${totalTasks > 0 ? (lowPriority / totalTasks) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white ml-4">{lowPriority}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Insights */}
              <Card variant="gradient">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Productivity Insights
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {completionRate >= 75 && <li>• Excellent work! You're completing tasks at a great rate.</li>}
                      {completionRate < 50 && <li>• Focus on completing existing tasks before adding new ones.</li>}
                      {highPriority > 5 && <li>• You have many high-priority tasks. Consider tackling them first.</li>}
                      {inProgressTasks > 10 && <li>• Try to limit work-in-progress items for better focus.</li>}
                      {totalTasks === 0 && <li>• Create some tasks to start tracking your productivity!</li>}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
