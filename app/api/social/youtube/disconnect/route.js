import { NextResponse } from "next/server";
import { deleteSocialConnection } from "@/lib/social-media";
import { getSession } from "@/lib/auth";

/**
 * Disconnect YouTube account
 * POST /api/social/youtube/disconnect
 */
export async function POST() {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete connection from database
    await deleteSocialConnection(session.email, "youtube");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("YouTube disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect YouTube" },
      { status: 500 }
    );
  }
}
