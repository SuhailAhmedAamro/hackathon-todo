"use client";

/**
 * Login Page
 * User login with email/username and password
 */

import { Suspense } from "react";
import LoginContent from "./LoginContent";
import { FullPageLoading } from "@/components/ui/Loading";

export default function LoginPage() {
  return (
    <Suspense fallback={<FullPageLoading message="Loading..." />}>
      <LoginContent />
    </Suspense>
  );
}
