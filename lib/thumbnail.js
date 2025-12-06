import sharp from "sharp";
import { join } from "path";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { put } from "@vercel/blob";

/**
 * Thumbnail Generator - YouTube Best Practices Compliant
 * 
 * This module generates thumbnails following YouTube's best practices:
 * - Dimensions: 1280x720px (16:9 aspect ratio) - YouTube's recommended size
 * - File size: Optimized to stay under 2MB (YouTube's maximum)
 * - Text: Large, bold fonts (60px+) for mobile readability (60%+ views are mobile)
 * - Text length: 3-5 words recommended for clarity
 * - Faces: Prominent face placement increases CTR
 * - Contrast: High contrast text with shadows/outlines for visibility
 * - Colors: Eye-catching MongoDB brand colors
 * 
 * References:
 * - https://www.shopify.com/blog/youtube-thumbnail-size
 * - YouTube Creator Academy best practices
 */

const THUMBNAIL_WIDTH = 1280; // YouTube recommended: 1280px minimum width
const THUMBNAIL_HEIGHT = 720; // 16:9 aspect ratio (YouTube standard)
const SMALL_THUMBNAIL_WIDTH = 640; // Minimum width per YouTube guidelines
const SMALL_THUMBNAIL_HEIGHT = 360;

// YouTube best practices constants
const MIN_FONT_SIZE_MOBILE = 60; // Minimum font size for mobile readability (60%+ views are mobile)
const MAX_FILE_SIZE_MB = 2; // YouTube's maximum file size
const MAX_TEXT_WORDS = 5; // Recommended max words for clarity

// MongoDB brand colors (eye-catching and high contrast)
const MONGODB_GREEN = "#00ED64"; // Bright, eye-catching green
const MONGODB_DARK_GREEN = "#00684A";
const MONGODB_DARK = "#001E2B";
const MONGODB_LIGHT = "#E2E8F0";
const WHITE = "#FFFFFF";
const BLACK = "#000000";

/**
 * Generate a MongoDB-branded background with better contrast for text
 */
