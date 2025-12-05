"use client";

import { useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Chip,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Timer as TimerIcon,
} from "@mui/icons-material";

// Average speaking rate: 150-160 words per minute (2.5-2.67 words per second)
const WORDS_PER_SECOND = 2.5;
const TARGET_DURATION = 60; // seconds

// Target word counts for each section (based on time allocation)
const TARGET_WORDS = {
  hook: { min: 10, max: 25, seconds: 5 }, // 0-5s
  problem: { min: 30, max: 50, seconds: 10 }, // 5-15s
  tip: { min: 75, max: 125, seconds: 30 }, // 15-45s
  quickWin: { min: 20, max: 35, seconds: 7 }, // 45-52s
  cta: { min: 20, max: 35, seconds: 8 }, // 52-60s
};

function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function estimateReadingTime(text) {
  const words = countWords(text);
  return Math.ceil(words / WORDS_PER_SECOND);
}

export default function ContentQualityChecker({ formData }) {
  const quality = useMemo(() => {
    const checks = {
      completion: [],
      timing: [],
      quality: [],
    };

    // Check completion
    const requiredFields = ["title", "hook", "problem", "tip", "quickWin", "cta", "category", "difficulty"];
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        checks.completion.push({
          field,
          status: "error",
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
        });
      } else {
        checks.completion.push({
          field,
          status: "success",
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} is complete`,
        });
      }
    });

    // Check timing for each section
    Object.keys(TARGET_WORDS).forEach((section) => {
      const text = formData[section] || "";
      const words = countWords(text);
      const target = TARGET_WORDS[section];
      const estimatedSeconds = estimateReadingTime(text);

      if (words === 0) {
        checks.timing.push({
          section,
          status: "error",
          message: `${section} is empty`,
          words: 0,
          target: `${target.min}-${target.max}`,
          seconds: 0,
        });
      } else if (words < target.min) {
        checks.timing.push({
          section,
          status: "warning",
          message: `${section} is too short (${words} words, target: ${target.min}-${target.max})`,
          words,
          target: `${target.min}-${target.max}`,
          seconds: estimatedSeconds,
        });
      } else if (words > target.max) {
        checks.timing.push({
          section,
          status: "warning",
          message: `${section} is too long (${words} words, target: ${target.min}-${target.max})`,
          words,
          target: `${target.min}-${target.max}`,
          seconds: estimatedSeconds,
        });
      } else {
        checks.timing.push({
          section,
          status: "success",
          message: `${section} is well-sized (${words} words)`,
          words,
          target: `${target.min}-${target.max}`,
          seconds: estimatedSeconds,
        });
      }
    });

    // Calculate total estimated time
    const totalSeconds = checks.timing.reduce((sum, check) => sum + check.seconds, 0);
    const totalWords = checks.timing.reduce((sum, check) => sum + check.words, 0);

    // Overall quality score
    const completionScore = (checks.completion.filter((c) => c.status === "success").length / checks.completion.length) * 100;
    const timingScore = (checks.timing.filter((c) => c.status === "success").length / checks.timing.length) * 100;
    const overallScore = (completionScore + timingScore) / 2;

    return {
      checks,
      totalSeconds,
      totalWords,
      overallScore: Math.round(overallScore),
      isReady: completionScore === 100 && totalSeconds >= 55 && totalSeconds <= 65,
    };
  }, [formData]);

  const completionCount = quality.checks.completion.filter((c) => c.status === "success").length;
  const totalRequired = quality.checks.completion.length;
  const timingIssues = quality.checks.timing.filter((c) => c.status !== "success").length;

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #E2E8F0",
        backgroundColor: "#F7FAFC",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#001E2B" }}>
          Content Quality Check
        </Typography>
        <Chip
          label={`${quality.overallScore}% Complete`}
          color={quality.overallScore >= 80 ? "success" : quality.overallScore >= 60 ? "warning" : "error"}
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      {/* Overall Progress */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Overall Progress
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#001E2B" }}>
            {quality.overallScore}%
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={quality.overallScore}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "#E2E8F0",
            "& .MuiLinearProgress-bar": {
              backgroundColor: quality.overallScore >= 80 ? "#00684A" : quality.overallScore >= 60 ? "#00ED64" : "#E63946",
            },
          }}
        />
      </Box>

      {/* Timing Summary */}
      <Box
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          backgroundColor: quality.totalSeconds >= 55 && quality.totalSeconds <= 65 ? "#E6F7F0" : "#FFF4E6",
          border: `1px solid ${quality.totalSeconds >= 55 && quality.totalSeconds <= 65 ? "#00ED64" : "#FFA726"}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
          <TimerIcon sx={{ color: quality.totalSeconds >= 55 && quality.totalSeconds <= 65 ? "#00684A" : "#FF9800" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#001E2B" }}>
            Estimated Duration
          </Typography>
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#001E2B", mb: 0.5 }}>
          {quality.totalSeconds}s
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Target: 55-65 seconds | Total words: {quality.totalWords}
          {quality.totalSeconds < 55 && " (too short)"}
          {quality.totalSeconds > 65 && " (too long)"}
        </Typography>
      </Box>

      {/* Completion Status */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#001E2B" }}>
          Completion ({completionCount}/{totalRequired})
        </Typography>
        <List dense sx={{ py: 0 }}>
          {quality.checks.completion.map((check, index) => (
            <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                {check.status === "success" ? (
                  <CheckCircleIcon sx={{ color: "#00684A", fontSize: 18 }} />
                ) : (
                  <ErrorIcon sx={{ color: "#E63946", fontSize: 18 }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={check.message}
                primaryTypographyProps={{
                  variant: "caption",
                  color: check.status === "success" ? "text.secondary" : "error",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Timing Issues */}
      {timingIssues > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {timingIssues} section{timingIssues > 1 ? "s" : ""} need{timingIssues === 1 ? "s" : ""} timing adjustment
        </Alert>
      )}

      {/* Section Timing Details */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#001E2B" }}>
          Section Timing
        </Typography>
        <Stack spacing={1}>
          {quality.checks.timing.map((check, index) => (
            <Box
              key={index}
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: check.status === "success" ? "#E6F7F0" : "#FFF4E6",
                border: `1px solid ${check.status === "success" ? "#00ED64" : "#FFA726"}`,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" sx={{ fontWeight: 600, textTransform: "capitalize", color: "#001E2B" }}>
                  {check.section}
                </Typography>
                <Chip
                  label={`${check.words} words • ${check.seconds}s`}
                  size="small"
                  sx={{
                    fontSize: "0.65rem",
                    height: "20px",
                    backgroundColor: check.status === "success" ? "#00684A" : "#FF9800",
                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                />
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                Target: {check.target} words
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Ready to Publish Indicator */}
      {quality.isReady && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            ✓ Content is ready for review! All sections are complete and timing is optimal.
          </Typography>
        </Alert>
      )}
    </Paper>
  );
}

