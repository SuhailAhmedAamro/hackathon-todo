"use client";

/**
 * Profile Page
 * User account details and information
 */

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { FullPageLoading } from "@/components/ui/Loading";
import CompleteNavbar from "@/components/CompleteNavbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Load profile picture from localStorage
  useEffect(() => {
    if (user) {
      const savedPic = localStorage.getItem(`profile_pic_${user.id}`);
      if (savedPic) {
        setProfilePic(savedPic);
      }
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePic(base64String);
        localStorage.setItem(`profile_pic_${user?.id}`, base64String);
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfilePic(null);
    localStorage.removeItem(`profile_pic_${user?.id}`);
    toast.success("Profile picture removed");
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/profile");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return <FullPageLoading message="Loading..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <CompleteNavbar user={user} onLogout={handleLogout} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Account details and information
            </p>
          </div>

          {/* Profile Card */}
          <Card variant="default">
            <div className="flex items-center gap-4 mb-6">
              {/* Profile Picture or Initial */}
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover shadow-lg ring-2 ring-blue-500 dark:ring-blue-400"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.username}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-all duration-200 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {profilePic ? "Change Picture" : "Upload Picture"}
                  </button>
                  {profilePic && (
                    <button
                      onClick={handleRemoveImage}
                      className="text-sm text-red-600 dark:text-red-400 hover:underline transition-all duration-200 hover:text-red-700 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Username
                </label>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.username}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Email
                </label>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </label>
                {user.is_active ? (
                  <Badge variant="success" dot>
                    Active
                  </Badge>
                ) : (
                  <Badge variant="error" dot>
                    Inactive
                  </Badge>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Member Since
                </label>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            DEVELOPED BY <span className="font-semibold text-gray-900 dark:text-white">@ SUHAIL AHMED AAMRO</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
