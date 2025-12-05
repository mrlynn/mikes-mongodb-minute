import { NextResponse } from "next/server";
import { deleteSocialConnection } from "@/lib/social-media";
import { revokeTikTokAccess } from "@/lib/tiktok";
import { getSession } from "@/lib/auth";

/**
 * Disconnect TikTok account
 * POST /api/social/tiktok/disconnect
 */
export async function POST() {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Revoke access token with TikTok
    await revokeTikTokAccess(session.email);

    // Delete connection from database
    await deleteSocialConnection(session.email, "tiktok");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("TikTok disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect TikTok" },
      { status: 500 }
    );
  }
}
