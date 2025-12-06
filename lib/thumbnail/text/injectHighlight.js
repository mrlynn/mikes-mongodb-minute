import { detectHighlight } from "./detectHighlight";

const SPRING_GREEN = "#00ED64";

/**
 * Inject highlight into title lines
 * Returns lines with highlight information for @vercel/og rendering
 * Since @vercel/og doesn't support HTML, we return structured data
 */
export function injectHighlight(lines) {
  if (!lines || lines.length === 0) return lines.map(line => ({ text: line, highlightWord: null }));

  // Join lines to find the highlight word
  const fullText = lines.join(" ");
  const highlightWord = detectHighlight(fullText);

  if (!highlightWord) {
    return lines.map(line => ({ text: line, highlightWord: null }));
  }

  // Return structured data for each line
  return lines.map((line) => {
    // Check if this line contains the highlight word
    const regex = new RegExp(`\\b${highlightWord}\\b`, "gi");
    const hasHighlight = regex.test(line);
    
    return {
      text: line,
      highlightWord: hasHighlight ? highlightWord : null,
    };
  });
}

