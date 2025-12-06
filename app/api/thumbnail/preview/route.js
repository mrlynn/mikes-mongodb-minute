import { NextResponse } from "next/server";
import { generateThumbnail, saveThumbnail } from "@/lib/thumbnail";
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
      // If it's a URL, try to resolve to local path
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

    // Generate thumbnail
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

    // Save as preview (temporary)
    const previewDir = join(process.cwd(), "public", "uploads", "thumbnails", "preview");
    const { mkdir } = await import("fs/promises");
    await mkdir(previewDir, { recursive: true });

    const previewFilename = `preview-${episodeId}-${Date.now()}.png`;
    const previewPath = join(previewDir, previewFilename);
    const { writeFile } = await import("fs/promises");
    await writeFile(previewPath, thumbnailBuffers.main);

    const previewUrl = `/uploads/thumbnails/preview/${previewFilename}`;

    return NextResponse.json({ previewUrl });
  } catch (error) {
    console.error("Error generating preview:", error);
    return NextResponse.json(
      { error: "Failed to generate preview", details: error.message },
      { status: 500 }
    );
  }
}

