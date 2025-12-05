import { NextResponse } from "next/server";
import { getAllSocialConnections } from "@/lib/social-media";
import { getSession } from "@/lib/auth";

/**
 * Get connection status for all social media platforms
 * GET /api/social/status
 */
export async function GET() {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all connections for this user
    const connections = await getAllSocialConnections(session.email);

    // Format response
    const status = {
      youtube: {
        connected: false,
        channelId: null,
        channelTitle: null,
      },
    };

    // Check for YouTube connection
    const youtubeConnection = connections.find((c) => c.platform === "youtube");
    if (youtubeConnection) {
      status.youtube = {
        connected: true,
        channelId: youtubeConnection.platformUserId,
        channelTitle: youtubeConnection.platformUsername,
      };
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error("Social status error:", error);
    return NextResponse.json(
      { error: "Failed to check social media status" },
      { status: 500 }
    );
  }
}
