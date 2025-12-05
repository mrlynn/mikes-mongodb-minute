import { NextResponse } from "next/server";
import { getTikTokTokens, getTikTokUserInfo } from "@/lib/tiktok";
import { saveSocialConnection } from "@/lib/social-media";
import { getSession } from "@/lib/auth";

/**
 * Handle TikTok OAuth callback
 * GET /api/social/tiktok/callback?code=...&state=...
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
      console.error("TikTok OAuth error:", error);
      return NextResponse.redirect("/admin/settings?tiktok_error=" + error);
    }

    if (!code) {
      return NextResponse.redirect("/admin/settings?tiktok_error=no_code");
    }

    // Exchange code for tokens
    const tokens = await getTikTokTokens(code);

    // Get user info using the access token
    const userInfo = await getTikTokUserInfo(tokens.accessToken);

    // Save connection to database
    await saveSocialConnection(session.email, "tiktok", {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      scope: tokens.scope,
      platformUserId: userInfo.openId,
      platformUsername: userInfo.displayName,
      metadata: {
        username: userInfo.username,
        avatarUrl: userInfo.avatarUrl,
      },
    });

    // Redirect back to settings page with success message
    return NextResponse.redirect("/admin/settings?tiktok_connected=true");
  } catch (error) {
    console.error("TikTok callback error:", error);
    return NextResponse.redirect(
      "/admin/settings?tiktok_error=" + encodeURIComponent(error.message)
    );
  }
}
