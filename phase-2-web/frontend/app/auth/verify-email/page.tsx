"use client";

/**
 * Email Verification Page - Glassmorphism Design
 * Premium email verification experience
 */

import { Suspense } from "react";
import VerifyEmailContent from "./VerifyEmailContent";
import { FullPageLoading } from "@/components/ui/Loading";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<FullPageLoading message="Loading..." />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
