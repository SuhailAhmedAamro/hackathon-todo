"use client";

/**
 * Reset Password Content Component
 * Handles password reset with token validation
 */

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import Footer from "@/components/Footer";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ============================================================================
// PASSWORD STRENGTH INDICATOR
// ============================================================================

function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    if (password.length === 0) return { strength: 0, label: "", gradient: "" };
    if (password.length < 8) return { strength: 1, label: "Weak", gradient: "from-red-500 to-red-600" };

    let strength = 1;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength === 2) return { strength: 2, label: "Fair", gradient: "from-yellow-500 to-orange-500" };
    if (strength === 3) return { strength: 3, label: "Good", gradient: "from-blue-500 to-blue-600" };
    if (strength >= 4) return { strength: 4, label: "Strong", gradient: "from-green-500 to-emerald-600" };

    return { strength: 1, label: "Weak", gradient: "from-red-500 to-red-600" };
  };

  const { strength, label, gradient } = getStrength();

  if (password.length === 0) return null;

  const getEmoji = () => {
    if (strength === 1) return "😟";
    if (strength === 2) return "😐";
    if (strength === 3) return "🙂";
    return "😄";
  };

  return (
    <div className="mt-3 p-3 bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Password Strength</span>
        <span
          className={`text-xs font-bold flex items-center gap-1.5 ${
            strength === 1
              ? "text-red-600 dark:text-red-400"
              : strength === 2
              ? "text-yellow-600 dark:text-yellow-400"
              : strength === 3
              ? "text-blue-600 dark:text-blue-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          <span>{getEmoji()}</span>
          {label}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500 ease-out shadow-lg`}
          style={{ width: `${(strength / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// RESET PASSWORD CONTENT
// ============================================================================

export default function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const watchedPassword = watch("password", "");

  // Validate token on mount
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");

    if (!tokenFromUrl) {
      setTokenError("Invalid reset link. Please request a new password reset.");
      setIsValidatingToken(false);
      return;
    }

    // Simulate token validation (replace with actual API call)
    const validateToken = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // TODO: Implement actual token validation
        // const response = await api.validateResetToken(tokenFromUrl);

        setToken(tokenFromUrl);
        setIsValidatingToken(false);
      } catch (err) {
        setTokenError("This reset link has expired or is invalid. Please request a new one.");
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call (replace with actual API endpoint)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Implement actual password reset API call
      // const response = await api.resetPassword(token, data.password);

      setIsSuccess(true);
    } catch (err) {
      setError("Failed to reset password. Please try again or request a new reset link.");
      console.error("Password reset error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while validating token
  if (isValidatingToken) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20" />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-center">
            <div className="inline-block p-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Validating reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Token error state
  if (tokenError) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-red-500/20 dark:bg-red-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-orange-500/20 dark:bg-orange-500/10 rounded-full blur-3xl animate-float" />
        </div>

        <div className="flex-1 flex items-center justify-center py-12 px-4 relative z-10">
          <ThemeToggle />

          <div className="max-w-md w-full space-y-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50">
            <div className="text-center space-y-4">
              {/* Error Icon */}
              <div className="inline-block p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Invalid Reset Link
              </h2>

              <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
                {tokenError}
              </p>

              <div className="pt-6 space-y-3">
                <GlassButton
                  variant="primary"
                  onClick={() => router.push("/auth/forgot-password")}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  }
                >
                  Request New Reset Link
                </GlassButton>

                <Link
                  href="/auth/login"
                  className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-500/30 dark:bg-indigo-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-500/20 dark:bg-fuchsia-500/5 rounded-full blur-3xl animate-pulse-slow" />
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
                <div className="inline-block p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Reset Password
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
                  Choose a strong password for your account
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
                  {/* New Password */}
                  <div>
                    <GlassInput
                      {...register("password")}
                      label="New Password"
                      type="password"
                      autoComplete="new-password"
                      error={errors.password?.message}
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      }
                    />
                    <PasswordStrength password={watchedPassword} />
                  </div>

                  {/* Confirm Password */}
                  <GlassInput
                    {...register("confirmPassword")}
                    label="Confirm New Password"
                    type="password"
                    autoComplete="new-password"
                    error={errors.confirmPassword?.message}
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  />
                </div>

                {/* Submit Button */}
                <GlassButton type="submit" variant="primary" isLoading={isLoading} loadingText="Resetting password...">
                  Reset Password
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
              <div className="inline-block p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-lg animate-bounceIn">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Success Message */}
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Password Reset! 🎉
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
              </div>

              {/* Success Tips */}
              <div className="bg-green-500/10 backdrop-blur-xl border border-green-500/20 p-4 rounded-2xl text-left">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-2">
                  ✅ Security Tips
                </p>
                <ul className="text-xs text-green-600 dark:text-green-400 space-y-1.5 ml-4">
                  <li>• Use a unique password for this account</li>
                  <li>• Don't share your password with anyone</li>
                  <li>• Consider using a password manager</li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <GlassButton
                  variant="primary"
                  onClick={() => router.push("/auth/login")}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  }
                >
                  Sign In Now
                </GlassButton>
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
