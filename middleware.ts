import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Define user roles
const USER_ROLES = {
  USER: 1,
  ADMIN: 2,
  SUPERADMIN: 3
} as const;

// Define protected routes and their required roles
const PROTECTED_ROUTES = {
  '/userprofile': USER_ROLES.USER,
  '/submit-game': USER_ROLES.USER,
  '/schedule': USER_ROLES.USER,
  '/recreateform': USER_ROLES.SUPERADMIN,
} as const;

// Dynamic routes that need protection
const DYNAMIC_PROTECTED_ROUTES = [
  { pattern: /^\/userprofile\/\d+$/, role: USER_ROLES.USER }
];

function isProtectedRoute(pathname: string): { isProtected: boolean; requiredRole?: number } {
  // Check static routes
  if (pathname in PROTECTED_ROUTES) {
    return {
      isProtected: true,
      requiredRole: PROTECTED_ROUTES[pathname as keyof typeof PROTECTED_ROUTES]
    };
  }

  // Check dynamic routes
  for (const route of DYNAMIC_PROTECTED_ROUTES) {
    if (route.pattern.test(pathname)) {
      return {
        isProtected: true,
        requiredRole: route.role
      };
    }
  }

  return { isProtected: false };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  // Handle maintenance mode first
  if (maintenanceMode) {
    const allowedUsers = (process.env.NEXT_PUBLIC_ALLOWED_USERS || "").split(",");
    const token = request?.cookies.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }

    try {
      const { payload } = await jwtVerify(
        token.value,
        new TextEncoder().encode(process.env.JWT_SECRET),
      );

      if (!allowedUsers.includes(payload.id as string)) {
        return NextResponse.redirect(new URL("/maintenance", request.url));
      }
    } catch (error: unknown) {
      console.log("token expired from middleware");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Check if the route needs protection
  const { isProtected, requiredRole } = isProtectedRoute(pathname);

  if (!isProtected) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('token');

  if (!token) {
    // Redirect to login if no token
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify token and get user info
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET),
    );
    const user = {
      id: payload.id as string,
      email: payload.mail as string,
      role: payload.role as number,
      name: payload.name as string
    };

    // Check if user has required role
    if (requiredRole && user.role < requiredRole) {
      // Insufficient permissions, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }

    // User is authenticated and authorized
    return NextResponse.next();

  } catch (error: unknown) {
    console.log("token expired from middleware");
    // Invalid token, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/",
    "/players",
    "/submit-game/:path*",
    "/recreateform/:path*",
    "/schedule/:path*",
    "/submit-schedule",
    "/userprofile/:path*",
    "/games/:id*"
  ],
};
