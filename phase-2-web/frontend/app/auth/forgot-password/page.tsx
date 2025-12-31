"use client";

/**
 * Forgot Password Page - Glassmorphism Design
 * Premium password recovery experience
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import Footer from "@/components/Footer";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ============================================================================
// FORGOT PASSWORD PAGE
// ============================================================================

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call (replace with actual API endpoint)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Implement actual password reset API call
      // const response = await api.forgotPassword(data.email);

      setIsSuccess(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
      console.error("Password reset error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-teal-900/20 dark:to-cyan-900/20">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/30 dark:bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-teal-500/30 dark:bg-teal-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Theme Toggle - Fixed Position */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* Glassmorphism Card */}
        <div className="max-w-md w-full space-y-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 animate-scaleIn">
          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                {/* Icon */}
                <div className="inline-block p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Forgot Password?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
                  No worries! Enter your email and we'll send you a reset link
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 p-4 rounded-2xl animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-5">
                  {/* Email Input */}
                  <GlassInput
                    {...register("email")}
                    label="Email Address"
                    type="email"
                    autoComplete="email"
                    error={errors.email?.message}
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                </div>

                {/* Submit Button */}
                <GlassButton type="submit" variant="primary" isLoading={isLoading} loadingText="Sending reset link...">
                  Send Reset Link
                </GlassButton>

                {/* Back to Login */}
                <div className="text-center pt-4">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                  >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center space-y-6 py-8">
              {/* Success Icon */}
              <div className="inline-block p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full shadow-lg animate-bounceIn">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                </svg>
              </div>

              {/* Success Message */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Check Your Email! 📧
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    We've sent a password reset link to:
                  </p>
                  <p className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                    {getValues("email")}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
              </div>

              {/* Email Tips */}
              <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 p-4 rounded-2xl text-left">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
                  📌 Didn't receive the email?
                </p>
                <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1.5 ml-4">
                  <li>• Check your spam or junk folder</li>
                  <li>• Make sure the email address is correct</li>
                  <li>• Wait a few minutes and check again</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <GlassButton
                  variant="primary"
                  onClick={() => router.push("/auth/login")}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  }
                >
                  Back to Sign In
                </GlassButton>

                <button
                  onClick={() => setIsSuccess(false)}
                  className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Resend Email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
