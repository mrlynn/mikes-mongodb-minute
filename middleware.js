import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Force Node.js runtime instead of Edge runtime (JWT requires crypto module)
export const runtime = 'nodejs';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("session");

    console.log("=== MIDDLEWARE CHECK ===");
    console.log("Path:", pathname);
    console.log("Session cookie present:", !!sessionCookie);

    if (!sessionCookie) {
      console.log("No session cookie found, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const decoded = jwt.verify(sessionCookie.value, process.env.JWT_SECRET, {
        clockTolerance: 60 // Allow 60 seconds of clock skew
      });

      console.log("Session token verified for:", decoded.email);
      console.log("Token expires at:", new Date(decoded.exp * 1000).toISOString());

      // Verify email is from mongodb.com
      if (!decoded.email || !decoded.email.endsWith("@mongodb.com")) {
        console.log("Unauthorized email domain");
        return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
      }

      // Allow the request to proceed
      console.log("Access granted to:", pathname);
      return NextResponse.next();
    } catch (error) {
      // Invalid or expired token
      console.log("Session token verification failed:", error.name, error.message);
      return NextResponse.redirect(new URL("/login?error=expired", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
