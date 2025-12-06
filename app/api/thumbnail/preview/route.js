import { NextResponse } from "next/server";
import { generateThumbnail } from "@/lib/thumbnail/generateThumbnail";
import { join } from "path";

export async function POST(req) {
  try {
    const {
      episodeId,
      faceAssetUrl,
      titleText,
      category,
      showBranding = true,
    } = await req.json();

    if (!episodeId || !titleText) {
      return NextResponse.json(
        { error: "episodeId and titleText are required" },
        { status: 400 }
      );
    }

    // Pass face URL directly - generateThumbnail will handle fetching from Blob or local path
    const faceImageUrl = faceAssetUrl || null;

    // Generate thumbnail using new system
    const thumbnailBuffers = await generateThumbnail({
      episodeId,
      titleText,
      faceImageUrl,
      category,
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
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { 
        error: "Failed to generate preview", 
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