async function generateBackground(theme = "dark", backgroundId = "default") {
  const width = THUMBNAIL_WIDTH;
  const height = THUMBNAIL_HEIGHT;

  // Create base background with better contrast
  const bgColor = theme === "dark" ? MONGODB_DARK : "#FFFFFF";
  const accentColor = theme === "dark" ? MONGODB_GREEN : MONGODB_DARK_GREEN;
  const gradientEnd = theme === "dark" ? "#0A1419" : "#F7FAFC";

  // Create SVG background with MongoDB branding and better text contrast zones
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${gradientEnd};stop-opacity:1" />
        </linearGradient>
        <radialGradient id="textZone" cx="50%" cy="60%">
          <stop offset="0%" style="stop-color:${theme === "dark" ? "#0F1419" : "#FFFFFF"};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${bgColor};stop-opacity:1" />
        </radialGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${theme === "dark" ? "#1A2328" : "#E2E8F0"}" stroke-width="1" opacity="0.25"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)"/>
      <!-- Subtle darkening zone for text area to improve readability -->
      <rect x="0" y="${height * 0.3}" width="100%" height="${height * 0.5}" fill="url(#textZone)" opacity="0.3"/>
      <rect width="100%" height="100%" fill="url(#grid)"/>
      ${backgroundId === "atlas-grid" ? `
        <circle cx="${width * 0.15}" cy="${height * 0.2}" r="80" fill="${accentColor}" opacity="0.12"/>
        <circle cx="${width * 0.85}" cy="${height * 0.8}" r="120" fill="${accentColor}" opacity="0.1"/>
      ` : ""}
    </svg>
  `;

  return Buffer.from(svg);
}

/**
 * Process and crop face image to circle
 */
async function processFaceImage(faceBuffer, size = 300) {
  return await sharp(faceBuffer)
    .resize(size, size, {
      fit: "cover",
      position: "center",
    })
    .composite([
      {
        input: Buffer.from(`
          <svg width="${size}" height="${size}">
            <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
          </svg>
        `),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();
}

/**
 * Generate thumbnail image
 */
export async function generateThumbnail({
  episodeId,
  titleText,
  faceImageUrl,
  layout = "face-right",
  theme = "dark",
  backgroundType = "template",
  backgroundId = "default",
  category,
  showCategoryBadge = true, // Allow disabling category badge
  showBranding = true, // Allow disabling branding
}) {
  try {
    // Generate background
    const backgroundBuffer = await generateBackground(theme, backgroundId);

    // Create base image
    let image = sharp(backgroundBuffer).resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);

    // Process face image if provided (larger size for better prominence)
    let faceBuffer = null;
    if (faceImageUrl) {
      try {
        let faceImage;

        // Check if it's a Blob URL (starts with https://)
        if (faceImageUrl.startsWith('http://') || faceImageUrl.startsWith('https://')) {
          // Fetch from Blob storage or external URL
          const response = await fetch(faceImageUrl);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            faceImage = Buffer.from(arrayBuffer);
          }
        } else if (faceImageUrl.startsWith('/')) {
          // Local file path - try to read from public directory
          const localPath = join(process.cwd(), "public", faceImageUrl);
          if (existsSync(localPath)) {
            faceImage = await readFile(localPath);
          }
        }

        if (faceImage) {
          faceBuffer = await processFaceImage(faceImage, 340); // Match the faceSize used in layout
        }
      } catch (error) {
        console.error("Error loading face image:", error);
        // Continue without face image if there's an error
      }
    }

    // Prepare text overlay with YouTube best practices
    // Use high contrast colors for better visibility
    const textColor = theme === "dark" ? WHITE : MONGODB_DARK;
    const accentColor = theme === "dark" ? MONGODB_GREEN : MONGODB_DARK_GREEN;
    
    // Use larger, bolder font size for mobile readability (YouTube best practice: 60px+ for mobile)
    // Scale based on text length but ensure minimum readability
    const baseFontSize = 84; // Large, bold size for maximum readability
    const titleFontSize = titleText.length > 25 ? Math.max(72, baseFontSize - Math.floor(titleText.length / 5)) : baseFontSize;
    
    // Calculate text positioning based on layout (YouTube best practices)
    // Account for face image space when positioning text
    const faceSpace = faceBuffer ? 380 : 0; // Space reserved for face
    const maxTitleWidth = layout === "centered" 
      ? 1100 // More width for centered
      : layout === "face-left" 
        ? THUMBNAIL_WIDTH - faceSpace - 80 // More width available
        : THUMBNAIL_WIDTH - faceSpace - 60; // More width for face-right layout
    
    // Vertical positioning - use rule of thirds for better composition
    // Position text in upper-middle area (avoid bottom-right where YouTube timestamp appears)
    const titleY = layout === "centered" 
      ? 280 
      : layout === "face-left" 
        ? 320 // Better vertical alignment
        : 320; // Consistent vertical position (upper-middle area)
    
    // Horizontal positioning - left-aligned for natural reading flow
    const titleX = layout === "face-left" 
      ? faceSpace + 50 // Start after face with margin
      : layout === "face-right" 
        ? 70 // Start from left with margin (avoid bottom-right)
        : 140; // Centered layout

    // Smart word wrap - ensure ALL text fits (YouTube best practice: 3-5 words per line, but fit everything)
    const words = titleText.split(" ").filter(w => w.length > 0);
    const lines = [];
    // More accurate character width - account for bold Arial font
    const avgCharWidth = titleFontSize * 0.52; // Optimized for Arial Bold
    const spaceWidth = titleFontSize * 0.3; // Space between words
    
    // Process all words to ensure nothing is lost
    let currentLine = "";
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      
      // Calculate actual width including spaces
      const wordCount = testLine.split(" ").length;
      const lineWidth = testLine.length * avgCharWidth + (wordCount - 1) * spaceWidth;
      
      // Break line if width exceeds max (use 98% to ensure we use available space)
      if (lineWidth > maxTitleWidth * 0.98) {
        if (currentLine) {
          // Save current line and start new one
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Single word is too long - must truncate
          const maxChars = Math.floor(maxTitleWidth / avgCharWidth);
          currentLine = word.length > maxChars ? word.substring(0, maxChars - 3) + "..." : word;
        }
      } else {
        currentLine = testLine;
      }
      
      // If we have 2 lines, check if remaining words fit on line 2
      if (lines.length === 2) {
        // Already have 2 lines, add remaining words to line 2 if they fit
        const remainingWords = words.slice(i + 1);
        if (remainingWords.length > 0) {
          const remainingText = remainingWords.join(" ");
          const remainingWidth = remainingText.length * avgCharWidth + (remainingWords.length - 1) * spaceWidth;
          if (remainingWidth <= maxTitleWidth * 0.98) {
            lines[1] = lines[1] + " " + remainingText;
          }
        }
        break; // Stop processing
      }
    }
    
    // Add remaining line if we have space
    if (currentLine && lines.length < 2) {
      lines.push(currentLine);
    }
    
    // If we have more than 2 lines, intelligently combine
    if (lines.length > 2) {
      // Try to combine lines 1 and 2
      const combined = `${lines[1]} ${lines[2]}`;
      const combinedWidth = combined.length * avgCharWidth + (combined.split(" ").length - 1) * spaceWidth;
      if (combinedWidth <= maxTitleWidth * 0.98) {
        lines[1] = combined;
        lines.splice(2);
      } else {
        // Keep first two lines, ensure line 2 fits
        const maxChars = Math.floor(maxTitleWidth / avgCharWidth);
        if (lines[1].length > maxChars) {
          lines[1] = lines[1].substring(0, maxChars - 3) + "...";
        }
        lines.splice(2);
      }
    }
    
    // Final check: ensure both lines fit properly
    lines.forEach((line, idx) => {
      const lineWidth = line.length * avgCharWidth + (line.split(" ").length - 1) * spaceWidth;
      if (lineWidth > maxTitleWidth * 0.98) {
        const maxChars = Math.floor(maxTitleWidth / avgCharWidth);
        lines[idx] = line.substring(0, maxChars - 3) + "...";
      }
    });

    // Escape HTML entities in text
    const escapeXml = (str) => {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    };

    // Enhanced text with clean, readable rendering (YouTube best practices)
    // Simplified approach - no heavy strokes, just clean bold text with subtle shadow
    const titleSvg = `
      <svg width="${THUMBNAIL_WIDTH}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Clean shadow for text contrast - no heavy effects -->
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        ${lines.map((line, idx) => {
          // Calculate line height with optimal spacing for readability
          const lineHeight = titleFontSize * 1.2; // Clean spacing between lines
          // Use proper baseline alignment
          const yPos = titleY + (idx * lineHeight) + (titleFontSize * 0.8); // Proper baseline calculation
          
          return `
          <!-- Clean, bold, readable text - no heavy effects -->
          <text
            x="${titleX}"
            y="${yPos}"
            font-family="Arial, Helvetica, sans-serif"
            font-size="${titleFontSize}"
            font-weight="bold"
            fill="${textColor}"
            filter="url(#shadow)"
            style="text-rendering: optimizeLegibility; letter-spacing: 0.5px;"
            text-anchor="start"
            dominant-baseline="alphabetic"
          >${escapeXml(line)}</text>
        `;
        }).join("")}
        ${category && showCategoryBadge ? `
          <!-- Subtle category badge in top-left corner (YouTube best practice: avoid bottom-right) -->
          <rect x="40" y="40" width="140" height="28" fill="${theme === "dark" ? "rgba(0, 30, 43, 0.85)" : "rgba(255, 255, 255, 0.9)"}" rx="14" stroke="${accentColor}" stroke-width="2"/>
          <text
            x="110"
            y="58"
            font-family="Arial, Helvetica, sans-serif"
            font-size="12"
            font-weight="700"
            fill="${accentColor}"
            text-anchor="middle"
            dominant-baseline="middle"
            style="text-rendering: optimizeLegibility; letter-spacing: 1px;"
          >${escapeXml(category.toUpperCase())}</text>
        ` : ""}
      </svg>
    `;

    // Composite everything
    const composites = [
      {
        input: Buffer.from(titleSvg),
        top: 0,
        left: 0,
      },
    ];

    // Add face image based on layout (YouTube best practice: faces increase CTR)
    // Make face more prominent and better positioned for visual balance
    if (faceBuffer) {
      const faceSize = 340; // Larger for better prominence
      let faceX, faceY;
      
      // Position face using rule of thirds for better composition
      if (layout === "face-left") {
        faceX = 50; // Left margin
        faceY = 180; // Better vertical balance
      } else if (layout === "face-right") {
        faceX = THUMBNAIL_WIDTH - faceSize - 50; // Right margin
        faceY = 180; // Better vertical balance (aligns with text)
      } else {
        // Centered
        faceX = (THUMBNAIL_WIDTH - faceSize) / 2;
        faceY = 120; // Higher up for centered layout
      }

      // Enhanced border/glow for better separation and visual appeal
      const faceBorder = Buffer.from(`
        <svg width="${faceSize + 16}" height="${faceSize + 16}">
          <defs>
            <radialGradient id="faceGlow" cx="50%" cy="50%">
              <stop offset="0%" style="stop-color:${accentColor};stop-opacity:0.4"/>
              <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.1"/>
            </radialGradient>
          </defs>
          <circle cx="${(faceSize + 16) / 2}" cy="${(faceSize + 16) / 2}" r="${(faceSize + 16) / 2}" fill="url(#faceGlow)"/>
          <circle cx="${(faceSize + 16) / 2}" cy="${(faceSize + 16) / 2}" r="${(faceSize + 8) / 2}" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.5"/>
        </svg>
      `);

      composites.push(
        {
          input: faceBorder,
          top: faceY - 8,
          left: faceX - 8,
          blend: "over",
        },
        {
          input: faceBuffer,
          top: faceY,
          left: faceX,
        }
      );
    }

    // Add MongoDB and MongoDB Minute branding (only if enabled)
    if (showBranding !== false) { // Default to true if not specified
      let logoComposite = null;
      const logoPath = join(process.cwd(), "public", "mongodb-minute.png");
      const mongoLogoPath = join(process.cwd(), "public", "logo.png");
      
      console.log("Adding branding - showBranding:", showBranding);
      console.log("Logo paths:", { logoPath: existsSync(logoPath), mongoLogoPath: existsSync(mongoLogoPath) });
      
      try {
        // Try to use MongoDB Minute logo if available
        if (existsSync(logoPath)) {
          console.log("Using mongodb-minute.png logo");
          const logoBuffer = await readFile(logoPath);
          // Get logo dimensions to calculate proper sizing
          const logoMetadata = await sharp(logoBuffer).metadata();
          const logoAspectRatio = logoMetadata.width / logoMetadata.height;
          const logoHeight = 70; // Larger logo for better visibility
          const logoWidth = Math.round(logoHeight * logoAspectRatio);
          
          const logoResized = await sharp(logoBuffer)
            .resize(logoWidth, logoHeight, { 
              fit: "contain",
              background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
            })
            .png()
            .toBuffer();
          
          // Add "MongoDB Minute" text next to or below logo
          const brandingSvg = `
            <svg width="${THUMBNAIL_WIDTH}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="brandTextShadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                  <feOffset dx="1" dy="1" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.4"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <text
                x="${50 + logoWidth + 15}"
                y="${THUMBNAIL_HEIGHT - 35}"
                font-family="Arial, Helvetica, sans-serif"
                font-size="24"
                font-weight="700"
                fill="${accentColor}"
                opacity="1"
                text-anchor="start"
                dominant-baseline="alphabetic"
                filter="url(#brandTextShadow)"
                style="letter-spacing: 0.8px;"
              >MongoDB Minute</text>
            </svg>
          `;
          
          composites.push({
            input: Buffer.from(brandingSvg),
            top: 0,
            left: 0,
          });
          
          logoComposite = {
            input: logoResized,
            top: THUMBNAIL_HEIGHT - logoHeight - 25, // 25px from bottom
            left: 50,
            blend: "over",
          };
        } else if (existsSync(mongoLogoPath)) {
          console.log("Using logo.png with text");
          // Fallback to MongoDB logo with text
          const logoBuffer = await readFile(mongoLogoPath);
          const logoHeight = 60; // Larger logo
          const logoResized = await sharp(logoBuffer)
            .resize(null, logoHeight, { 
              fit: "contain",
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png()
            .toBuffer();
          
          const logoMetadata = await sharp(logoResized).metadata();
          const logoWidth = logoMetadata.width || 60;
          
          // Add "MongoDB Minute" text next to logo (larger and more visible)
          const brandingSvg = `
            <svg width="${THUMBNAIL_WIDTH}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="textShadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                  <feOffset dx="1" dy="1" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.4"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <text
                x="${50 + logoWidth + 15}"
                y="${THUMBNAIL_HEIGHT - 30}"
                font-family="Arial, Helvetica, sans-serif"
                font-size="26"
                font-weight="700"
                fill="${accentColor}"
                opacity="1"
                text-anchor="start"
                dominant-baseline="alphabetic"
                filter="url(#textShadow)"
                style="letter-spacing: 0.8px;"
              >MongoDB Minute</text>
            </svg>
          `;
          
          composites.push({
            input: Buffer.from(brandingSvg),
            top: 0,
            left: 0,
          });
          
          logoComposite = {
            input: logoResized,
            top: THUMBNAIL_HEIGHT - logoHeight - 25,
            left: 50,
            blend: "over",
          };
        }
      } catch (error) {
        console.warn("Could not load logo files, using SVG fallback:", error.message);
      }
      
      // Fallback to professional SVG branding if logo files not available
      // Make it more visible and prominent
      if (!logoComposite) {
        console.log("Using SVG fallback branding");
        const brandingSvg = `
          <svg width="${THUMBNAIL_WIDTH}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:${accentColor};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${theme === "dark" ? MONGODB_DARK_GREEN : accentColor};stop-opacity:0.9" />
              </linearGradient>
              <filter id="brandShadow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                <feOffset dx="1" dy="1" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <!-- MongoDB Leaf Icon (larger, more visible) -->
            <path d="M 50 ${THUMBNAIL_HEIGHT - 40} L 62 ${THUMBNAIL_HEIGHT - 58} L 74 ${THUMBNAIL_HEIGHT - 40} L 68 ${THUMBNAIL_HEIGHT - 28} L 56 ${THUMBNAIL_HEIGHT - 28} Z" 
                  fill="${accentColor}" 
                  opacity="1"
                  filter="url(#brandShadow)"/>
            <!-- MongoDB Minute Text with better styling and visibility - larger -->
            <text
              x="90"
              y="${THUMBNAIL_HEIGHT - 30}"
              font-family="Arial, Helvetica, sans-serif"
              font-size="26"
              font-weight="700"
              fill="url(#brandGrad)"
              opacity="1"
              text-anchor="start"
              dominant-baseline="alphabetic"
              filter="url(#brandShadow)"
              style="letter-spacing: 1px;"
            >MongoDB Minute</text>
          </svg>
        `;
        
        composites.push({
          input: Buffer.from(brandingSvg),
          top: 0,
          left: 0,
        });
      } else {
        console.log("Adding logo composite to thumbnails");
        composites.push(logoComposite);
      }
    } else {
      console.log("Branding disabled - showBranding:", showBranding);
    }

    // Add video play button overlay (centered, YouTube-style)
    const playButtonSize = 120; // Size of the play button
    const playButtonX = (THUMBNAIL_WIDTH - playButtonSize) / 2;
    const playButtonY = (THUMBNAIL_HEIGHT - playButtonSize) / 2;
    
    const playButtonSvg = `
      <svg width="${THUMBNAIL_WIDTH}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Glow effect for play button -->
          <filter id="playButtonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
            <feOffset dx="0" dy="0" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <!-- Semi-transparent circle background for play button -->
        <circle 
          cx="${playButtonX + playButtonSize / 2}" 
          cy="${playButtonY + playButtonSize / 2}" 
          r="${playButtonSize / 2}" 
          fill="rgba(0, 0, 0, 0.6)"
          filter="url(#playButtonGlow)"
        />
        <!-- Play button triangle -->
        <polygon 
          points="${playButtonX + playButtonSize / 2 + 8},${playButtonY + playButtonSize / 2 - 25} ${playButtonX + playButtonSize / 2 + 8},${playButtonY + playButtonSize / 2 + 25} ${playButtonX + playButtonSize / 2 + 30},${playButtonY + playButtonSize / 2}"
          fill="white"
          opacity="0.95"
        />
      </svg>
    `;

    composites.push({
      input: Buffer.from(playButtonSvg),
      top: 0,
      left: 0,
    });

    // Generate final image with optimization for YouTube (max 2MB)
    let finalBuffer = await image.composite(composites).png().toBuffer();
    
    // Optimize file size to meet YouTube's 2MB limit
    // If too large, convert to JPEG with quality optimization
    const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (finalBuffer.length > maxSizeBytes) {
      // Convert to JPEG with quality optimization
      finalBuffer = await sharp(finalBuffer)
        .jpeg({ quality: 92, mozjpeg: true }) // High quality JPEG
        .toBuffer();
      
      // If still too large, reduce quality further
      if (finalBuffer.length > maxSizeBytes) {
        finalBuffer = await sharp(finalBuffer)
          .jpeg({ quality: 85, mozjpeg: true })
          .toBuffer();
      }
    }

    // Generate small version (optimized for previews)
    const smallBuffer = await sharp(finalBuffer)
      .resize(SMALL_THUMBNAIL_WIDTH, SMALL_THUMBNAIL_HEIGHT, {
        kernel: sharp.kernel.lanczos3, // High-quality resampling
      })
      .png()
      .toBuffer();

    return {
      main: finalBuffer,
      small: smallBuffer,
    };
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    throw error;
  }
}

/**
 * Save thumbnail to Vercel Blob Storage
 * Returns file extension based on buffer format
 */
export async function saveThumbnail(episodeId, thumbnailBuffers) {
  // Determine file extension based on buffer format
  const mainExt = thumbnailBuffers.main[0] === 0xFF && thumbnailBuffers.main[1] === 0xD8 ? "jpg" : "png";
  const mainFilename = `episode-${episodeId}-main.${mainExt}`;
  const smallFilename = `episode-${episodeId}-small.png`;

  // Upload to Vercel Blob Storage
  const mainBlob = await put(`thumbnails/${mainFilename}`, thumbnailBuffers.main, {
    access: 'public',
    contentType: mainExt === 'jpg' ? 'image/jpeg' : 'image/png',
  });

  const smallBlob = await put(`thumbnails/${smallFilename}`, thumbnailBuffers.small, {
    access: 'public',
    contentType: 'image/png',
  });

  return {
    mainUrl: mainBlob.url,
    smallUrl: smallBlob.url,
  };
}

