import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Middleware for Next.js
 *
 * NOTE: Since we're using localStorage for JWT storage (not cookies),
 * middleware cannot verify authentication for protected routes.
 *
 * Route protection is handled client-side using:
 * - useIsAuthenticated() hook
 * - ProtectedRoute component
 *
 * This middleware only handles:
 * - Maintenance mode (using Authorization header from requests)
 */

export async function middleware(request: NextRequest) {
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  // Handle maintenance mode
  if (maintenanceMode) {
    const allowedUsers = (process.env.NEXT_PUBLIC_ALLOWED_USERS || "").split(",");

    // Try to get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      // For page requests without token, redirect to maintenance
      if (!request.nextUrl.pathname.startsWith('/api') &&
          request.nextUrl.pathname !== '/maintenance' &&
          request.nextUrl.pathname !== '/login') {
        return NextResponse.redirect(new URL("/maintenance", request.url));
      }
      return NextResponse.next();
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET),
      );

      if (!allowedUsers.includes(payload.id as string)) {
        if (!request.nextUrl.pathname.startsWith('/api') &&
            request.nextUrl.pathname !== '/maintenance') {
          return NextResponse.redirect(new URL("/maintenance", request.url));
        }
      }
    } catch (error: unknown) {
      console.log("token verification failed in middleware");
      // Token is invalid, but let the request through
      // Client-side will handle the auth state
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
