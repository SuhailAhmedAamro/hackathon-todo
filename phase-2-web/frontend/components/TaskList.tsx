"use client";

import { useEffect, useState, useCallback } from "react";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  due_date?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

interface TaskListProps {
  refreshTrigger: number;
}

export default function TaskList({ refreshTrigger }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = filter === "all"
        ? "http://localhost:8000/api/tasks"
        : `http://localhost:8000/api/tasks?status=${filter}`;

      const response = await fetch(url);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger, filter, fetchTasks]);

  const handleComplete = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}/complete`, {
        method: "PATCH",
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok || response.status === 204) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Tasks</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md ${
              filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-md ${
              filter === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("in_progress")}
            className={`px-4 py-2 rounded-md ${
              filter === "in_progress" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-md ${
              filter === "completed" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No tasks found.</p>
          <p className="text-gray-400 mt-2">Add a task above to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${
                task.status === "completed"
                  ? "border-green-500 opacity-75"
                  : task.priority === "high"
                  ? "border-red-500"
                  : task.priority === "medium"
                  ? "border-yellow-500"
                  : "border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      task.status === "completed" ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-gray-600 mb-3">{task.description}</p>
                  )}

                  <div className="flex gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>

                  {task.due_date && (
                    <p className="text-sm text-gray-500">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {task.status !== "completed" && (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
