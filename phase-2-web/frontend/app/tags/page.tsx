"use client";

/**
 * Tags Page
 * Manage tags for task categorization
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Tag } from "@/lib/types";
import TagManager from "@/components/tags/TagManager";
import { FullPageLoading } from "@/components/ui/Loading";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function TagsPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tags on mount
  useEffect(() => {
    if (user) {
      loadTags();
    }
  }, [user]);

  const loadTags = async () => {
    try {
      setLoading(true);
      const fetchedTags = await api.getTags();
      setTags(fetchedTags);
    } catch (error) {
      console.error("Failed to load tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/tags");
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
              Tags
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {tags.length} {tags.length === 1 ? "tag" : "tags"} total
            </p>
          </div>

          {/* Tag Manager */}
          <div className="max-w-4xl">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
              </div>
            ) : (
              <TagManager tags={tags} onTagsChange={loadTags} />
            )}

            {/* Info Card */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400 dark:text-blue-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    About Tags
                  </h3>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    Tags help you categorize and organize your tasks. Create tags with custom colors,
                    then assign them to tasks for easy filtering and visual identification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
