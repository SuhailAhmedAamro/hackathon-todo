/**
 * Next.js Middleware for Route Protection
 *
 * NOTE: Since we're using localStorage for JWT tokens (client-side only),
 * this middleware cannot check authentication state (middleware runs server-side).
 * Authentication redirects are handled by the AuthProvider on the client side.
 *
 * This middleware is kept minimal to avoid conflicts with client-side auth.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Let client-side AuthProvider handle authentication redirects
  // Middleware just allows all requests through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
