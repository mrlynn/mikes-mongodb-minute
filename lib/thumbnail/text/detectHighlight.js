/**
 * Detect which word in the title should be highlighted
 * Returns the word in uppercase if found, null otherwise
 */
const HIGHLIGHT_TERMS = [
  "embedded",
  "index",
  "indexes",
  "indexing",
  "schema",
  "search",
  "vector",
  "vectors",
  "aggregation",
  "mongodb",
  "atlas",
  "data",
  "model",
  "query",
  "queries",
  "sharding",
  "replication",
  "transactions",
];

export function detectHighlight(title) {
  if (!title) return null;

  const words = title.toUpperCase().split(" ").filter((w) => w.length > 0);

  // Find first word that contains a highlight term
  for (const word of words) {
    const lowerWord = word.toLowerCase();
    if (HIGHLIGHT_TERMS.some((term) => lowerWord.includes(term))) {
      return word;
    }
  }

  // Fallback: highlight the longest word or second word
  if (words.length > 1) {
    return words[1];
  } else if (words.length > 0) {
    return words[0];
  }

  return null;
}

