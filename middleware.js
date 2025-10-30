/** @format */

import { NextResponse } from "next/server";

export function middleware(request) {
  // Pass all requests through. Authentication will be handled on the client-side.
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