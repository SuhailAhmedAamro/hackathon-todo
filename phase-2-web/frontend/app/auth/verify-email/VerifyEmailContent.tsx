"use client";

/**
 * Email Verification Content Component
 * Handles email verification with token validation
 */

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import GlassButton from "@/components/ui/GlassButton";
import Footer from "@/components/Footer";

// ============================================================================
// VERIFY EMAIL CONTENT
// ============================================================================

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  // Verify email on mount
  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const emailParam = searchParams.get("email");

      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }

      if (!token) {
        setError("Invalid verification link. Please check your email and try again.");
        setIsVerifying(false);
        return;
      }

      try {
        // Simulate API call (replace with actual API endpoint)
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // TODO: Implement actual email verification API call
        // const response = await api.verifyEmail(token);

        setIsSuccess(true);
        setIsVerifying(false);
      } catch (err) {
        setError("This verification link has expired or is invalid. Please request a new verification email.");
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleResendVerification = async () => {
    // TODO: Implement resend verification email
    console.log("Resending verification email to:", email);
  };

  // Verifying state
  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-500/30 dark:bg-indigo-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center py-12 px-4 relative z-10">
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>

          <div className="max-w-md w-full space-y-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 animate-scaleIn">
            <div className="text-center space-y-6">
              {/* Animated Mail Icon */}
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-lg">
                  <svg className="w-16 h-16 text-white animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Verifying Your Email
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
                  Please wait while we verify your email address...
                </p>
              </div>

              {/* Loading Dots */}
              <div className="flex justify-center gap-2 pt-4">
                <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-3 h-3 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-green-500/30 dark:bg-green-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-emerald-500/30 dark:bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/20 dark:bg-teal-500/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center py-12 px-4 relative z-10">
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>

          <div className="max-w-md w-full space-y-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 animate-scaleIn">
            <div className="text-center space-y-6 py-4">
              {/* Success Icon with Confetti Effect */}
              <div className="inline-block relative">
                {/* Confetti particles */}
                <div className="absolute -top-4 -left-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -top-2 -right-4 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
                <div className="absolute -bottom-4 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: "0.4s" }}></div>
                <div className="absolute -bottom-2 -right-3 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: "0.1s" }}></div>

                <div className="p-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-2xl animate-bounceIn">
                  <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    Email Verified! 🎉
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Your account is now active
                  </p>
                </div>

                {email && (
                  <div className="inline-block px-4 py-2 bg-green-500/10 backdrop-blur-xl border border-green-500/20 rounded-full">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                      ✓ {email}
                    </p>
                  </div>
                )}

                <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                  Welcome aboard! You can now access all features of your account.
                </p>
              </div>

              {/* Benefits List */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 dark:border-green-500/30 p-5 rounded-2xl text-left">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  You now have access to:
                </p>
                <ul className="space-y-2 text-sm text-green-600 dark:text-green-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Full task management dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Advanced productivity analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Customizable categories and tags</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Focus mode and streak tracking</span>
                  </li>
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
                  Sign In to Your Account
                </GlassButton>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your email verification was successful and secure
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-red-500/30 dark:bg-red-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-orange-500/30 dark:bg-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/20 dark:bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 relative z-10">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="max-w-md w-full space-y-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 animate-scaleIn">
          <div className="text-center space-y-6">
            {/* Error Icon */}
            <div className="inline-block">
              <div className="p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-lg animate-wiggle">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Verification Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
                {error}
              </p>
            </div>

            {/* Help Tips */}
            <div className="bg-orange-500/10 backdrop-blur-xl border border-orange-500/20 p-4 rounded-2xl text-left">
              <p className="text-sm text-orange-700 dark:text-orange-300 font-medium mb-2">
                💡 Common Issues:
              </p>
              <ul className="text-xs text-orange-600 dark:text-orange-400 space-y-1.5 ml-4">
                <li>• The verification link may have expired (valid for 24 hours)</li>
                <li>• The link may have already been used</li>
                <li>• Check that you copied the complete link from your email</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {email && (
                <GlassButton
                  variant="primary"
                  onClick={handleResendVerification}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  }
                >
                  Resend Verification Email
                </GlassButton>
              )}

              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/register"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Create a new account
                </Link>
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
