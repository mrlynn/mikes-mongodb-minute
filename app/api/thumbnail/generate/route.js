import { ImageResponse } from "@vercel/og";
import { prepareFace } from "@/lib/thumbnail/face/prepareFace";
import { wrapTitle } from "@/lib/thumbnail/text/wrapTitle";
import { injectHighlight } from "@/lib/thumbnail/text/injectHighlight";

// Use Node.js runtime to support Sharp for face processing
export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const titleText = searchParams.get("title") || "";
    const faceImageUrl = searchParams.get("face") || null;
    const category = searchParams.get("category") || "";
    const showBranding = searchParams.get("branding") !== "false";

    // Prepare face image
    let faceImage = null;
    if (faceImageUrl) {
      try {
        faceImage = await prepareFace(faceImageUrl);
        console.log("Face image prepared successfully, data URL length:", faceImage?.length || 0);
      } catch (error) {
        console.error("Error preparing face image:", error);
        // Continue without face image
      }
    }

    // Wrap title into 2-3 lines
    const titleLines = wrapTitle(titleText, 3, 14);

    // Inject highlight
    const highlightedLines = injectHighlight(titleLines);

    const SPRING_GREEN = "#00ED64";

    // Render thumbnail
    return new ImageResponse(
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
            {/* Face Image */}
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
              {highlightedLines.map((line, index) => {
                const bannerColors = ["#E11D48", "#1F2937", "#E11D48"];
                const bannerColor = bannerColors[index % bannerColors.length];

                return (
                  <div
                    key={index}
                    style={{
                      padding: "20px 30px",
                      backgroundColor: bannerColor,
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "72px",
                        fontWeight: "900",
                        color: "#FFFFFF",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        letterSpacing: "2px",
                        lineHeight: "1.2",
                        textTransform: "uppercase",
                      }}
                      dangerouslySetInnerHTML={{ __html: line }}
                    />
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
      }
    );
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    return new Response("Failed to generate thumbnail", { status: 500 });
  }
}

