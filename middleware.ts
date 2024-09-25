import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  // Check the environment variable
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
  const allowedUsers = (process.env.NEXT_PUBLIC_ALLOWED_USERS || "").split(",");
  const token = request?.cookies.get("token");

  if (!token) return NextResponse.redirect(new URL("/maintenance", request.url));

  const { payload } = await jwtVerify(
    token.value,
    new TextEncoder().encode(process.env.TOKEN_SECRET),
  );

  if (allowedUsers.includes(payload.id)) {
    return NextResponse.next();
  }

  // If maintenance mode is enabled and the user is not already on the maintenance page
  if (maintenanceMode && !request.nextUrl.pathname.startsWith("/maintenance")) {
    // Redirect to the maintenance page
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // Continue to the requested route
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/players", "/submitform", "/reset-password", "/recreateform", "/userprofile/:id*", "/games/:id*"],
};
