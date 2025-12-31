"use client";

/**
 * Settings Page - Glassmorphism Design
 * Premium account settings and preferences
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { FullPageLoading } from "@/components/ui/Loading";
import CompleteNavbar from "@/components/CompleteNavbar";
import Footer from "@/components/Footer";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import toast from "react-hot-toast";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// ============================================================================
// SETTINGS SECTIONS
// ============================================================================

function ProfileSection({ user, onUpdate }: any) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // TODO: Implement API call
      // await api.updateProfile(data);
      toast.success("Profile updated successfully!");
      onUpdate?.(data);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-xl animate-slideUp">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Update your personal details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <GlassInput
          {...register("username")}
          label="Username"
          type="text"
          error={errors.username?.message}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />

        <GlassInput
          {...register("email")}
          label="Email Address"
          type="email"
          error={errors.email?.message}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        <GlassButton type="submit" variant="primary" isLoading={isLoading} loadingText="Updating...">
          Save Changes
        </GlassButton>
      </form>
    </div>
  );
}

function PasswordSection() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      await api.changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      });
      toast.success("Password changed successfully!");
      reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-xl animate-slideUp" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Update your password regularly for security</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <GlassInput
          {...register("currentPassword")}
          label="Current Password"
          type="password"
          error={errors.currentPassword?.message}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          }
        />

        <GlassInput
          {...register("newPassword")}
          label="New Password"
          type="password"
          error={errors.newPassword?.message}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />

        <GlassInput
          {...register("confirmPassword")}
          label="Confirm New Password"
          type="password"
          error={errors.confirmPassword?.message}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <GlassButton type="submit" variant="primary" isLoading={isLoading} loadingText="Changing...">
          Change Password
        </GlassButton>
      </form>
    </div>
  );
}

function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-xl animate-slideUp" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appearance</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Customize your visual experience</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Light Theme */}
        <button
          onClick={() => setTheme("light")}
          className={`p-6 rounded-2xl border-2 transition-all duration-300 group ${
            theme === "light"
              ? "border-yellow-500 bg-yellow-500/10"
              : "border-white/20 dark:border-gray-700/50 hover:border-yellow-500/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`p-3 rounded-xl ${theme === "light" ? "bg-yellow-500" : "bg-yellow-500/20"} group-hover:bg-yellow-500 transition-colors`}>
              <svg className={`w-8 h-8 ${theme === "light" ? "text-white" : "text-yellow-500"} group-hover:text-white transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className={`font-semibold ${theme === "light" ? "text-yellow-600 dark:text-yellow-400" : "text-gray-700 dark:text-gray-300"}`}>
              Light
            </span>
          </div>
        </button>

        {/* Dark Theme */}
        <button
          onClick={() => setTheme("dark")}
          className={`p-6 rounded-2xl border-2 transition-all duration-300 group ${
            theme === "dark"
              ? "border-blue-500 bg-blue-500/10"
              : "border-white/20 dark:border-gray-700/50 hover:border-blue-500/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-blue-500" : "bg-blue-500/20"} group-hover:bg-blue-500 transition-colors`}>
              <svg className={`w-8 h-8 ${theme === "dark" ? "text-white" : "text-blue-500"} group-hover:text-white transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <span className={`font-semibold ${theme === "dark" ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
              Dark
            </span>
          </div>
        </button>

        {/* System Theme */}
        <button
          onClick={() => setTheme("system")}
          className={`p-6 rounded-2xl border-2 transition-all duration-300 group ${
            theme === "system"
              ? "border-purple-500 bg-purple-500/10"
              : "border-white/20 dark:border-gray-700/50 hover:border-purple-500/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`p-3 rounded-xl ${theme === "system" ? "bg-purple-500" : "bg-purple-500/20"} group-hover:bg-purple-500 transition-colors`}>
              <svg className={`w-8 h-8 ${theme === "system" ? "text-white" : "text-purple-500"} group-hover:text-white transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className={`font-semibold ${theme === "system" ? "text-purple-600 dark:text-purple-400" : "text-gray-700 dark:text-gray-300"}`}>
              System
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

function PreferencesSection() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Implement API call
      // await api.updatePreferences({ emailNotifications, taskReminders, weeklyDigest });
      toast.success("Preferences saved!");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-xl animate-slideUp" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage how you receive updates</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Email Notifications */}
        <label className="flex items-center justify-between p-4 bg-white/20 dark:bg-gray-700/20 rounded-2xl cursor-pointer group hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {/* Task Reminders */}
        <label className="flex items-center justify-between p-4 bg-white/20 dark:bg-gray-700/20 rounded-2xl cursor-pointer group hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Task Reminders</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get reminded about upcoming tasks</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={taskReminders}
            onChange={(e) => setTaskReminders(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-2 focus:ring-purple-500"
          />
        </label>

        {/* Weekly Digest */}
        <label className="flex items-center justify-between p-4 bg-white/20 dark:bg-gray-700/20 rounded-2xl cursor-pointer group hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Weekly Digest</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive weekly productivity summary</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={weeklyDigest}
            onChange={(e) => setWeeklyDigest(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
          />
        </label>
      </div>

      <GlassButton onClick={handleSavePreferences} variant="primary" isLoading={isSaving} loadingText="Saving...">
        Save Preferences
      </GlassButton>
    </div>
  );
}

function DangerZoneSection() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    // TODO: Implement account deletion
    toast.error("Account deletion not yet implemented");
  };

  return (
    <div className="space-y-6 bg-red-500/10 dark:bg-red-900/20 backdrop-blur-2xl p-6 rounded-3xl border border-red-500/30 dark:border-red-500/50 shadow-xl animate-slideUp" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
          <p className="text-sm text-red-600/80 dark:text-red-400/80">Irreversible actions</p>
        </div>
      </div>

      <div className="p-4 bg-white/20 dark:bg-gray-800/20 rounded-2xl border border-red-500/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Delete Account</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors whitespace-nowrap shadow-md"
            >
              Delete
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-md"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors shadow-md"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN SETTINGS PAGE
// ============================================================================

export default function SettingsPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/settings");
    }
  }, [loading, user, router]);

  if (loading) {
    return <FullPageLoading message="Loading settings..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-pink-500/15 dark:bg-pink-500/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Navbar */}
      <CompleteNavbar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Customize your app appearance
            </p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            <AppearanceSection />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
