import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    const now = Math.floor(Date.now() / 1000);
    console.log("=== VERIFY REQUEST ===");
    console.log("Current time (unix):", now);
    console.log("Current time (date):", new Date(now * 1000).toISOString());
    console.log("Token received:", token ? "yes" : "no");
    console.log("JWT_SECRET available:", process.env.JWT_SECRET ? "yes" : "no");

    if (!token) {
      console.log("No token provided");
      return NextResponse.redirect(
        new URL("/login?error=missing-token", request.url)
      );
    }

    // Verify the JWT token with clock tolerance
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        clockTolerance: 60 // Allow 60 seconds of clock skew
      });
      console.log("Token verified successfully for:", decoded.email);
      console.log("Token was issued at (unix):", decoded.iat);
      console.log("Token was issued at (date):", new Date(decoded.iat * 1000).toISOString());
      console.log("Token expires at (unix):", decoded.exp);
      console.log("Token expires at (date):", new Date(decoded.exp * 1000).toISOString());
      console.log("Time until expiration (seconds):", decoded.exp - now);
    } catch (error) {
      console.error("JWT verification error:", error.name, error.message);
      if (error.name === "TokenExpiredError") {
        console.log("Token expired at:", error.expiredAt);
        console.log("Current time:", new Date());
        return NextResponse.redirect(
          new URL("/login?error=expired", request.url)
        );
      }
      console.log("Invalid token");
      return NextResponse.redirect(
        new URL(`/login?error=invalid-token&details=${error.message}`, request.url)
      );
    }

    // Verify email is from mongodb.com
    if (!decoded.email || !decoded.email.endsWith("@mongodb.com")) {
      console.log("Unauthorized email:", decoded.email);
      return NextResponse.redirect(
        new URL("/login?error=unauthorized", request.url)
      );
    }

    // Create a session token
    console.log("Creating session token for:", decoded.email);
    const sessionNow = Math.floor(Date.now() / 1000);
    const sessionToken = jwt.sign(
      {
        email: decoded.email,
        iat: sessionNow,
        exp: sessionNow + (7 * 24 * 60 * 60) // 7 days from now
      },
      process.env.JWT_SECRET
    );

    console.log("Session token expires at:", new Date((sessionNow + (7 * 24 * 60 * 60)) * 1000).toISOString());
    console.log("Redirecting to admin with session cookie");

    // Create redirect response and set cookie on it
    const response = NextResponse.redirect(new URL("/admin/episodes", request.url));

    // Set cookie with explicit options
    response.cookies.set({
      name: "session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    console.log("Cookie set on response");

    return response;
  } catch (error) {
    console.error("Error in verify:", error);
    return NextResponse.redirect(
      new URL("/login?error=server-error", request.url)
    );
  }
}
