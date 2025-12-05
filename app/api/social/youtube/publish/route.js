import { NextResponse } from "next/server";
import { uploadYouTubeVideo } from "@/lib/youtube";
import { trackSocialPost } from "@/lib/social-media";
import { getSession } from "@/lib/auth";
import { getEpisodeById } from "@/lib/episodes";

/**
 * Publish episode to YouTube
 * POST /api/social/youtube/publish
 * Body: { episodeId, privacyStatus, videoUrl }
 */
export async function POST(request) {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { episodeId, privacyStatus = "unlisted", videoUrl } = body;

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

    // Build video metadata from episode
    const title = `${episode.title} | Mike's MongoDB Minute`;
    const description = `
${episode.hook || ""}

${episode.problem || ""}

${episode.tip || ""}

---
Episode #${episode.episodeNumber}
Category: ${episode.category}
Difficulty: ${episode.difficulty}

Learn more at: ${process.env.NEXT_PUBLIC_BASE_URL}/episodes/${episode.slug}

#MongoDB #Database #Tutorial #${episode.category.replace(/ /g, "")}
`.trim();

    const tags = [
      "MongoDB",
      "Database",
      "Tutorial",
      episode.category,
      "Mike's MongoDB Minute",
      episode.difficulty,
    ].filter(Boolean);

    // Download video from videoUrl
    // Note: In production, you'd want to handle this more robustly
    // For now, we'll fetch the video and stream it
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error("Failed to fetch video from URL");
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    const videoStream = Buffer.from(videoBuffer);

    // Upload to YouTube
    const result = await uploadYouTubeVideo(session.email, {
      title,
      description,
      tags,
      categoryId: "28", // Science & Technology
      privacyStatus,
      videoStream,
      mimeType: "video/webm",
    });

    // Track the post in database
    await trackSocialPost(episodeId, "youtube", {
      postId: result.videoId,
      postUrl: result.videoUrl,
      status: "published",
      metadata: {
        title: result.title,
        thumbnailUrl: result.thumbnailUrl,
        publishedAt: result.publishedAt,
        privacyStatus,
      },
    });

    return NextResponse.json({
      success: true,
      videoId: result.videoId,
      videoUrl: result.videoUrl,
    });
  } catch (error) {
    console.error("YouTube publish error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to publish to YouTube" },
      { status: 500 }
    );
  }
}
