"use client";

/**
 * Login Content Component - Glassmorphism Design
 * Premium authentication experience with modern UI
 */

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import Footer from "@/components/Footer";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const loginSchema = z.object({
  username_or_email: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 dark:bg-pink-500/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Theme Toggle - Fixed Position */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* Glassmorphism Card */}
        <div className="max-w-md w-full space-y-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 animate-scaleIn">
          {/* Header */}
          <div className="text-center space-y-2">
            {/* Logo */}
            <div className="inline-block p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Sign in to continue your productivity journey</p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 p-4 rounded-2xl animate-fadeIn">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">{authError}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              {/* Email Input */}
              <GlassInput
                {...register("username_or_email")}
                label="Email or Username"
                type="text"
                autoComplete="username"
                error={errors.username_or_email?.message}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              {/* Password Input */}
              <GlassInput
                {...register("password")}
                label="Password"
                type="password"
                autoComplete="current-password"
                error={errors.password?.message}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  {...register("rememberMe")}
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl transition-all duration-200"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <GlassButton type="submit" variant="primary" isLoading={isLoading} loadingText="Signing in...">
              Sign In
            </GlassButton>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
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
