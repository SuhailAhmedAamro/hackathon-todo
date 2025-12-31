"use client";

/**
 * Tasks Page
 * Premium task management with modern UI
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Task, TaskCreate, Tag, TaskWithTags } from "@/lib/types";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";
import { FullPageLoading } from "@/components/ui/Loading";
import { showSuccess, showError } from "@/lib/toast";
import { celebrateTaskCompletion } from "@/lib/confetti";
import Footer from "@/components/Footer";
import CompleteNavbar from "@/components/CompleteNavbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function TasksPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [taskTags, setTaskTags] = useState<Record<string, Tag[]>>({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Load tasks and tags on mount
  useEffect(() => {
    if (user) {
      loadTasks();
      loadTags();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await api.getTasks();
      setTasks(response.items);

      // Load tags for each task
      const tagsMap: Record<string, Tag[]> = {};
      for (const task of response.items) {
        try {
          const taskWithTags = await api.getTask(task.id);
          tagsMap[task.id] = taskWithTags.tags || [];
        } catch (error) {
          console.error(`Failed to load tags for task ${task.id}:`, error);
          tagsMap[task.id] = [];
        }
      }
      setTaskTags(tagsMap);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      showError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const fetchedTags = await api.getTags();
      setTags(fetchedTags);
    } catch (error) {
      console.error("Failed to load tags:", error);
    }
  };

  const handleCreateTask = async (data: TaskCreate, tagIds: string[]) => {
    try {
      setCreating(true);
      const newTask = await api.createTask(data);

      // Assign tags to the new task
      const assignedTags: Tag[] = [];
      for (const tagId of tagIds) {
        try {
          await api.assignTagToTask(newTask.id, tagId);
          const tag = tags.find((t) => t.id === tagId);
          if (tag) assignedTags.push(tag);
        } catch (error) {
          console.error(`Failed to assign tag ${tagId}:`, error);
        }
      }

      setTasks([newTask, ...tasks]);
      setTaskTags({ ...taskTags, [newTask.id]: assignedTags });
      setShowForm(false);
      showSuccess("Task created successfully!");
    } catch (error) {
      console.error("Failed to create task:", error);
      showError("Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      showSuccess("Task deleted successfully!");
    } catch (error) {
      console.error("Failed to delete task:", error);
      showError("Failed to delete task");
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      const updatedTask = await api.completeTask(taskId);
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));

      if (updatedTask.status === "completed") {
        // Celebrate task completion with confetti and sound!
        celebrateTaskCompletion();
        showSuccess("🎉 Task completed! Great job!");
      } else {
        showSuccess("Task marked as incomplete");
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
      showError("Failed to update task");
    }
  };

  const handleRemoveTag = async (taskId: string, tagId: string) => {
    try {
      await api.removeTagFromTask(taskId, tagId);

      // Update local state
      setTaskTags({
        ...taskTags,
        [taskId]: (taskTags[taskId] || []).filter((t) => t.id !== tagId),
      });

      showSuccess("Tag removed from task");
    } catch (error) {
      console.error("Failed to remove tag:", error);
      showError("Failed to remove tag");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/tasks");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return <FullPageLoading message="Loading..." />;
  }

  if (!user) {
    return null; // Will redirect
  }

  // Calculate stats
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const pendingTasks = tasks.length - completedTasks - inProgressTasks;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Complete Navbar */}
      <CompleteNavbar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header with Stats */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  My Tasks
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage and organize your tasks efficiently
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowForm(true)}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                New Task
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card variant="default" className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Tasks</p>
              </Card>
              <Card variant="default" className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</p>
              </Card>
              <Card variant="default" className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{inProgressTasks}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">In Progress</p>
              </Card>
              <Card variant="default" className="text-center">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{pendingTasks}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</p>
              </Card>
            </div>
          </div>

          {/* Task Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <Card variant="elevated" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Create New Task
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <TaskForm
                  onSubmit={handleCreateTask}
                  onCancel={() => setShowForm(false)}
                  availableTags={tags}
                  submitLabel="Create Task"
                  isLoading={creating}
                />
              </Card>
            </div>
          )}

          {/* Task List */}
          <div className="mt-8">
            <TaskList
              tasks={tasks}
              taskTags={taskTags}
              loading={loading}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
              onRemoveTag={handleRemoveTag}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
