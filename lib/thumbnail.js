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

// MongoDB brand colors per Visual Branding Guidelines v1
const SPRING_GREEN = "#00ED64"; // Primary accent - Spring Green
const FOREST_GREEN = "#00684A"; // Forest Green
const EVERGREEN = "#023430"; // Evergreen
const SLATE_GRAY = "#1C1C1C"; // Secondary neutral
const MIST = "#E6F4EA"; // Secondary neutral
const OFF_WHITE = "#FAFAFA"; // Secondary neutral
const WHITE = "#FFFFFF";
const BLACK = "#000000";

/**
 * Generate MongoDB-branded background templates per Visual Branding Guidelines v1
 * 5 reusable templates: dark gradient, diagonal tech grid, brutalist blocks, leaf pattern, geometric lines
 */
async function generateBackground(theme = "dark", backgroundId = "default") {
  const width = THUMBNAIL_WIDTH;
  const height = THUMBNAIL_HEIGHT;
  const accentColor = SPRING_GREEN;
  const darkBg = EVERGREEN;
  const darkEnd = SLATE_GRAY;
  const lightBg = OFF_WHITE;
  const lightEnd = MIST;

  let svg = "";

  // Template 1: Dark gradient (Evergreen to Slate)
  if (backgroundId === "dark-gradient" || backgroundId === "default") {
    svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${theme === "dark" ? EVERGREEN : lightBg};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${theme === "dark" ? SLATE_GRAY : lightEnd};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)"/>
      </svg>
    `;
  }
  // Template 2: Diagonal tech grid with soft green glow
  else if (backgroundId === "tech-grid") {
    svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${theme === "dark" ? EVERGREEN : lightBg};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${theme === "dark" ? SLATE_GRAY : lightEnd};stop-opacity:1" />
          </linearGradient>
          <pattern id="diagGrid" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="${theme === "dark" ? accentColor : FOREST_GREEN}" stroke-width="1.5" opacity="0.15"/>
          </pattern>
          <radialGradient id="glow" cx="70%" cy="30%">
            <stop offset="0%" style="stop-color:${accentColor};stop-opacity:0.2"/>
            <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)"/>
        <rect width="100%" height="100%" fill="url(#diagGrid)"/>
        <rect width="100%" height="100%" fill="url(#glow)"/>
      </svg>
    `;
  }
  // Template 3: Flat brutalist block shapes in grayscale
  else if (backgroundId === "brutalist") {
    svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${theme === "dark" ? SLATE_GRAY : lightBg};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${theme === "dark" ? "#0F0F0F" : "#E0E0E0"};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)"/>
        <!-- Brutalist blocks -->
        <rect x="${width * 0.6}" y="${height * 0.2}" width="${width * 0.25}" height="${height * 0.15}" fill="${theme === "dark" ? accentColor : FOREST_GREEN}" opacity="0.08"/>
        <rect x="${width * 0.75}" y="${height * 0.5}" width="${width * 0.2}" height="${height * 0.2}" fill="${theme === "dark" ? accentColor : FOREST_GREEN}" opacity="0.12"/>
        <rect x="${width * 0.65}" y="${height * 0.7}" width="${width * 0.3}" height="${height * 0.1}" fill="${theme === "dark" ? accentColor : FOREST_GREEN}" opacity="0.06"/>
      </svg>
    `;
  }
  // Template 4: MongoDB leaf pattern - subtle, low opacity
  else if (backgroundId === "leaf-pattern") {
    svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${theme === "dark" ? EVERGREEN : lightBg};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${theme === "dark" ? SLATE_GRAY : lightEnd};stop-opacity:1" />
          </linearGradient>
          <pattern id="leafPattern" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M 100 20 L 120 60 L 100 100 L 80 60 Z" fill="${accentColor}" opacity="0.05"/>
            <path d="M 100 20 Q 140 40 120 60 Q 100 80 100 100" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.08"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)"/>
        <rect width="100%" height="100%" fill="url(#leafPattern)"/>
      </svg>
    `;
  }
  // Template 5: Abstract geometric lines in Spring Green
  else if (backgroundId === "geometric") {
    svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${theme === "dark" ? EVERGREEN : lightBg};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${theme === "dark" ? SLATE_GRAY : lightEnd};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)"/>
        <!-- Geometric lines on right side (clean negative space on left for face) -->
        <line x1="${width * 0.7}" y1="0" x2="${width * 0.7}" y2="${height}" stroke="${accentColor}" stroke-width="2" opacity="0.15"/>
        <line x1="${width * 0.85}" y1="0" x2="${width * 0.85}" y2="${height}" stroke="${accentColor}" stroke-width="1.5" opacity="0.12"/>
        <line x1="${width * 0.6}" y1="${height * 0.3}" x2="${width}" y2="${height * 0.3}" stroke="${accentColor}" stroke-width="2" opacity="0.15"/>
        <line x1="${width * 0.65}" y1="${height * 0.7}" x2="${width}" y2="${height * 0.7}" stroke="${accentColor}" stroke-width="1.5" opacity="0.12"/>
      </svg>
    `;
  }
  // Default fallback
  else {
    svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${theme === "dark" ? EVERGREEN : lightBg};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${theme === "dark" ? SLATE_GRAY : lightEnd};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)"/>
      </svg>
    `;
  }

  return Buffer.from(svg);
}

