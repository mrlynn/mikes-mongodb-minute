/**
 * Markdown renderer for episode content
 * Supports: headers, bold, italic, code blocks, inline code, lists, JSON syntax highlighting
 * Server-safe version (no DOM manipulation)
 */

function escapeHtml(text) {
  if (typeof text !== "string") return text;
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function renderMarkdown(content) {
  if (!content) return "";

  let html = content;

  // Process code blocks FIRST (before escaping HTML)
  // This way we can preserve the original code content
  const codeBlocks = [];
  html = html.replace(/```(\w+)?\n?([\s\S]*?)```/gim, (match, lang, code) => {
    const trimmedCode = code.trim();
    const language = lang ? lang.toLowerCase() : "";
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    
    // For JSON, try to format it nicely
    if (language === "json") {
      try {
        const parsed = JSON.parse(trimmedCode);
        const formatted = JSON.stringify(parsed, null, 2);
        codeBlocks.push(`<pre class="code-block json"><code class="language-json">${escapeHtml(formatted)}</code></pre>`);
      } catch (e) {
        // If JSON parsing fails, just display as-is
        codeBlocks.push(`<pre class="code-block json"><code class="language-json">${escapeHtml(trimmedCode)}</code></pre>`);
      }
    } else {
      // For other languages, use the language class
      const langClass = language ? ` language-${language}` : "";
      codeBlocks.push(`<pre class="code-block${langClass}"><code class="language-${language || "text"}">${escapeHtml(trimmedCode)}</code></pre>`);
    }
    
    return placeholder;
  });

  // Now escape HTML for the rest of the content
  html = escapeHtml(html);

  // Restore code blocks (they're already escaped)
  codeBlocks.forEach((block, index) => {
    html = html.replace(`__CODE_BLOCK_${index}__`, block);
  });

  // Inline code (escape the content)
  html = html.replace(/`([^`\n]+)`/gim, (match, code) => {
    return `<code>${escapeHtml(code)}</code>`;
  });

  // Headers (process in order from largest to smallest)
  html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
  html = html.replace(/__(.*?)__/gim, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");
  html = html.replace(/_(.*?)_/gim, "<em>$1</em>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Horizontal rules
  html = html.replace(/^---$/gim, "<hr />");
  html = html.replace(/^\*\*\*$/gim, "<hr />");

  // Ordered lists
  html = html.replace(/^(\d+)\.\s+(.*)$/gim, "<li>$2</li>");
  
  // Unordered lists
  html = html.replace(/^[-*+]\s+(.*)$/gim, "<li>$1</li>");

  // Wrap consecutive list items
  html = html.replace(/(<li>.*<\/li>\n?)+/gim, (match) => {
    // Check if it's an ordered list (starts with number)
    const lines = match.split("\n");
    const firstLine = lines.find(l => l.trim());
    if (firstLine && /^\d+\./.test(firstLine)) {
      return `<ol>${match}</ol>`;
    }
    return `<ul>${match}</ul>`;
  });

  // Blockquotes
  html = html.replace(/^>\s+(.*)$/gim, "<blockquote>$1</blockquote>");

  // Line breaks (double newline = paragraph break)
  html = html.split("\n\n").map((para) => {
    const trimmed = para.trim();
    if (!trimmed) return "";
    
    // Don't wrap if it's already a block element
    if (trimmed.match(/^<(h[1-6]|ul|ol|pre|blockquote|hr)/)) {
      return trimmed;
    }
    
    // Don't wrap if it's just whitespace
    if (!trimmed.replace(/<[^>]+>/g, "").trim()) {
      return trimmed;
    }
    
    return `<p>${trimmed}</p>`;
  }).filter(Boolean).join("\n");

  // Single line breaks (convert to <br>)
  html = html.replace(/\n/g, "<br />");

  return html;
}

/**
 * Client-side version (same as server-side, but kept for compatibility)
 */
export function renderMarkdownClient(content) {
  return renderMarkdown(content);
}

