/**
 * Wrap title text across 2-3 lines
 * Max ~14 characters per line
 */
export function wrapTitle(title, maxLines = 3, maxCharsPerLine = 14) {
  if (!title) return [];

  // Convert to uppercase
  const upperTitle = title.toUpperCase();
  const words = upperTitle.split(" ").filter((w) => w.length > 0);

  if (words.length === 0) return [];

  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    // If adding this word would exceed max chars, start a new line
    if (testLine.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }

    // Stop if we've reached max lines
    if (lines.length >= maxLines - 1) {
      // Add remaining words to the last line
      const remainingWords = words.slice(words.indexOf(word) + 1);
      if (remainingWords.length > 0) {
        currentLine = currentLine
          ? `${currentLine} ${remainingWords.join(" ")}`
          : remainingWords.join(" ");
      }
      break;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

