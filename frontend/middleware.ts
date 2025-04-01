import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Checking for a general auth token
  const admin = req.cookies.get("admin")?.value; // Checking for the admin cookie

  // If the path is /admin and the admin cookie is missing, redirect to login

  // If there's no general auth token, redirect to login
  // if (!token) {
  //   return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login if token is missing
  // }

  return NextResponse.next(); // Allow the request to continue if authenticated
}

// Apply middleware only to specific routes
export const config = {
  matcher: ["/:path*"],
};
