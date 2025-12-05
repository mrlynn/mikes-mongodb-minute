import { NextResponse } from "next/server";
import { uploadTikTokVideo } from "@/lib/tiktok";
import { trackSocialPost } from "@/lib/social-media";
import { getSession } from "@/lib/auth";
import { getEpisodeById } from "@/lib/episodes";

/**
 * Publish episode to TikTok
 * POST /api/social/tiktok/publish
 * Body: { episodeId, privacyLevel, videoUrl }
 */
export async function POST(request) {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { episodeId, privacyLevel = "SELF_ONLY", videoUrl } = body;

    if (!episodeId) {
      return NextResponse.json({ error: "Episode ID required" }, { status: 400 });
    }

    if (!videoUrl) {
      return NextResponse.json({ error: "Video URL required" }, { status: 400 });
    }

    // Get episode details
    const episode = await getEpisodeById(episodeId);
    if (!episode) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    // Build video title from episode (TikTok has 150 char limit for title)
    const title = `${episode.title} | Mike's MongoDB Minute #${episode.episodeNumber}`.substring(0, 150);

    // Download video from videoUrl
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error("Failed to fetch video from URL");
    }

    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

    // Upload to TikTok
    const result = await uploadTikTokVideo(session.email, {
      title,
      videoBuffer,
      privacyLevel, // SELF_ONLY, MUTUAL_FOLLOW_FRIENDS, or PUBLIC_TO_EVERYONE
    });

    // Track the post in database
    await trackSocialPost(episodeId, "tiktok", {
      postId: result.publishId,
      postUrl: result.videoUrl,
      status: result.status,
      metadata: {
        title,
        privacyLevel,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      publishId: result.publishId,
      videoUrl: result.videoUrl,
      status: result.status,
    });
  } catch (error) {
    console.error("TikTok publish error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to publish to TikTok" },
      { status: 500 }
    );
  }
}
