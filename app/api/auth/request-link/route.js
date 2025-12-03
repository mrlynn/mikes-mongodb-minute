import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendMagicLink } from "@/lib/email";

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate email format
    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if email is from mongodb.com domain
    const emailLower = email.toLowerCase().trim();
    if (!emailLower.endsWith("@mongodb.com")) {
      return NextResponse.json(
        { error: "Only @mongodb.com email addresses are allowed" },
        { status: 403 }
      );
    }

    // Generate JWT token that expires in 15 minutes
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      {
        email: emailLower,
        iat: now,
        exp: now + (15 * 60) // 15 minutes from now
      },
      process.env.JWT_SECRET
    );

    console.log("=== TOKEN GENERATION ===");
    console.log("Current time (unix):", now);
    console.log("Token expires at (unix):", now + (15 * 60));
    console.log("Token expires at (date):", new Date((now + (15 * 60)) * 1000).toISOString());
    console.log("Magic link token generated for:", emailLower);

    // Get the base URL from the request (handles different ports in dev)
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    console.log("Using base URL:", baseUrl);

    // Send magic link email
    const result = await sendMagicLink(emailLower, token, baseUrl);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Magic link sent! Check your email.",
    });
  } catch (error) {
    console.error("Error in request-link:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
