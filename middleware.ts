import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  if (!maintenanceMode) return NextResponse.next();

  const allowedUsers = (process.env.NEXT_PUBLIC_ALLOWED_USERS || "").split(",");
  const token = request?.cookies.get("token");

  if (maintenanceMode && !token) return NextResponse.redirect(new URL("/maintenance", request.url));

  if (!token) return NextResponse.next();

  try {
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.TOKEN_SECRET),
    );

    if (allowedUsers.includes(payload.id)) {
      return NextResponse.next();
    }
  } catch (error: unknown) {
    console.log("token expired from middleware");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If maintenance mode is enabled and the user is not already on the maintenance page
  if (maintenanceMode && !request.nextUrl.pathname.startsWith("/maintenance")) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // Continue to the requested route
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/players", "/submitform", "/recreateform", "/schedule", "/submit-schedule", "/userprofile/:id*", "/games/:id*"],
};
