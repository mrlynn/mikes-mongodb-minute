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
      tiktok: {
        connected: false,
        userId: null,
        displayName: null,
      },
      linkedin: {
        connected: false,
        userId: null,
        name: null,
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

    // Check for TikTok connection
    const tiktokConnection = connections.find((c) => c.platform === "tiktok");
    if (tiktokConnection) {
      status.tiktok = {
        connected: true,
        userId: tiktokConnection.platformUserId,
        displayName: tiktokConnection.platformUsername,
      };
    }

    // Check for LinkedIn connection
    const linkedinConnection = connections.find((c) => c.platform === "linkedin");
    if (linkedinConnection) {
      status.linkedin = {
        connected: true,
        userId: linkedinConnection.platformUserId,
        name: linkedinConnection.platformUsername,
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
