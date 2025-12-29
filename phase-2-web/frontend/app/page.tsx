"use client";

/**
 * Home/Landing Page
 * Redirects to dashboard if authenticated, otherwise to login
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state while determining auth status
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
        <h1 className="mt-6 text-2xl font-semibold text-gray-900">
          Hackathon II - Phase 2
        </h1>
        <p className="mt-2 text-gray-600">Todo Web Application</p>
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
