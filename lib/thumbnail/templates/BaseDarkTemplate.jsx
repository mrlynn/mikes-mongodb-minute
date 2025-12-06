/**
 * Base Dark Template for thumbnails
 * Fixed layout with face on left, title on right
 */

export function BaseDarkTemplate({ titleLines, category, faceImage, showBranding = true }) {
  return (
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
      {/* Category Badge - Top Left */}
      {category && (
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
          }}
        >
          {category}
        </div>
      )}

      {/* Main Content Area */}
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
        {/* Face Image - Left Side */}
        {faceImage && (
          <div
            style={{
              width: "480px",
              height: "480px",
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src={faceImage}
              alt="Face"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        {/* Title Block - Right Side */}
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
          {titleLines.map((line, index) => {
            // Determine banner color based on line index
            const bannerColors = [
              "#E11D48", // Red for first line
              "#1F2937", // Dark blue/black for second line
              "#E11D48", // Red for third line
            ];
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

      {/* Brand Mark - Bottom Right */}
      {showBranding && (
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            width: "90px",
            height: "90px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Stopwatch Circle */}
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
            {/* Stopwatch Hand (12 o'clock) */}
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
            {/* MongoDB Leaf */}
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
      )}
    </div>
  );
}

