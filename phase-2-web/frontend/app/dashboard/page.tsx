"use client";

/**
 * Dashboard Page
 * Main landing page after authentication
 */

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Task } from "@/lib/types";
import { FullPageLoading } from "@/components/ui/Loading";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here&apos;s an overview of your tasks and activity
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover-lift animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Profile
            </h2>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Username:
                </span>
                <p className="text-gray-900 dark:text-white">{user?.username}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email:
                </span>
                <p className="text-gray-900 dark:text-white">{user?.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <p className="text-gray-900 dark:text-white">
                  {user?.is_active ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                      Inactive
                    </span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Member Since:
                </span>
                <p className="text-gray-900 dark:text-white">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-green-500 hover-lift animate-fadeIn" style={{animationDelay: '0.1s'}}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Stats
            </h2>
            {tasksLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Tasks</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalTasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">In Progress</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{inProgressTasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Pending</span>
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{totalTasks - completedTasks - inProgressTasks}</span>
                </div>
              </div>
            )}
          </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
