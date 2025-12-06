"use client";

import {
  Paper,
  Typography,
  Box,
  Stack,
  Alert,
} from "@mui/material";
import {
  Article as ArticleIcon,
  Lightbulb as LightbulbIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

export default function DeepDiveSection({ deepDive, categoryData, keyConcepts }) {
  if (!deepDive) return null;

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
          <ArticleIcon sx={{ fontSize: 28, color: "#FFFFFF" }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#001E2B",
            fontSize: { xs: "1.25rem", md: "1.5rem" },
          }}
        >
          Deep Dive
        </Typography>
      </Stack>

      {/* Key Concept Callouts */}
      {keyConcepts && (
        <Stack spacing={2} sx={{ mb: 4 }}>
          {keyConcepts.pitfalls && (
            <Alert
              severity="warning"
              icon={<WarningIcon />}
              sx={{
                backgroundColor: "#FFF4E6",
                border: "1px solid #FFA726",
                "& .MuiAlert-icon": {
                  color: "#FF9800",
                },
                "& .MuiAlert-message": {
                  color: "#001E2B",
                },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                ⚠️ Pitfalls to Avoid
              </Typography>
              <Typography variant="body2">{keyConcepts.pitfalls}</Typography>
            </Alert>
          )}

          {keyConcepts.whenToUse && (
            <Alert
              severity="success"
              icon={<CheckCircleIcon />}
              sx={{
                backgroundColor: "#E6F7F0",
                border: "1px solid #00ED64",
                "& .MuiAlert-icon": {
                  color: "#00684A",
                },
                "& .MuiAlert-message": {
                  color: "#001E2B",
                },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                ✅ When to Use
              </Typography>
              <Typography variant="body2">{keyConcepts.whenToUse}</Typography>
            </Alert>
          )}

          {keyConcepts.whenNotToUse && (
            <Alert
              severity="info"
              icon={<LightbulbIcon />}
              sx={{
                backgroundColor: "#E3F2FD",
                border: "1px solid #2196F3",
                "& .MuiAlert-icon": {
                  color: "#1976D2",
                },
                "& .MuiAlert-message": {
                  color: "#001E2B",
                },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                💡 When NOT to Use
              </Typography>
              <Typography variant="body2">{keyConcepts.whenNotToUse}</Typography>
            </Alert>
          )}
        </Stack>
      )}

      <Box
        sx={{
          "& p": {
            fontSize: "1.0625rem",
            lineHeight: 1.8,
            color: "#001E2B",
            mb: 2,
          },
          "& h3": {
            fontSize: "1.25rem",
            fontWeight: 700,
            color: categoryData.color,
            mt: 3,
            mb: 1.5,
          },
          "& h4": {
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#001E2B",
            mt: 2.5,
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
            color: categoryData.color,
            border: `1px solid ${categoryData.color}30`,
          },
          "& pre": {
            backgroundColor: "#F7FAFC",
            padding: 2,
            borderRadius: 2,
            overflow: "auto",
            border: `1px solid ${categoryData.color}30`,
            "& code": {
              backgroundColor: "transparent",
              padding: 0,
              border: "none",
            },
          },
        }}
        dangerouslySetInnerHTML={{ __html: formatDeepDive(deepDive) }}
      />
    </Paper>
  );
}

import { renderMarkdown } from "@/lib/markdown";

// Helper to format deep dive content (supports markdown-like syntax)
function formatDeepDive(content) {
  return renderMarkdown(content);
}

