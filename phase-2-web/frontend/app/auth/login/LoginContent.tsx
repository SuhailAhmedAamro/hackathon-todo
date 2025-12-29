"use client";

/**
 * Login Content Component
 * Contains the actual login form logic with useSearchParams
 */

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";
import { ButtonLoading } from "@/components/ui/Loading";
import Footer from "@/components/Footer";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const loginSchema = z.object({
  username_or_email: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// LOGIN CONTENT COMPONENT
// ============================================================================

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, error: authError, clearError, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    }
  }, [loading, user, router, searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    clearError();

    try {
      await login(data);
      // Redirect will happen via useEffect after user is set
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    } catch (error) {
      // Error is handled by auth context
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-300">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {authError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fadeIn">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{authError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Username or Email */}
            <div>
              <label
                htmlFor="username_or_email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Username or Email
              </label>
              <input
                {...register("username_or_email")}
                id="username_or_email"
                type="text"
                autoComplete="username"
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.username_or_email
                    ? "border-red-300 dark:border-red-600"
                    : "border-gray-300 dark:border-gray-600"
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition duration-200`}
                placeholder="Enter username or email"
              />
              {errors.username_or_email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.username_or_email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Password
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                autoComplete="current-password"
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.password ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition duration-200`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? <ButtonLoading message="Signing in..." /> : "Sign In"}
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </form>
      </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
