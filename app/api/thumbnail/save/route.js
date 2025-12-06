import { NextResponse } from "next/server";
import { generateThumbnail, saveThumbnail } from "@/lib/thumbnail";
import { updateEpisode } from "@/lib/episodes";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req) {
  try {
    const {
      episodeId,
      layout = "face-right",
      theme = "dark",
      backgroundType = "template",
      backgroundId = "default",
      faceAssetUrl,
      titleText,
      category,
      faceSource = "upload",
      showCategoryBadge = true,
      showBranding = true,
    } = await req.json();

    if (!episodeId || !titleText) {
      return NextResponse.json(
        { error: "episodeId and titleText are required" },
        { status: 400 }
      );
    }

    // Resolve face image path
    let faceImagePath = null;
    if (faceAssetUrl) {
      if (faceAssetUrl.startsWith("/uploads/")) {
        const localPath = join(process.cwd(), "public", faceAssetUrl);
        if (existsSync(localPath)) {
          faceImagePath = localPath;
        }
      } else if (faceAssetUrl.startsWith("/")) {
        const localPath = join(process.cwd(), "public", faceAssetUrl);
        if (existsSync(localPath)) {
          faceImagePath = localPath;
        }
      }
    }

    // Generate thumbnail (optimized for YouTube best practices)
    const thumbnailBuffers = await generateThumbnail({
      episodeId,
      titleText,
      faceImagePath,
      layout,
      theme,
      backgroundType,
      backgroundId,
      category,
      showCategoryBadge,
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
      layout,
      theme,
      backgroundType,
      backgroundId,
      faceSource,
      faceAssetUrl: faceAssetUrl || null,
      titleText,
      showCategoryBadge,
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

