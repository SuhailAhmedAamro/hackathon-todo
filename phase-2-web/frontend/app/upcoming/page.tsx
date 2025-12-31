"use client";

/**
 * Upcoming Page
 * View upcoming tasks and future planning
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Task, Tag } from "@/lib/types";
import { FullPageLoading } from "@/components/ui/Loading";
import CompleteNavbar from "@/components/CompleteNavbar";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function UpcomingPage() {
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
      // Filter for non-completed tasks
      const upcomingTasks = response.items.filter(
        (t) => t.status !== "completed"
      );
      setTasks(upcomingTasks);
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
      router.push("/auth/login?redirect=/upcoming");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return <FullPageLoading message="Loading..." />;
  }

  if (!user) {
    return null;
  }

  // Group tasks by priority
  const highPriority = tasks.filter((t) => t.priority === "high");
  const mediumPriority = tasks.filter((t) => t.priority === "medium");
  const lowPriority = tasks.filter((t) => t.priority === "low");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <CompleteNavbar user={user} onLogout={handleLogout} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Upcoming Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Plan ahead and stay organized with your upcoming work
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card variant="default" className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Upcoming</p>
            </Card>
            <Card variant="default" className="text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{highPriority.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">High Priority</p>
            </Card>
            <Card variant="default" className="text-center">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{mediumPriority.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Medium Priority</p>
            </Card>
            <Card variant="default" className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{lowPriority.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Low Priority</p>
            </Card>
          </div>

          {/* Tasks by Priority */}
          {loading ? (
            <Card variant="default" className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading upcoming tasks...</p>
            </Card>
          ) : tasks.length === 0 ? (
            <Card variant="gradient" className="text-center py-16">
              <svg
                className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4"
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                All caught up!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You have no upcoming tasks. Great job!
              </p>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* High Priority */}
              {highPriority.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      High Priority
                    </h2>
                    <Badge variant="error">{highPriority.length}</Badge>
                  </div>
                  <div className="grid gap-4">
                    {highPriority.map((task) => (
                      <Card key={task.id} variant="bordered" hover className="cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <Badge variant="error" size="sm">
                                {task.priority}
                              </Badge>
                              <Badge
                                variant={task.status === "in_progress" ? "info" : "default"}
                                size="sm"
                              >
                                {task.status.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Medium Priority */}
              {mediumPriority.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Medium Priority
                    </h2>
                    <Badge variant="warning">{mediumPriority.length}</Badge>
                  </div>
                  <div className="grid gap-4">
                    {mediumPriority.map((task) => (
                      <Card key={task.id} variant="bordered" hover className="cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <Badge variant="warning" size="sm">
                                {task.priority}
                              </Badge>
                              <Badge
                                variant={task.status === "in_progress" ? "info" : "default"}
                                size="sm"
                              >
                                {task.status.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Low Priority */}
              {lowPriority.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Low Priority
                    </h2>
                    <Badge variant="success">{lowPriority.length}</Badge>
                  </div>
                  <div className="grid gap-4">
                    {lowPriority.map((task) => (
                      <Card key={task.id} variant="bordered" hover className="cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <Badge variant="success" size="sm">
                                {task.priority}
                              </Badge>
                              <Badge
                                variant={task.status === "in_progress" ? "info" : "default"}
                                size="sm"
                              >
                                {task.status.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
