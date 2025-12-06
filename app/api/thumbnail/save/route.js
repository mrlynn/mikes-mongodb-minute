import { NextResponse } from "next/server";
import { generateThumbnail, saveThumbnail } from "@/lib/thumbnail/generateThumbnail";
import { updateEpisode } from "@/lib/episodes";

export async function POST(req) {
  try {
    const {
      episodeId,
      faceAssetUrl,
      titleText,
      category,
      faceSource = "upload",
      showBranding = true,
    } = await req.json();

    if (!episodeId || !titleText) {
      return NextResponse.json(
        { error: "episodeId and titleText are required" },
        { status: 400 }
      );
    }

    // Pass the face URL directly - it could be a Blob URL or local URL
    // The generateThumbnail function will handle fetching it
    const faceImageUrl = faceAssetUrl || null;

    // Generate thumbnail using new system
    const thumbnailBuffers = await generateThumbnail({
      episodeId,
      titleText,
      faceImageUrl,
      category,
      showBranding,
    });

    // Validate file size meets YouTube's 2MB requirement
    const maxSizeBytes = 2 * 1024 * 1024; // 2MB
    if (thumbnailBuffers.main.length > maxSizeBytes) {
      console.warn(`Thumbnail size (${(thumbnailBuffers.main.length / 1024 / 1024).toFixed(2)}MB) exceeds YouTube's 2MB limit, but proceeding anyway`);
    }

    // Save thumbnail files
    const urls = await saveThumbnail(episodeId, thumbnailBuffers);

    // Update episode document with thumbnail metadata
    const thumbnailData = {
      status: "ready",
      mainUrl: urls.mainUrl,
      smallUrl: urls.smallUrl,
      faceSource,
      faceAssetUrl: faceAssetUrl || null,
      titleText,
      showBranding,
      generatedAt: new Date(),
      lastUpdatedAt: new Date(),
    };

    await updateEpisode(episodeId, {
      thumbnail: thumbnailData,
    });

    return NextResponse.json({
      mainUrl: urls.mainUrl,
      smallUrl: urls.smallUrl,
      thumbnail: thumbnailData,
    });
  } catch (error) {
    console.error("Error saving thumbnail:", error);
    return NextResponse.json(
      { error: "Failed to save thumbnail", details: error.message },
      { status: 500 }
    );
  }
}

