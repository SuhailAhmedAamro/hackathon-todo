"use client";

/**
 * Tasks Page
 * Main page for managing tasks
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
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

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
      showSuccess(
        updatedTask.status === "completed"
          ? "Task marked as complete!"
          : "Task marked as incomplete"
      );
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
              My Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
            </p>
          </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Form - Left Side */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {showForm ? "New Task" : "Create Task"}
                </h2>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Show form"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {showForm ? (
                <TaskForm
                  onSubmit={handleCreateTask}
                  onCancel={() => setShowForm(false)}
                  availableTags={tags}
                  submitLabel="Create Task"
                  isLoading={creating}
                />
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Click the + button to create a new task
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Task List - Right Side */}
          <div className="lg:col-span-2">
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
    </div>
  );
}
