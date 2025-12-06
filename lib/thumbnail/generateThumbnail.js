import { ImageResponse } from "@vercel/og";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { prepareFace } from "./face/prepareFace";
import { wrapTitle } from "./text/wrapTitle";
import { injectHighlight } from "./text/injectHighlight";

/**
 * Generate thumbnail using @vercel/og
 * This is the main entry point for thumbnail generation
 */
export async function generateThumbnail({
  episodeId,
  titleText,
  faceImageUrl,
  category,
  showBranding = true,
  backgroundTemplate = "dark",
}) {
  try {
    // Prepare face image (circular, 480x480, base64 data URL)
    let faceImage = null;
    if (faceImageUrl) {
      try {
        faceImage = await prepareFace(faceImageUrl);
        console.log("Face image prepared:", faceImage ? "Success" : "Failed", faceImage ? faceImage.substring(0, 50) + "..." : "");
      } catch (error) {
        console.error("Error preparing face image:", error);
        // Continue without face image
      }
    }

    // Wrap title into 2-3 lines
    const titleLines = wrapTitle(titleText, 3, 14);

    // Inject highlight (MongoDB green) into title lines
    const highlightedLines = injectHighlight(titleLines);

    const SPRING_GREEN = "#00ED64";

    console.log("Generating thumbnail with:", {
      hasFaceImage: !!faceImage,
      faceImageType: faceImage ? typeof faceImage : "none",
      faceImagePreview: faceImage ? faceImage.substring(0, 50) + "..." : "none",
      titleLines: titleLines.length,
      category,
    });

    // Prepare image options for @vercel/og
    // @vercel/og supports data URLs, but we need to ensure proper format
    const imageOptions = faceImage
      ? {
          // Pass image as data URL - @vercel/og should handle this
        }
      : {};

    // Render thumbnail using @vercel/og
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: "1280px",
            height: "720px",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(180deg, #0A0F14 0%, #13181D 100%)",
            position: "relative",
          }}
        >
          {/* Category Badge */}
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: "40px",
              padding: "8px 20px",
              borderRadius: "14px",
              border: "2px solid #00ED64",
              backgroundColor: "rgba(28, 28, 28, 0.9)",
              color: "#00ED64",
              fontSize: "12px",
              fontWeight: "900",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              display: category ? "flex" : "none",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {category ? category.toUpperCase() : ""}
          </div>

          {/* Main Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "120px 60px 60px 60px",
              gap: "60px",
            }}
          >
            {/* Face Image - Always show space, render image if available */}
            <div
              style={{
                width: "480px",
                height: "480px",
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: faceImage ? "transparent" : "#1A1A1A",
                border: faceImage ? "none" : "2px dashed #666",
              }}
            >
              {faceImage ? (
                <img
                  src={faceImage}
                  alt=""
                  width={480}
                  height={480}
                  style={{
                    width: "480px",
                    height: "480px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  No face image
                </div>
              )}
            </div>

            {/* Title Block */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "20px",
                minHeight: "400px",
              }}
            >
              {highlightedLines.map((lineData, index) => {
                const bannerColors = ["#E11D48", "#1F2937", "#E11D48"];
                const bannerColor = bannerColors[index % bannerColors.length];
                const line = typeof lineData === "string" ? lineData : lineData.text;
                const highlightWord = typeof lineData === "object" ? lineData.highlightWord : null;

                // Split line into words and highlight the target word
                const words = line.split(" ");
                const SPRING_GREEN = "#00ED64";

                return (
                  <div
                    key={index}
                    style={{
                      padding: "20px 30px",
                      backgroundColor: bannerColor,
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    {words.map((word, wordIndex) => {
                      const isHighlighted = highlightWord && word.toUpperCase() === highlightWord.toUpperCase();
                      return (
                        <span
                          key={wordIndex}
                          style={{
                            fontSize: "72px",
                            fontWeight: "900",
                            color: isHighlighted ? SPRING_GREEN : "#FFFFFF",
                            fontFamily: "Arial, Helvetica, sans-serif",
                            letterSpacing: "2px",
                            lineHeight: "1.2",
                            textTransform: "uppercase",
                          }}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Brand Mark */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "40px",
              width: "90px",
              height: "90px",
              display: showBranding ? "flex" : "none",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                border: "3px solid #00ED64",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                opacity: 0.75,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "3px",
                  height: "20px",
                  backgroundColor: "#00ED64",
                  top: "15px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  opacity: 0.75,
                }}
              />
              <div
                style={{
                  width: "12px",
                  height: "16px",
                  backgroundColor: "#00ED64",
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                  opacity: 0.75,
                }}
              />
            </div>
          </div>
        </div>
      ),
      {
        width: 1280,
        height: 720,
        fonts: [], // No custom fonts needed
        // @vercel/og should handle data URLs in img src automatically
      }
    );

    // Convert to buffer
    const arrayBuffer = await imageResponse.arrayBuffer();
    const mainBuffer = Buffer.from(arrayBuffer);

    // Generate small version
    const smallBuffer = await generateSmallThumbnail(mainBuffer);

    return {
      main: mainBuffer,
      small: smallBuffer,
    };
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      episodeId,
      hasTitleText: !!titleText,
      hasFaceImageUrl: !!faceImageUrl,
      category,
      showBranding,
    });
    throw error;
  }
}

/**
 * Generate small version (640x360) for previews
 */
export async function generateSmallThumbnail(thumbnailBuffer) {
  return await sharp(thumbnailBuffer)
    .resize(640, 360, {
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer();
}

/**
 * Save thumbnail to Vercel Blob Storage
 */
export async function saveThumbnail(episodeId, thumbnailBuffers) {
  const mainFilename = `episode-${episodeId}-main.png`;
  const smallFilename = `episode-${episodeId}-small.png`;

  // Upload to Vercel Blob Storage
  const mainBlob = await put(`thumbnails/${mainFilename}`, thumbnailBuffers.main, {
    access: "public",
    contentType: "image/png",
  });

  const smallBlob = await put(`thumbnails/${smallFilename}`, thumbnailBuffers.small, {
    access: "public",
    contentType: "image/png",
  });

  return {
    mainUrl: mainBlob.url,
    smallUrl: smallBlob.url,
  };
}

