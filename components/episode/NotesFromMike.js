"use client";

import {
  Paper,
  Typography,
  Box,
  Stack,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from "@mui/icons-material";

export default function NotesFromMike({ notes, categoryData }) {
  if (!notes) return null;

  return (
    <Paper
      sx={{
        p: { xs: 3, md: 4 },
        mb: 4,
        borderRadius: 3,
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: categoryData.gradient,
        }}
      />

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3, mt: 1 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            background: categoryData.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PersonIcon sx={{ fontSize: 28, color: "#FFFFFF" }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#001E2B",
            fontSize: { xs: "1.25rem", md: "1.5rem" },
          }}
        >
          Notes From Mike
        </Typography>
      </Stack>

      <Box
        sx={{
          "& p": {
            fontSize: "1.0625rem",
            lineHeight: 1.8,
            color: "#001E2B",
            mb: 2,
          },
          "& strong": {
            color: categoryData.color,
            fontWeight: 600,
          },
        }}
        dangerouslySetInnerHTML={{ __html: formatNotes(notes) }}
      />
    </Paper>
  );
}

// Helper to format notes content
function formatNotes(content) {
  if (!content) return "";

  let html = content;

  // Convert markdown-style formatting to HTML
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");

  // Paragraphs
  html = html.split("\n\n").map((para) => {
    if (para.trim()) {
      return `<p>${para.trim()}</p>`;
    }
    return para;
  }).join("");

  return html;
}

