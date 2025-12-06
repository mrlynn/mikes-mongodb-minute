"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  IconButton,
  Collapse,
  Alert,
  Divider,
} from "@mui/material";
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Close as CloseIcon,
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { toast } from "@/components/Toast";
import { useTheme } from "@/contexts/ThemeContext";

export default function EpisodeFeedback({ episodeId }) {
  const { darkMode } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [helpful, setHelpful] = useState(null);
  const [freeText, setFreeText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleHelpfulSubmit = async (value) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId,
          page: "episode",
          type: "satisfaction",
          value: value ? "helpful" : "notHelpful",
        }),
      });

      if (response.ok) {
        setHelpful(value);
        toast.success("Thanks for your feedback!");
        if (!value) {
          // If not helpful, expand text input
          setExpanded(true);
        } else {
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false);
            setHelpful(null);
          }, 3000);
        }
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFreeTextSubmit = async () => {
    if (!freeText.trim()) {
      toast.info("Please enter some feedback");
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId,
          page: "episode",
          type: "freeText",
          text: freeText.trim(),
        }),
      });

      if (response.ok) {
        toast.success("Thanks for sharing your thoughts!");
        setSubmitted(true);
        setFreeText("");
        setTimeout(() => {
          setExpanded(false);
          setSubmitted(false);
        }, 2000);
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        mt: 4,
        background: darkMode ? "#13181D" : "#FFFFFF",
        border: darkMode ? "1px solid #2D4A3F" : "1px solid #E2E8F0",
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: darkMode ? "#E2E8F0" : "#001E2B",
        }}
      >
        Was this helpful?
      </Typography>

      {submitted ? (
        <Alert severity="success">Thank you! Your feedback helps us improve.</Alert>
      ) : (
        <>
          {/* Thumbs Up/Down */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant={helpful === true ? "contained" : "outlined"}
              startIcon={<ThumbUpIcon />}
              onClick={() => handleHelpfulSubmit(true)}
              disabled={submitting}
              sx={{
                flex: 1,
                borderColor: helpful === true ? "#00684A" : "#00684A",
                backgroundColor:
                  helpful === true
                    ? "#00684A"
                    : darkMode
                    ? "transparent"
                    : "transparent",
                color: helpful === true ? "#FFFFFF" : "#00684A",
                "&:hover": {
                  borderColor: "#00ED64",
                  backgroundColor:
                    helpful === true
                      ? "#004D37"
                      : darkMode
                      ? "rgba(0, 237, 100, 0.1)"
                      : "rgba(0, 237, 100, 0.1)",
                },
              }}
            >
              Helpful
            </Button>
            <Button
              variant={helpful === false ? "contained" : "outlined"}
              startIcon={<ThumbDownIcon />}
              onClick={() => handleHelpfulSubmit(false)}
              disabled={submitting}
              sx={{
                flex: 1,
                borderColor: helpful === false ? "#E63946" : "#5F6C76",
                backgroundColor:
                  helpful === false
                    ? "#E63946"
                    : darkMode
                    ? "transparent"
                    : "transparent",
                color: helpful === false ? "#FFFFFF" : "#5F6C76",
                "&:hover": {
                  borderColor: "#E63946",
                  backgroundColor:
                    helpful === false
                      ? "#C62828"
                      : darkMode
                      ? "rgba(230, 57, 70, 0.1)"
                      : "rgba(230, 57, 70, 0.1)",
                },
              }}
            >
              Not Helpful
            </Button>
          </Stack>

          {/* Expandable Free Text */}
          <Box>
            <Button
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{
                color: darkMode ? "#00ED64" : "#00684A",
                textTransform: "none",
                mb: expanded ? 2 : 0,
              }}
            >
              {expanded
                ? "Hide feedback form"
                : "What was unclear or missing? (Optional)"}
            </Button>

            <Collapse in={expanded}>
              <Box>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="Tell us what was unclear, what you'd like to see more of, or any other feedback..."
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: darkMode ? "#13181D" : "#FFFFFF",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleFreeTextSubmit}
                  disabled={submitting || !freeText.trim()}
                  sx={{
                    background: "linear-gradient(135deg, #00684A 0%, #004D37 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #00ED64 0%, #00684A 100%)",
                    },
                  }}
                >
                  Submit Feedback
                </Button>
              </Box>
            </Collapse>
          </Box>
        </>
      )}
    </Paper>
  );
}

