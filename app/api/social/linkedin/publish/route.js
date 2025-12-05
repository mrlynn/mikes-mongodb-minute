import { NextResponse } from "next/server";
import { uploadLinkedInVideo } from "@/lib/linkedin";
import { trackSocialPost } from "@/lib/social-media";
import { getSession } from "@/lib/auth";
import { getEpisodeById } from "@/lib/episodes";

/**
 * Publish episode to LinkedIn
 * POST /api/social/linkedin/publish
 * Body: { episodeId, videoUrl }
 */
export async function POST(request) {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { episodeId, videoUrl } = body;

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

    // Build post content from episode
    const title = `${episode.title} | Mike's MongoDB Minute #${episode.episodeNumber}`;
    const description = `
${episode.hook || ""}

${episode.problem || ""}

${episode.tip || ""}

Learn more: ${process.env.NEXT_PUBLIC_BASE_URL}/episodes/${episode.slug}
`.trim();

    // Download video from videoUrl
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error("Failed to fetch video from URL");
    }

    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

    // Upload to LinkedIn
    const result = await uploadLinkedInVideo(session.email, {
      title,
      description,
      videoBuffer,
    });

    // Track the post in database
    await trackSocialPost(episodeId, "linkedin", {
      postId: result.postId,
      postUrl: result.postUrl,
      status: "published",
      metadata: {
        title,
        videoUrn: result.videoUrn,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      postId: result.postId,
      postUrl: result.postUrl,
    });
  } catch (error) {
    console.error("LinkedIn publish error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to publish to LinkedIn" },
      { status: 500 }
    );
  }
}
