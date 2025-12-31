"use client";

/**
 * Reset Password Page - Glassmorphism Design
 * Premium password reset experience with token validation
 */

import { Suspense } from "react";
import ResetPasswordContent from "./ResetPasswordContent";
import { FullPageLoading } from "@/components/ui/Loading";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<FullPageLoading message="Loading..." />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