/**
 * Generate topic reinforcement graphic (small icon on right side)
 * Per Visual Branding Guidelines v1: 8-12% of thumbnail width, 1-2 colors max, flat and bold
 */
function generateTopicGraphic(category, width = THUMBNAIL_WIDTH) {
  const iconSize = Math.round(width * 0.1); // 10% of width (between 8-12%)
  const iconX = width - iconSize - 60; // Right side with margin
  const iconY = Math.round(THUMBNAIL_HEIGHT * 0.4); // Vertical center-right
  
  // Simple flat icons based on category
  let iconSvg = "";
  const categoryLower = (category || "").toLowerCase();
  
  if (categoryLower.includes("index") || categoryLower.includes("query")) {
    // Index/query icon - simple upward arrow
    iconSvg = `
      <svg width="${width}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="iconShadow">
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
        <!-- Simple upward arrow -->
        <polygon 
          points="${iconX + iconSize / 2},${iconY} ${iconX + iconSize * 0.25},${iconY + iconSize * 0.6} ${iconX + iconSize * 0.75},${iconY + iconSize * 0.6}" 
          fill="${SPRING_GREEN}" 
          opacity="0.7" 
          filter="url(#iconShadow)"
        />
      </svg>
    `;
  } else if (categoryLower.includes("schema") || categoryLower.includes("model")) {
    // Schema/model icon - document stack
    iconSvg = `
      <svg width="${width}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="iconShadow">
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
        <rect x="${iconX}" y="${iconY}" width="${iconSize * 0.7}" height="${iconSize * 0.5}" fill="${SPRING_GREEN}" opacity="0.8" filter="url(#iconShadow)"/>
        <rect x="${iconX + iconSize * 0.15}" y="${iconY + iconSize * 0.1}" width="${iconSize * 0.7}" height="${iconSize * 0.5}" fill="${SPRING_GREEN}" opacity="0.6" filter="url(#iconShadow)"/>
        <rect x="${iconX + iconSize * 0.3}" y="${iconY + iconSize * 0.2}" width="${iconSize * 0.7}" height="${iconSize * 0.5}" fill="${SPRING_GREEN}" opacity="0.4" filter="url(#iconShadow)"/>
      </svg>
    `;
  } else if (categoryLower.includes("search") || categoryLower.includes("vector")) {
    // Search/vector icon - magnifying glass
    iconSvg = `
      <svg width="${width}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="iconShadow">
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
        <circle cx="${iconX + iconSize * 0.4}" cy="${iconY + iconSize * 0.4}" r="${iconSize * 0.3}" fill="none" stroke="${SPRING_GREEN}" stroke-width="4" opacity="0.8" filter="url(#iconShadow)"/>
        <line x1="${iconX + iconSize * 0.65}" y1="${iconY + iconSize * 0.65}" x2="${iconX + iconSize}" y2="${iconY + iconSize}" stroke="${SPRING_GREEN}" stroke-width="4" opacity="0.8" filter="url(#iconShadow)"/>
      </svg>
    `;
  } else if (categoryLower.includes("aggregation") || categoryLower.includes("pipeline")) {
    // Aggregation icon - connected nodes
    iconSvg = `
      <svg width="${width}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="iconShadow">
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
        <circle cx="${iconX + iconSize * 0.2}" cy="${iconY + iconSize / 2}" r="${iconSize * 0.15}" fill="${SPRING_GREEN}" opacity="0.8" filter="url(#iconShadow)"/>
        <circle cx="${iconX + iconSize / 2}" cy="${iconY + iconSize / 2}" r="${iconSize * 0.15}" fill="${SPRING_GREEN}" opacity="0.8" filter="url(#iconShadow)"/>
        <circle cx="${iconX + iconSize * 0.8}" cy="${iconY + iconSize / 2}" r="${iconSize * 0.15}" fill="${SPRING_GREEN}" opacity="0.8" filter="url(#iconShadow)"/>
        <line x1="${iconX + iconSize * 0.35}" y1="${iconY + iconSize / 2}" x2="${iconX + iconSize * 0.65}" y2="${iconY + iconSize / 2}" stroke="${SPRING_GREEN}" stroke-width="3" opacity="0.8" filter="url(#iconShadow)"/>
      </svg>
    `;
  }
  // Default: simple MongoDB leaf (only if category exists, otherwise return empty)
  else if (category && category.trim().length > 0) {
    iconSvg = `
      <svg width="${width}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="iconShadow">
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
        <!-- Simple MongoDB leaf shape -->
        <path 
          d="M ${iconX + iconSize / 2} ${iconY} 
             L ${iconX + iconSize * 0.6} ${iconY + iconSize * 0.4} 
             L ${iconX + iconSize / 2} ${iconY + iconSize} 
             L ${iconX + iconSize * 0.4} ${iconY + iconSize * 0.4} Z" 
          fill="${SPRING_GREEN}" 
          opacity="0.7"
          filter="url(#iconShadow)"
        />
      </svg>
    `;
  } else {
    // No category, return empty SVG
    iconSvg = `<svg width="${width}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg"></svg>`;
  }
  
  return Buffer.from(iconSvg);
}

