"use client";

import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  IconButton,
  Collapse,
  Chip,
} from "@mui/material";
import {
  Description as TranscriptIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { trackEvent } from "./EpisodeAnalytics";

export default function TranscriptViewer({ transcript, categoryData, episodeId }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!transcript) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Track analytics
      if (episodeId) {
        trackEvent("transcript_copy", { episodeId });
      }
    } catch (err) {
      console.error("Failed to copy transcript:", err);
    }
  };

  const handleToggle = () => {
    setExpanded(!expanded);
    
    // Track analytics
    if (episodeId && !expanded) {
      trackEvent("transcript_view", { episodeId });
    }
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

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, mt: 1 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
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
            <TranscriptIcon sx={{ fontSize: 28, color: "#FFFFFF" }} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#001E2B",
              fontSize: { xs: "1.25rem", md: "1.5rem" },
            }}
          >
            Transcript
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={`${transcript.split(/\s+/).length} words`}
            size="small"
            sx={{
              fontSize: "0.75rem",
              height: "24px",
              fontWeight: 500,
              backgroundColor: categoryData.lightBg,
              color: categoryData.color,
            }}
          />
          <IconButton
            onClick={handleCopy}
            size="small"
            sx={{
              color: categoryData.color,
              "&:hover": {
                backgroundColor: categoryData.lightBg,
              },
            }}
          >
            {copied ? (
              <CheckIcon sx={{ fontSize: 20 }} />
            ) : (
              <CopyIcon sx={{ fontSize: 20 }} />
            )}
          </IconButton>
          <IconButton
            onClick={handleToggle}
            sx={{
              color: categoryData.color,
              "&:hover": {
                backgroundColor: categoryData.lightBg,
              },
            }}
          >
            {expanded ? (
              <ExpandLessIcon sx={{ fontSize: 24 }} />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: 24 }} />
            )}
          </IconButton>
        </Stack>
      </Stack>

      <Collapse in={expanded}>
        <Box
          sx={{
            pt: 2,
            "& p": {
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "#001E2B",
              mb: 2,
            },
            whiteSpace: "pre-wrap",
          }}
        >
          {transcript.split("\n\n").map((paragraph, index) => (
            <Typography key={index} variant="body1" sx={{ mb: 2 }}>
              {paragraph.trim()}
            </Typography>
          ))}
        </Box>
      </Collapse>

      {!expanded && (
        <Button
          fullWidth
          onClick={handleToggle}
          endIcon={<ExpandMoreIcon />}
          sx={{
            mt: 2,
            color: categoryData.color,
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              backgroundColor: categoryData.lightBg,
            },
          }}
        >
          Show Full Transcript
        </Button>
      )}
    </Paper>
  );
}

