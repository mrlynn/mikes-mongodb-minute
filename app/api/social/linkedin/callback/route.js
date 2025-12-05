import { NextResponse } from "next/server";
import { getLinkedInTokens, getLinkedInProfile } from "@/lib/linkedin";
import { saveSocialConnection } from "@/lib/social-media";
import { getSession } from "@/lib/auth";

/**
 * Handle LinkedIn OAuth callback
 * GET /api/social/linkedin/callback?code=...&state=...
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
      console.error("LinkedIn OAuth error:", error);
      return NextResponse.redirect("/admin/settings?linkedin_error=" + error);
    }

    if (!code) {
      return NextResponse.redirect("/admin/settings?linkedin_error=no_code");
    }

    // Exchange code for tokens
    const tokens = await getLinkedInTokens(code);

    // Get user profile using the access token
    const profile = await getLinkedInProfile(tokens.accessToken);

    // Save connection to database
    await saveSocialConnection(session.email, "linkedin", {
      accessToken: tokens.accessToken,
      refreshToken: null, // LinkedIn doesn't provide refresh tokens
      expiresAt: tokens.expiresAt,
      scope: tokens.scope,
      platformUserId: profile.sub,
      platformUsername: profile.name,
      metadata: {
        email: profile.email,
        picture: profile.picture,
      },
    });

    // Redirect back to settings page with success message
    return NextResponse.redirect("/admin/settings?linkedin_connected=true");
  } catch (error) {
    console.error("LinkedIn callback error:", error);
    return NextResponse.redirect(
      "/admin/settings?linkedin_error=" + encodeURIComponent(error.message)
    );
  }
}
