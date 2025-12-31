"use client";

/**
 * Dashboard Page
 * Premium productivity-focused dashboard with modern UI
 */

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Task } from "@/lib/types";
import { FullPageLoading } from "@/components/ui/Loading";
import Footer from "@/components/Footer";
import CompleteNavbar from "@/components/CompleteNavbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  // Load tasks on mount
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      setTasksLoading(true);
      const response = await api.getTasks();
      setTasks(response.items);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setTasksLoading(false);
    }
  };

  // Calculate task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const pendingTasks = totalTasks - completedTasks - inProgressTasks;

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/dashboard");
    }
  }, [loading, user, router]);

  if (loading) {
    return <FullPageLoading message="Loading dashboard..." />;
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Complete Navbar */}
      <CompleteNavbar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:pl-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user.username}!
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card variant="default" className="animate-slideUp hover-lift cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Tasks
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {totalTasks}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card variant="default" className="animate-slideUp hover-lift cursor-pointer" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Completed
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                    {completedTasks}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center animate-bounce-slow">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card variant="default" className="animate-slideUp hover-lift cursor-pointer" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    In Progress
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                    {inProgressTasks}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card variant="default" className="animate-slideUp hover-lift cursor-pointer" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Pending
                  </p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                    {pendingTasks}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity Card */}
          <Card variant="default" className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <Badge variant="info">Today</Badge>
            </div>

            {tasksLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Loading activity...
                </p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3"
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
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  No tasks yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Create your first task to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task, index) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {task.status === "completed" ? (
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
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
                      ) : (
                        <svg
                          className="w-5 h-5 text-gray-400 flex-shrink-0"
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
                      )}
                      <p
                        className={`text-sm truncate ${
                          task.status === "completed"
                            ? "text-gray-500 dark:text-gray-400 line-through"
                            : "text-gray-900 dark:text-white font-medium"
                        }`}
                      >
                        {task.title}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.status === "completed"
                          ? "success"
                          : task.status === "in_progress"
                          ? "info"
                          : "default"
                      }
                      size="sm"
                    >
                      {task.status === "completed"
                        ? "Done"
                        : task.status === "in_progress"
                        ? "Active"
                        : "Todo"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
