"use client";

import { renderMarkdownClient } from "@/lib/markdown";
import { Box } from "@mui/material";

export default function MarkdownContent({ content, sx = {} }) {
  if (!content) return null;

  const html = renderMarkdownClient(content);

  return (
    <Box
      sx={{
        "& p": {
          fontSize: "1.0625rem",
          lineHeight: 1.8,
          color: "#001E2B",
          mb: 2,
          "&:last-child": {
            mb: 0,
          },
        },
        "& h1": {
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#001E2B",
          mt: 3,
          mb: 1.5,
        },
        "& h2": {
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#001E2B",
          mt: 3,
          mb: 1.5,
        },
        "& h3": {
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "#001E2B",
          mt: 2.5,
          mb: 1,
        },
        "& h4": {
          fontSize: "1rem",
          fontWeight: 600,
          color: "#001E2B",
          mt: 2,
          mb: 1,
        },
        "& ul, & ol": {
          pl: 3,
          mb: 2,
          "& li": {
            fontSize: "1.0625rem",
            lineHeight: 1.8,
            color: "#001E2B",
            mb: 1,
          },
        },
        "& code": {
          backgroundColor: "#F7FAFC",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "0.9375rem",
          fontFamily: "monospace",
          color: "#00684A",
          border: "1px solid rgba(0, 104, 74, 0.2)",
        },
        "& pre": {
          backgroundColor: "#1E1E1E",
          padding: 2,
          borderRadius: 2,
          overflow: "auto",
          border: "1px solid #E2E8F0",
          mb: 2,
          "& code": {
            backgroundColor: "transparent",
            padding: 0,
            border: "none",
            color: "#D4D4D4",
            fontSize: "0.875rem",
            fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
          },
        },
        "& pre.code-block.json": {
          "& code": {
            color: "#CE9178", // JSON-friendly color
          },
        },
        "& blockquote": {
          borderLeft: "4px solid #00684A",
          pl: 2,
          ml: 2,
          fontStyle: "italic",
          color: "#5F6C76",
          mb: 2,
        },
        "& a": {
          color: "#00684A",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        },
        "& hr": {
          border: "none",
          borderTop: "1px solid #E2E8F0",
          my: 3,
        },
        ...sx,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

