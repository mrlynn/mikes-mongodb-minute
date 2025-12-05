import { NextResponse } from "next/server";
import { deleteSocialConnection } from "@/lib/social-media";
import { getSession } from "@/lib/auth";

/**
 * Disconnect LinkedIn account
 * POST /api/social/linkedin/disconnect
 */
export async function POST() {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete connection from database
    // Note: LinkedIn doesn't have a token revocation endpoint
    await deleteSocialConnection(session.email, "linkedin");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LinkedIn disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect LinkedIn" },
      { status: 500 }
    );
  }
}
