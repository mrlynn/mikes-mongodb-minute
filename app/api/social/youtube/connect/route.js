import { NextResponse } from "next/server";
import { getYouTubeAuthUrl } from "@/lib/youtube";
import { getSession } from "@/lib/auth";

/**
 * Initiate YouTube OAuth flow
 * GET /api/social/youtube/connect
 */
export async function GET() {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate OAuth URL
    const authUrl = getYouTubeAuthUrl();

    // Redirect user to Google OAuth consent screen
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("YouTube connect error:", error);
    return NextResponse.json(
      { error: "Failed to initiate YouTube connection" },
      { status: 500 }
    );
  }
}
