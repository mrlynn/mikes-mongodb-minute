import { NextResponse } from "next/server";
import { getEpisodeSocialPosts } from "@/lib/social-media";
import { getSession } from "@/lib/auth";

/**
 * Get publish status for a specific episode
 * GET /api/social/status/[episodeId]
 */
export async function GET(request, { params }) {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Next.js 15+ requires params to be awaited
    const { episodeId } = await params;

    if (!episodeId) {
      return NextResponse.json(
        { error: "Episode ID required" },
        { status: 400 }
      );
    }

    // Get all social posts for this episode
    const posts = await getEpisodeSocialPosts(episodeId);

    // Format response
    const status = {
      youtube: null,
      tiktok: null,
      linkedin: null,
    };

    // Check for YouTube post
    const youtubePost = posts.find((p) => p.platform === "youtube");
    if (youtubePost) {
      status.youtube = {
        postId: youtubePost.postId,
        postUrl: youtubePost.postUrl,
        status: youtubePost.status,
        publishedAt: youtubePost.publishedAt,
      };
    }

    // Check for TikTok post
    const tiktokPost = posts.find((p) => p.platform === "tiktok");
    if (tiktokPost) {
      status.tiktok = {
        postId: tiktokPost.postId,
        postUrl: tiktokPost.postUrl,
        status: tiktokPost.status,
        publishedAt: tiktokPost.publishedAt,
      };
    }

    // Check for LinkedIn post
    const linkedinPost = posts.find((p) => p.platform === "linkedin");
    if (linkedinPost) {
      status.linkedin = {
        postId: linkedinPost.postId,
        postUrl: linkedinPost.postUrl,
        status: linkedinPost.status,
        publishedAt: linkedinPost.publishedAt,
      };
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error("Episode social status error:", error);
    return NextResponse.json(
      { error: "Failed to check episode social media status" },
      { status: 500 }
    );
  }
}
