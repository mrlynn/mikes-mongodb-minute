"use client";

import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Chip,
} from "@mui/material";
import {
  Code as CodeIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  GitHub as GitHubIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { trackEvent } from "./EpisodeAnalytics";

export default function CodeSnippets({ resources = [], githubRepo, categoryData, versionTags, episodeId }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!resources || resources.length === 0) {
    return null;
  }

  const handleCopy = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);

      // Track analytics event
      if (episodeId) {
        trackEvent("code_snippet_copy", { episodeId, snippetIndex: index });
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleGitHubClick = () => {
    if (episodeId) {
      trackEvent("github_outbound_click", { episodeId, repo: githubRepo });
    }
    window.open(githubRepo, "_blank", "noopener,noreferrer");
  };

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
          <CodeIcon sx={{ fontSize: 28, color: "#FFFFFF" }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#001E2B",
            fontSize: { xs: "1.25rem", md: "1.5rem" },
          }}
        >
          Code Examples
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
        {githubRepo && (
          <Button
            variant="outlined"
            startIcon={<GitHubIcon />}
            endIcon={<OpenInNewIcon />}
            onClick={handleGitHubClick}
            sx={{
              borderColor: categoryData.color,
              color: categoryData.color,
              fontWeight: 600,
              px: 3,
              py: 1.5,
              "&:hover": {
                borderColor: categoryData.color,
                backgroundColor: categoryData.lightBg,
              },
            }}
          >
            View on GitHub
          </Button>
        )}
        {versionTags && (
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {versionTags.driverVersion && (
              <Chip
                label={`Driver ${versionTags.driverVersion}`}
                size="small"
                sx={{
                  fontSize: "0.75rem",
                  height: "28px",
                  fontWeight: 600,
                  backgroundColor: categoryData.lightBg,
                  color: categoryData.color,
                  border: `1px solid ${categoryData.color}40`,
                }}
              />
            )}
            {versionTags.atlasFeatures && versionTags.atlasFeatures.length > 0 && (
              versionTags.atlasFeatures.map((feature, idx) => (
                <Chip
                  key={idx}
                  label={feature}
                  size="small"
                  sx={{
                    fontSize: "0.75rem",
                    height: "28px",
                    fontWeight: 500,
                    backgroundColor: "#F7FAFC",
                    color: "#5F6C76",
                    border: "1px solid #E2E8F0",
                  }}
                />
              ))
            )}
          </Stack>
        )}
      </Stack>

      <Stack spacing={3}>
        {resources.map((resource, index) => {
          if (resource.type !== "code" || !resource.content) return null;

          return (
            <Box
              key={index}
              sx={{
                border: `1px solid ${categoryData.color}30`,
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "#F7FAFC",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: categoryData.lightBg,
                  borderBottom: `1px solid ${categoryData.color}30`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "#001E2B",
                    fontSize: { xs: "0.9375rem", md: "1rem" },
                  }}
                >
                  {resource.title || `Code Example ${index + 1}`}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {resource.language && (
                    <Chip
                      label={resource.language}
                      size="small"
                      sx={{
                        fontSize: "0.75rem",
                        height: "24px",
                        fontWeight: 500,
                        backgroundColor: "#FFFFFF",
                        color: categoryData.color,
                      }}
                    />
                  )}
                  <Tooltip title={copiedIndex === index ? "Copied!" : "Copy code"}>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(resource.content, index)}
                      sx={{
                        color: categoryData.color,
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    >
                      {copiedIndex === index ? (
                        <CheckIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <CopyIcon sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              <Box
                sx={{
                  "& pre": {
                    margin: 0,
                    borderRadius: 0,
                    fontSize: { xs: "0.8125rem", md: "0.875rem" },
                  },
                }}
              >
                <SyntaxHighlighter
                  language={resource.language || "javascript"}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: "1.5rem",
                    backgroundColor: "#1E1E1E",
                  }}
                >
                  {resource.content}
                </SyntaxHighlighter>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}

