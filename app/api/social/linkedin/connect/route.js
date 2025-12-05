import { NextResponse } from "next/server";
import { getLinkedInAuthUrl } from "@/lib/linkedin";
import { getSession } from "@/lib/auth";

/**
 * Initiate LinkedIn OAuth flow
 * GET /api/social/linkedin/connect
 */
export async function GET() {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate OAuth URL
    const authUrl = getLinkedInAuthUrl();

    // Redirect user to LinkedIn OAuth consent screen
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("LinkedIn connect error:", error);
    return NextResponse.json(
      { error: "Failed to initiate LinkedIn connection" },
      { status: 500 }
    );
  }
}
