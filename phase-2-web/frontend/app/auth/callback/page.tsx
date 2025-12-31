"use client";

/**
 * OAuth Callback Page
 * Handles OAuth redirect from backend with tokens
 */

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tokenStorage, userStorage } from "@/lib/api";
import { FullPageLoading } from "@/components/ui/Loading";
import toast from "react-hot-toast";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get tokens from URL params
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");
        const provider = searchParams.get("provider");
        const error = searchParams.get("error");

        // Check for errors
        if (error) {
          setStatus("error");
          toast.error(`OAuth login failed: ${error}`);
          setTimeout(() => router.push("/auth/login"), 3000);
          return;
        }

        // Validate tokens
        if (!accessToken || !refreshToken) {
          setStatus("error");
          toast.error("Invalid OAuth response. Please try again.");
          setTimeout(() => router.push("/auth/login"), 3000);
          return;
        }

        // Store tokens
        tokenStorage.set(accessToken, refreshToken);

        // Fetch user data
        const response = await fetch("http://localhost:8000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          userStorage.set(user);

          setStatus("success");
          toast.success(`Welcome ${user.username}! Logged in with ${provider}.`);

          // Redirect to dashboard after a short delay
          setTimeout(() => router.push("/dashboard"), 1000);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");
        toast.error("Authentication failed. Please try again.");
        setTimeout(() => router.push("/auth/login"), 3000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 dark:bg-pink-500/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Content Card */}
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl p-12 rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl">

          {status === "processing" && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blue-500/30 dark:border-blue-400/30 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Authenticating...
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we complete your login
                </p>
              </div>

              <div className="flex gap-2 justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {/* Confetti particles */}
                  <div className="absolute -top-4 -left-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute -top-2 -right-4 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
                  <div className="absolute -bottom-4 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: "0.4s" }}></div>
                  <div className="absolute -bottom-2 -right-3 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: "0.1s" }}></div>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Success!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  You're being redirected to your dashboard...
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 animate-wiggle">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Authentication Failed
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Redirecting back to login page...
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
