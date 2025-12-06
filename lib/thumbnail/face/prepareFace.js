import sharp from "sharp";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

/**
 * Prepare face image for thumbnail
 * - Resize to 480x480
 * - Apply circular mask
 * - Output as transparent PNG
 * - Convert to base64 data URL for injection into OG template
 */
export async function prepareFace(faceImageUrl) {
  if (!faceImageUrl) {
    return null;
  }

  try {
    let faceBuffer;

    // Load image from URL or local path
    if (faceImageUrl.startsWith("http://") || faceImageUrl.startsWith("https://")) {
      const response = await fetch(faceImageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch face image: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      faceBuffer = Buffer.from(arrayBuffer);
    } else if (faceImageUrl.startsWith("/")) {
      const localPath = join(process.cwd(), "public", faceImageUrl);
      if (existsSync(localPath)) {
        faceBuffer = await readFile(localPath);
      } else {
        throw new Error(`Face image not found at: ${localPath}`);
      }
    } else {
      throw new Error(`Invalid face image URL: ${faceImageUrl}`);
    }

    // Create circular mask
    const size = 480;
    const circleMask = Buffer.from(`
      <svg width="${size}" height="${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
      </svg>
    `);

    // Process face: resize, apply circular mask, output PNG
    const processed = await sharp(faceBuffer)
      .resize(size, size, {
        fit: "cover",
        position: "center",
      })
      .composite([
        {
          input: circleMask,
          blend: "dest-in",
        },
      ])
      .png()
      .toBuffer();

    // Convert to base64 data URL for use in OG template
    // @vercel/og supports data URLs for images
    const base64 = processed.toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;
    console.log("Face image prepared successfully");
    console.log("Data URL prefix:", dataUrl.substring(0, 30));
    console.log("Data URL length:", dataUrl.length);
    return dataUrl;
  } catch (error) {
    console.error("Error preparing face image:", error);
    throw error;
  }
}

