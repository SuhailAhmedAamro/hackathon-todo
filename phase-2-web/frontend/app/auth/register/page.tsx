"use client";

/**
 * Registration Page - Glassmorphism Design
 * Premium sign-up experience with modern UI
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Invalid email address"),
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

type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================================================
// PASSWORD STRENGTH INDICATOR
// ============================================================================

function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    if (password.length === 0) return { strength: 0, label: "", color: "", gradient: "" };
    if (password.length < 8) return { strength: 1, label: "Weak", color: "bg-red-500", gradient: "from-red-500 to-red-600" };

    let strength = 1;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength === 2) return { strength: 2, label: "Fair", color: "bg-yellow-500", gradient: "from-yellow-500 to-orange-500" };
    if (strength === 3) return { strength: 3, label: "Good", color: "bg-blue-500", gradient: "from-blue-500 to-blue-600" };
    if (strength >= 4) return { strength: 4, label: "Strong", color: "bg-green-500", gradient: "from-green-500 to-emerald-600" };

    return { strength: 1, label: "Weak", color: "bg-red-500", gradient: "from-red-500 to-red-600" };
  };

  const { strength, label, color, gradient } = getStrength();

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
        <span className={`text-xs font-bold flex items-center gap-1.5 ${
          strength === 1 ? "text-red-600 dark:text-red-400" :
          strength === 2 ? "text-yellow-600 dark:text-yellow-400" :
          strength === 3 ? "text-blue-600 dark:text-blue-400" :
          "text-green-600 dark:text-green-400"
        }`}>
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
// REGISTER PAGE COMPONENT
// ============================================================================

export default function RegisterPage() {
  const router = useRouter();
  const { user, register: registerUser, error: authError, clearError, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Watch password for strength indicator
  const watchedPassword = watch("password", "");

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    clearError();

    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      router.push("/dashboard");
    } catch (error) {
      // Error is handled by auth context
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-purple-500/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 -left-48 w-96 h-96 bg-blue-500/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-cyan-500/20 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" />
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
            <div className="inline-block p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Start your productivity journey today</p>
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

          {/* Registration Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              {/* Username */}
              <GlassInput
                {...register("username")}
                label="Username"
                type="text"
                autoComplete="username"
                error={errors.username?.message}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              {/* Email */}
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

              {/* Password */}
              <div>
                <GlassInput
                  {...register("password")}
                  label="Password"
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
                label="Confirm Password"
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
            <GlassButton type="submit" variant="primary" isLoading={isLoading} loadingText="Creating account...">
              Create Account
            </GlassButton>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  Sign in instead
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
