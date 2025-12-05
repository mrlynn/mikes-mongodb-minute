import { NextResponse } from "next/server";
import { getYouTubeTokens, getYouTubeChannelInfo } from "@/lib/youtube";
import { saveSocialConnection } from "@/lib/social-media";
import { getSession } from "@/lib/auth";

/**
 * Handle YouTube OAuth callback
 * GET /api/social/youtube/callback?code=...
 */
export async function GET(request) {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect("/login?error=unauthorized");
    }

    // Get authorization code from query params
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      console.error("YouTube OAuth error:", error);
      return NextResponse.redirect("/admin/settings?youtube_error=" + error);
    }

    if (!code) {
      return NextResponse.redirect("/admin/settings?youtube_error=no_code");
    }

    // Exchange code for tokens
    const tokens = await getYouTubeTokens(code);

    // Get channel info using the new tokens
    // We need to temporarily use these tokens to get channel info
    const { google } = await import("googleapis");
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const response = await youtube.channels.list({
      part: ["snippet"],
      mine: true,
    });

    const channel = response.data.items?.[0];
    if (!channel) {
      return NextResponse.redirect("/admin/settings?youtube_error=no_channel");
    }

    // Save connection to database
    await saveSocialConnection(session.email, "youtube", {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      scope: tokens.scope,
      channelId: channel.id,
      channelTitle: channel.snippet.title,
      metadata: {
        thumbnailUrl: channel.snippet.thumbnails?.default?.url,
        description: channel.snippet.description,
      },
    });

    // Redirect back to settings page with success message
    return NextResponse.redirect("/admin/settings?youtube_connected=true");
  } catch (error) {
    console.error("YouTube callback error:", error);
    return NextResponse.redirect(
      "/admin/settings?youtube_error=" + encodeURIComponent(error.message)
    );
  }
}
