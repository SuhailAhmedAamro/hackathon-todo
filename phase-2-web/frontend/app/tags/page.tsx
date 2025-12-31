"use client";

/**
 * Tags Page
 * Premium tag management for task categorization
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Tag } from "@/lib/types";
import TagManager from "@/components/tags/TagManager";
import { FullPageLoading } from "@/components/ui/Loading";
import Footer from "@/components/Footer";
import CompleteNavbar from "@/components/CompleteNavbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <CompleteNavbar user={user} onLogout={handleLogout} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Categories & Tags
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Organize your tasks with custom tags and categories
                </p>
              </div>
              <Badge variant="info" size="lg">
                {tags.length} {tags.length === 1 ? "tag" : "tags"}
              </Badge>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="gradient" className="animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Tags</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{tags.length}</p>
                  </div>
                </div>
              </Card>

              <Card variant="default" className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.min(tags.length, 8)}</p>
                  </div>
                </div>
              </Card>

              <Card variant="default" className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Tags</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{tags.length}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Tag Manager */}
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <Card variant="default" className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading tags...</p>
              </Card>
            ) : (
              <div className="animate-fadeIn">
                <TagManager tags={tags} onTagsChange={loadTags} />
              </div>
            )}
          </div>

          {/* Tips Section */}
          {!loading && tags.length > 0 && (
            <Card variant="gradient" className="max-w-6xl mx-auto mt-8 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Pro Tips for Tag Organization
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Use color-coding to visually distinguish between different categories</li>
                    <li>• Keep tag names short and descriptive for better readability</li>
                    <li>• Create tags for projects, priorities, and contexts to maximize organization</li>
                    <li>• Regularly review and clean up unused tags to keep your system lean</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
