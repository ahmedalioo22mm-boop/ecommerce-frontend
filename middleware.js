/** @format */

import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

/**
 * Middleware to protect routes based on authentication and user roles.
 * @param {import("next/server").NextRequest} request
 */
export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  console.log(`\n--- [Middleware] START for Path: ${pathname} ---`);
  console.log(`[Middleware] Token Found: ${!!token}`);

  const isDashboardPath = pathname.startsWith("/dashboard");
  const isAuthPath =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // 1. Handle routes for authenticated users
  if (token) {
    let decoded;
    try {
      decoded = jwtDecode(token);

      // Check if token is expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        throw new Error("Token Expired");
      }
      console.log("[Middleware] JWT Decode SUCCESS.");
    } catch (error) {
      // If token is invalid or expired, delete cookies and redirect to login
      console.error(
        `[Middleware] ERROR: JWT Decode Failed or Expired. Reason: ${error.message}`
      );

      const response = NextResponse.redirect(new URL("/login", request.url));
      
      // Delete invalid cookies for cleanup
      response.cookies.delete("token");
      response.cookies.delete("refreshToken");

      console.log(
        "[Middleware] ACTION: Invalid token, deleted cookies and redirecting to /login."
      );
      return response;
    }

    const userRole = decoded.role;
    console.log(`[Middleware] User Role: ${userRole}`);

    // 2. Redirect logged-in users away from login/register pages
    if (isAuthPath) {
      console.log(
        "[Middleware] ACTION: Logged in user accessing auth page, redirecting to /."
      );
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 3. Dashboard Authorization: Admin-only access
    // The entire dashboard and its sub-pages are for "admin" only.
    if (isDashboardPath && userRole !== "admin") {
      console.log(
        `[Middleware] ACTION: User role '${userRole}' denied access to dashboard. Redirecting to /.`
      );
      // If a non-admin user tries to access the dashboard, redirect them to the homepage.
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If all checks pass for an authenticated user, allow access.
    console.log(`[Middleware] ACTION: Authenticated user allowed for path: ${pathname}`);
    return NextResponse.next();
  }

  // 4. Handle routes for unauthenticated users
  // Redirect user to login if trying to access dashboard without a token
  if (isDashboardPath) {
    console.log("[Middleware] ACTION: No token, redirecting to /login for dashboard access.");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For all other pages, allow access for unauthenticated users
  console.log("[Middleware] ACTION: Unauthenticated user allowed. Passing through.");
  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // It also excludes paths with file extensions (e.g., .png, .jpg).
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)",
  ],
};