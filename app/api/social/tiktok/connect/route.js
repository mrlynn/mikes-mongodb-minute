import { NextResponse } from "next/server";
import { getTikTokAuthUrl } from "@/lib/tiktok";
import { getSession } from "@/lib/auth";

/**
 * Initiate TikTok OAuth flow
 * GET /api/social/tiktok/connect
 */
export async function GET() {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate OAuth URL
    const authUrl = getTikTokAuthUrl();

    // Redirect user to TikTok OAuth consent screen
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("TikTok connect error:", error);
    return NextResponse.json(
      { error: "Failed to initiate TikTok connection" },
      { status: 500 }
    );
  }
}
