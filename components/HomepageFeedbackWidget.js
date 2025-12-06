"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Chip,
  Stack,
  IconButton,
  Collapse,
  Alert,
} from "@mui/material";
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Close as CloseIcon,
  Send as SendIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from "@mui/icons-material";
import { toast } from "./Toast";
import { useTheme } from "@/contexts/ThemeContext";

const WEEKLY_QUESTIONS = [
  "Which MongoDB topic is hardest right now?",
  "Which format do you want next: Schema, AI, Aggregation?",
  "What's confusing in MongoDB right now?",
  "Which episode helped you most this week?",
];

const TOPIC_OPTIONS = [
  "Data Modeling",
  "Aggregations",
  "Indexing",
  "Vector Search",
  "Atlas Search",
  "AI Workflows",
  "Security",
  "Migration",
];

export default function HomepageFeedbackWidget() {
  const { darkMode } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("poll"); // "poll" | "topics" | "text"
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [freeText, setFreeText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Get current week's question (rotate weekly)
  const weekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
  const currentQuestion = WEEKLY_QUESTIONS[weekNumber % WEEKLY_QUESTIONS.length];

  const handlePollSubmit = async (value) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: "home",
          type: "satisfaction",
          value: value === "yes" ? "helpful" : "notHelpful",
          text: `${currentQuestion}: ${value}`,
        }),
      });

      if (response.ok) {
        toast.success("Thanks for your feedback!");
        setSubmitted(true);
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

  const handleTopicSubmit = async () => {
    if (selectedTopics.length === 0) {
      toast.info("Please select at least one topic");
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: "home",
          type: "freeText",
          text: `I'd like to see more episodes on: ${selectedTopics.join(", ")}`,
        }),
      });

      if (response.ok) {
        toast.success("Thanks! We'll prioritize these topics.");
        setSubmitted(true);
        setSelectedTopics([]);
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
          page: "home",
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

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  if (!expanded) {
    return (
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          startIcon={<QuestionAnswerIcon />}
          onClick={() => setExpanded(true)}
          sx={{
            background: "linear-gradient(135deg, #00684A 0%, #004D37 100%)",
            color: "#FFFFFF",
            borderRadius: "24px",
            px: 3,
            py: 1.5,
            boxShadow: "0px 4px 12px rgba(0, 104, 74, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #00ED64 0%, #00684A 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0px 6px 16px rgba(0, 237, 100, 0.4)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Share Feedback
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 1000,
        width: { xs: "calc(100% - 48px)", sm: "400px" },
        maxWidth: "400px",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: darkMode ? "#1A2F2A" : "#FFFFFF",
          border: darkMode ? "1px solid #2D4A3F" : "1px solid #E2E8F0",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            background: "linear-gradient(135deg, #00684A 0%, #004D37 100%)",
            color: "#FFFFFF",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
            Your Feedback Matters
          </Typography>
          <IconButton
            size="small"
            onClick={() => setExpanded(false)}
            sx={{ color: "#FFFFFF" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Box
          sx={{
            display: "flex",
            borderBottom: darkMode ? "1px solid #2D4A3F" : "1px solid #E2E8F0",
          }}
        >
          {["poll", "topics", "text"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              sx={{
                flex: 1,
                py: 1.5,
                textTransform: "capitalize",
                color:
                  activeTab === tab
                    ? "#00684A"
                    : darkMode
                    ? "#A0AEC0"
                    : "#5F6C76",
                borderBottom:
                  activeTab === tab ? "2px solid #00684A" : "2px solid transparent",
                fontWeight: activeTab === tab ? 600 : 400,
                "&:hover": {
                  backgroundColor: darkMode
                    ? "rgba(0, 237, 100, 0.05)"
                    : "rgba(0, 104, 74, 0.05)",
                },
              }}
            >
              {tab === "poll" ? "Quick Poll" : tab === "topics" ? "Topics" : "Share"}
            </Button>
          ))}
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          {submitted ? (
            <Alert severity="success" sx={{ mb: 0 }}>
              Thank you! Your feedback has been recorded.
            </Alert>
          ) : (
            <>
              {/* Poll Tab */}
              {activeTab === "poll" && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: darkMode ? "#CBD5E0" : "#2D3748",
                      fontWeight: 500,
                    }}
                  >
                    {currentQuestion}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<ThumbUpIcon />}
                      onClick={() => handlePollSubmit("yes")}
                      disabled={submitting}
                      fullWidth
                      sx={{
                        borderColor: "#00684A",
                        color: "#00684A",
                        "&:hover": {
                          borderColor: "#00ED64",
                          backgroundColor: "rgba(0, 237, 100, 0.1)",
                        },
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ThumbDownIcon />}
                      onClick={() => handlePollSubmit("no")}
                      disabled={submitting}
                      fullWidth
                      sx={{
                        borderColor: "#5F6C76",
                        color: "#5F6C76",
                        "&:hover": {
                          borderColor: "#E63946",
                          backgroundColor: "rgba(230, 57, 70, 0.1)",
                        },
                      }}
                    >
                      No
                    </Button>
                  </Stack>
                </Box>
              )}

              {/* Topics Tab */}
              {activeTab === "topics" && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: darkMode ? "#CBD5E0" : "#2D3748",
                      fontWeight: 500,
                    }}
                  >
                    I'd like to see more episodes on:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {TOPIC_OPTIONS.map((topic) => (
                      <Chip
                        key={topic}
                        label={topic}
                        onClick={() => toggleTopic(topic)}
                        color={selectedTopics.includes(topic) ? "primary" : "default"}
                        sx={{
                          backgroundColor: selectedTopics.includes(topic)
                            ? "#00684A"
                            : darkMode
                            ? "#2D4A3F"
                            : "#EDF2F7",
                          color: selectedTopics.includes(topic)
                            ? "#FFFFFF"
                            : darkMode
                            ? "#CBD5E0"
                            : "#2D3748",
                          "&:hover": {
                            backgroundColor: selectedTopics.includes(topic)
                              ? "#004D37"
                              : darkMode
                              ? "#1A3A2F"
                              : "#CBD5E0",
                          },
                        }}
                      />
                    ))}
                  </Stack>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={handleTopicSubmit}
                    disabled={submitting || selectedTopics.length === 0}
                    fullWidth
                    sx={{
                      background: "linear-gradient(135deg, #00684A 0%, #004D37 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #00ED64 0%, #00684A 100%)",
                      },
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              )}

              {/* Free Text Tab */}
              {activeTab === "text" && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: darkMode ? "#CBD5E0" : "#2D3748",
                      fontWeight: 500,
                    }}
                  >
                    What's on your mind? Share your thoughts, frustrations, or ideas.
                  </Typography>
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    value={freeText}
                    onChange={(e) => setFreeText(e.target.value)}
                    placeholder="Tell us what you think..."
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
                    fullWidth
                    sx={{
                      background: "linear-gradient(135deg, #00684A 0%, #004D37 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #00ED64 0%, #00684A 100%)",
                      },
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