/**
 * Process face image per Visual Branding Guidelines v1
 * - Shoulders + head visible, cropped around upper chest
 * - Warm face tones, slight contrast boost
 * - Optional accent rim-light in MongoDB green
 */
async function processFaceImage(faceBuffer, size = 400, addRimLight = true) {
  // Process face with warm tones and contrast boost
  let processed = sharp(faceBuffer)
    .resize(size, size, {
      fit: "cover",
      position: "center", // Focus on face/upper chest
    })
    // Enhance warm tones and contrast
    .modulate({
      brightness: 1.05, // Slight brightness boost
      saturation: 1.1, // Enhance warm skin tones
    })
    .sharpen()
    .normalize(); // Improve contrast

  // Add optional rim-light effect in MongoDB green
  if (addRimLight) {
    const rimLightSvg = Buffer.from(`
      <svg width="${size}" height="${size}">
        <defs>
          <radialGradient id="rimGrad" cx="50%" cy="50%">
            <stop offset="0%" style="stop-color:${SPRING_GREEN};stop-opacity:0"/>
            <stop offset="60%" style="stop-color:${SPRING_GREEN};stop-opacity:0"/>
            <stop offset="90%" style="stop-color:${SPRING_GREEN};stop-opacity:0.15"/>
            <stop offset="100%" style="stop-color:${SPRING_GREEN};stop-opacity:0.25"/>
          </radialGradient>
        </defs>
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#rimGrad)"/>
      </svg>
    `);
    
    processed = processed.composite([
      {
        input: rimLightSvg,
        blend: "over",
      },
    ]);
  }

  // Crop to circle
  return await processed
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
  showTopicGraphic = false, // Topic reinforcement graphic (optional, off by default)
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
          console.log("Fetching face image from URL:", faceImageUrl);
          const response = await fetch(faceImageUrl);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            faceImage = Buffer.from(arrayBuffer);
            console.log("Successfully loaded face image from URL, size:", faceImage.length);
          } else {
            console.warn("Failed to fetch face image, status:", response.status);
          }
        } else if (faceImageUrl.startsWith('/')) {
          // Local file path - try to read from public directory
          const localPath = join(process.cwd(), "public", faceImageUrl);
          console.log("Trying to load face image from local path:", localPath);
          if (existsSync(localPath)) {
            faceImage = await readFile(localPath);
            console.log("Successfully loaded face image from local path, size:", faceImage.length);
          } else {
            console.warn("Face image file not found at:", localPath);
          }
        }

        if (faceImage) {
          console.log("Processing face image...");
          faceBuffer = await processFaceImage(faceImage, 400, true); // 400px for shoulders+head, with rim-light
          console.log("Face image processed successfully, buffer size:", faceBuffer.length);
        } else {
          console.warn("No face image loaded from URL:", faceImageUrl);
        }
      } catch (error) {
        console.error("Error loading face image:", error);
        // Continue without face image if there's an error
      }
    }

    // Visual Branding Guidelines v1: Composition Template
    // Left side = Mike, Right side = topic graphic, Top = text
    
    const textColor = theme === "dark" ? WHITE : SLATE_GRAY;
    const accentColor = SPRING_GREEN; // Always use Spring Green for accents
    
    // Typography: MongoDB Sans/Inter/IBM Plex Sans, extra-bold
    // Use Inter (closest to MongoDB Sans) with extra-bold weight
    // ALWAYS show full title - adjust font size dynamically to fit
    
    // Text positioning: Top of thumbnail, left-aligned (accounting for face on left)
    const faceSpace = faceBuffer ? 450 : 0; // Space for face on left
    const maxTitleWidth = THUMBNAIL_WIDTH - faceSpace - 200; // Leave space for face + right graphic
    const titleY = 120; // Top area for text
    const titleX = faceBuffer ? faceSpace + 60 : 60; // Start after face space with margin, or from left if no face

    // Get all words - no truncation
    const words = titleText.split(" ").filter(w => w.length > 0);
    
    // Identify keyword to highlight (typically the most important technical term)
    const technicalTerms = ['index', 'query', 'schema', 'vector', 'search', 'aggregation', 'atlas', 'mongodb', 'data', 'model'];
    let highlightWord = null;
    const highlightIndex = words.findIndex(w => 
      technicalTerms.some(term => w.toLowerCase().includes(term))
    );
    if (highlightIndex >= 0) {
      highlightWord = words[highlightIndex].toUpperCase();
    } else if (words.length > 0) {
      // Fallback: highlight the longest word or second word
      highlightWord = (words.length > 1 ? words[1] : words[0]).toUpperCase();
    }
    
    // Smart word wrap: Try to fit in 2 lines, but allow more if needed
    // Start with maximum font size and reduce until it fits
    let titleFontSize = 90; // Start with large font
    const minFontSize = 50; // Minimum readable font size
    let lines = [];
    let fits = false;
    
    // Try different font sizes until the title fits
    while (titleFontSize >= minFontSize && !fits) {
      const avgCharWidth = titleFontSize * 0.6; // Inter extra-bold is wider
      const spaceWidth = titleFontSize * 0.35; // Space between words
      
      // Try to wrap into 2 lines first
      lines = [];
      let currentLine = "";
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const wordCount = testLine.split(" ").length;
        const lineWidth = testLine.length * avgCharWidth + (wordCount - 1) * spaceWidth;
        
        // If adding this word exceeds width and we already have a line, start new line
        if (lineWidth > maxTitleWidth * 0.95 && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
        
        // If we have 2 lines and still have words, check if remaining fits
        if (lines.length === 2 && i < words.length - 1) {
          const remainingWords = words.slice(i + 1);
          const remainingText = remainingWords.join(" ");
          const remainingWidth = remainingText.length * avgCharWidth + (remainingWords.length - 1) * spaceWidth;
          if (remainingWidth <= maxTitleWidth * 0.95) {
            // All remaining words fit on line 2
            if (currentLine) {
              lines.push(currentLine);
            }
            if (remainingText) {
              lines[1] = (lines[1] || "") + (lines[1] ? " " : "") + remainingText;
            }
            fits = true;
            break;
          } else {
            // Doesn't fit in 2 lines, reduce font size and try again
            break;
          }
        }
      }
      
      // Add the last line if we haven't exceeded 2 lines
      if (currentLine && lines.length < 2) {
        lines.push(currentLine);
        fits = true;
      } else if (lines.length === 2 && currentLine) {
        // Check if we can add remaining to line 2
        const line2Width = (lines[1] || "").length * avgCharWidth + ((lines[1] || "").split(" ").length - 1) * spaceWidth;
        const currentLineWidth = currentLine.length * avgCharWidth + (currentLine.split(" ").length - 1) * spaceWidth;
        if (line2Width + spaceWidth + currentLineWidth <= maxTitleWidth * 0.95) {
          lines[1] = (lines[1] || "") + (lines[1] ? " " : "") + currentLine;
          fits = true;
        } else {
          // Doesn't fit, reduce font and try again
          titleFontSize -= 2;
          continue;
        }
      }
      
      // Verify all lines fit
      if (fits) {
        let allFit = true;
        for (const line of lines) {
          const lineWidth = line.length * avgCharWidth + (line.split(" ").length - 1) * spaceWidth;
          if (lineWidth > maxTitleWidth * 0.95) {
            allFit = false;
            break;
          }
        }
        if (!allFit) {
          fits = false;
          titleFontSize -= 2;
        }
      } else {
        titleFontSize -= 2;
      }
    }
    
    // If still doesn't fit at minimum size, use minimum and allow more lines
    if (!fits && titleFontSize < minFontSize) {
      titleFontSize = minFontSize;
      const avgCharWidth = titleFontSize * 0.6;
      const spaceWidth = titleFontSize * 0.35;
      lines = [];
      let currentLine = "";
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const wordCount = testLine.split(" ").length;
        const lineWidth = testLine.length * avgCharWidth + (wordCount - 1) * spaceWidth;
        
        if (lineWidth > maxTitleWidth * 0.95 && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
    }
    
    // Final font size and character width calculations
    const avgCharWidth = titleFontSize * 0.6;
    const spaceWidth = titleFontSize * 0.35;

    // Escape HTML entities in text
    const escapeXml = (str) => {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    };

    // Typography per Visual Branding Guidelines v1
    // Inter (closest to MongoDB Sans), extra-bold, all caps or title case, highlight ONE keyword in Spring Green
    const titleSvg = `
      <svg width="${THUMBNAIL_WIDTH}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Text shadow for contrast -->
          <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        ${lines.map((line, idx) => {
          const lineHeight = titleFontSize * 1.25;
          const yPos = titleY + (idx * lineHeight) + (titleFontSize * 0.85);
          
          // Convert to title case (capitalize first letter of each word)
          const titleCaseLine = line.split(" ").map(w => 
            w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
          ).join(" ");
          
          // Split line into words and highlight the keyword
          const lineWords = titleCaseLine.split(" ");
          let currentX = titleX;
          const wordSpacing = spaceWidth;
          
          return lineWords.map((word, wordIdx) => {
            // Case-insensitive keyword matching
            const isHighlight = highlightWord && word.toUpperCase() === highlightWord.toUpperCase();
            const wordColor = isHighlight ? accentColor : textColor;
            const wordText = escapeXml(word);
            
            // Calculate word position
            const wordSvg = `
              <text
                x="${currentX}"
                y="${yPos}"
                font-family="Inter, 'IBM Plex Sans', 'MongoDB Sans', Arial, Helvetica, sans-serif"
                font-size="${titleFontSize}"
                font-weight="900"
                fill="${wordColor}"
                filter="url(#textShadow)"
                style="text-rendering: optimizeLegibility; letter-spacing: 1px;"
                text-anchor="start"
                dominant-baseline="alphabetic"
              >${wordText}</text>
            `;
            
            // Update X position for next word
            currentX += word.length * avgCharWidth + wordSpacing;
            
            return wordSvg;
          }).join("");
        }).join("")}
        ${category && showCategoryBadge ? `
          <!-- Category badge in top-left corner -->
          <rect x="40" y="40" width="140" height="28" fill="${theme === "dark" ? "rgba(28, 28, 28, 0.9)" : "rgba(255, 255, 255, 0.95)"}" rx="14" stroke="${accentColor}" stroke-width="2"/>
          <text
            x="110"
            y="58"
            font-family="Inter, Arial, Helvetica, sans-serif"
            font-size="12"
            font-weight="900"
            fill="${accentColor}"
            text-anchor="middle"
            dominant-baseline="middle"
            style="text-rendering: optimizeLegibility; letter-spacing: 1.5px;"
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

    // Visual Branding Guidelines v1: Face on LEFT side
    // Left third of frame, 10-12% margin from left edge, shoulders + head visible
    if (faceBuffer) {
      const faceSize = 400; // Larger for prominence (shoulders + head visible)
      const leftMargin = Math.round(THUMBNAIL_WIDTH * 0.11); // 11% margin (between 10-12%)
      const faceX = leftMargin;
      const faceY = Math.round(THUMBNAIL_HEIGHT * 0.35); // Vertical center-left for balance

      // Subtle glow effect (rim-light already in processFaceImage)
      const faceGlow = Buffer.from(`
        <svg width="${faceSize + 20}" height="${faceSize + 20}">
          <defs>
            <radialGradient id="faceGlow" cx="50%" cy="50%">
              <stop offset="0%" style="stop-color:${accentColor};stop-opacity:0.2"/>
              <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0"/>
            </radialGradient>
          </defs>
          <circle cx="${(faceSize + 20) / 2}" cy="${(faceSize + 20) / 2}" r="${(faceSize + 20) / 2}" fill="url(#faceGlow)"/>
        </svg>
      `);

      composites.push(
        {
          input: faceGlow,
          top: faceY - 10,
          left: faceX - 10,
          blend: "over",
        },
        {
          input: faceBuffer,
          top: faceY,
          left: faceX,
        }
      );
    }

    // Visual Branding Guidelines v1: Brand mark (stopwatch + MongoDB leaf)
    // Bottom-right corner, 6-8% of thumbnail width, 70-80% opacity
    if (showBranding !== false) {
      const brandMarkSize = Math.round(THUMBNAIL_WIDTH * 0.07); // 7% of width (between 6-8%)
      const brandMarkX = THUMBNAIL_WIDTH - brandMarkSize - 40; // Right margin
      const brandMarkY = THUMBNAIL_HEIGHT - brandMarkSize - 40; // Bottom margin
      
      const brandMarkSvg = `
        <svg width="${THUMBNAIL_WIDTH}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="brandMarkShadow">
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
          <!-- Stopwatch circle -->
          <circle 
            cx="${brandMarkX + brandMarkSize / 2}" 
            cy="${brandMarkY + brandMarkSize / 2}" 
            r="${brandMarkSize / 2 - 4}" 
            fill="none" 
            stroke="${accentColor}" 
            stroke-width="3" 
            opacity="0.75"
            filter="url(#brandMarkShadow)"
          />
          <!-- Stopwatch hands (12 o'clock position) -->
          <line 
            x1="${brandMarkX + brandMarkSize / 2}" 
            y1="${brandMarkY + brandMarkSize / 2}" 
            x2="${brandMarkX + brandMarkSize / 2}" 
            y2="${brandMarkY + brandMarkSize / 2 - brandMarkSize / 4}" 
            stroke="${accentColor}" 
            stroke-width="2.5" 
            opacity="0.75"
          />
          <!-- MongoDB Leaf (small, inside stopwatch) -->
          <path 
            d="M ${brandMarkX + brandMarkSize / 2} ${brandMarkY + brandMarkSize / 2 - 8} 
               L ${brandMarkX + brandMarkSize / 2 + 6} ${brandMarkY + brandMarkSize / 2 + 4} 
               L ${brandMarkX + brandMarkSize / 2} ${brandMarkY + brandMarkSize / 2 + 12} 
               L ${brandMarkX + brandMarkSize / 2 - 6} ${brandMarkY + brandMarkSize / 2 + 4} Z" 
            fill="${accentColor}" 
            opacity="0.75"
            filter="url(#brandMarkShadow)"
          />
        </svg>
      `;
      
      composites.push({
        input: Buffer.from(brandMarkSvg),
        top: 0,
        left: 0,
      });
    }

    // Visual Branding Guidelines v1: Topic reinforcement graphic
    // Right side, 8-12% of width, small and simple
    // Only show if explicitly enabled and category is provided
    if (showTopicGraphic && category && category.trim().length > 0) {
      try {
        const topicGraphic = generateTopicGraphic(category);
        composites.push({
          input: topicGraphic,
          top: 0,
          left: 0,
        });
      } catch (error) {
        console.warn("Error generating topic graphic:", error);
        // Continue without topic graphic if there's an error
      }
    }

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

