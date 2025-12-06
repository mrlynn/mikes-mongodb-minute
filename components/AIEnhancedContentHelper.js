"use client";

import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import {
  AutoAwesome as AIIcon,
  Lightbulb as LightbulbIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

const ENHANCED_IMPROVEMENT_TYPES = [
  {
    value: "generate-summary",
    label: "Generate Summary",
    description: "Create a concise one-sentence summary from the episode content",
  },
  {
    value: "improve-summary",
    label: "Improve Summary",
    description: "Enhance the existing summary to be more compelling",
  },
  {
    value: "generate-deep-dive",
    label: "Generate Deep Dive",
    description: "Create an expanded technical explanation from the 60-second script",
  },
  {
    value: "expand-deep-dive",
    label: "Expand Deep Dive",
    description: "Add more detail and examples to the existing deep dive content",
  },
  {
    value: "generate-key-concepts",
    label: "Generate Key Concepts",
    description: "Generate pitfalls, when-to-use, and when-not-to-use from content",
  },
  {
    value: "improve-pitfalls",
    label: "Improve Pitfalls",
    description: "Enhance the pitfalls section with more specific examples",
  },
  {
    value: "improve-when-to-use",
    label: "Improve When to Use",
    description: "Enhance the when-to-use section with better scenarios",
  },
  {
    value: "improve-when-not-to-use",
    label: "Improve When NOT to Use",
    description: "Enhance the when-not-to-use section with clearer guidance",
  },
  {
    value: "suggest-tags",
    label: "Suggest Tags",
    description: "Generate relevant tags based on episode content",
  },
];

export default function AIEnhancedContentHelper({ formData, onImprove }) {
  const [improvementType, setImprovementType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastImproved, setLastImproved] = useState(null);

  async function handleImprove() {
    if (!improvementType) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/improve-enhanced-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          improvementType,
          currentContent: formData,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to improve content");
      }

      const data = await res.json();
      setLastImproved({ type: improvementType, field: data.field });
      onImprove?.(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getFieldForType(type) {
    const fieldMap = {
      "generate-summary": "summary",
      "improve-summary": "summary",
      "generate-deep-dive": "deepDive",
      "expand-deep-dive": "deepDive",
      "generate-key-concepts": "keyConcepts",
      "improve-pitfalls": "keyConcepts",
      "improve-when-to-use": "keyConcepts",
      "improve-when-not-to-use": "keyConcepts",
      "suggest-tags": "tags",
    };
    return fieldMap[type] || "";
  }

  function getCurrentValue(type) {
    const field = getFieldForType(type);
    if (field === "keyConcepts") {
      if (type === "improve-pitfalls") return formData.keyConcepts?.pitfalls || "";
      if (type === "improve-when-to-use") return formData.keyConcepts?.whenToUse || "";
      if (type === "improve-when-not-to-use") return formData.keyConcepts?.whenNotToUse || "";
      return "Multiple fields";
    }
    if (field === "tags") {
      return Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags || "";
    }
    return formData[field] || "";
  }

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: { xs: 2, md: 3 },
        border: "1px solid #E2E8F0",
        backgroundColor: "#FFFFFF",
        mb: 3,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <AIIcon sx={{ color: "#00684A" }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#001E2B", fontSize: { xs: "0.9375rem", md: "1rem" } }}>
          AI Enhanced Content Helper
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: { xs: "0.875rem", md: "0.9375rem" } }}>
        Use AI to generate or improve enhanced content fields like summaries, deep dives, and key concepts
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {lastImproved && (
        <Alert severity="success" onClose={() => setLastImproved(null)} sx={{ mb: 2 }}>
          Successfully improved {lastImproved.field}! Check the form above.
        </Alert>
      )}

      <Stack spacing={2}>
        <TextField
          fullWidth
          select
          label="What would you like to generate or improve?"
          value={improvementType}
          onChange={(e) => setImprovementType(e.target.value)}
          variant="outlined"
          size="small"
        >
          {ENHANCED_IMPROVEMENT_TYPES.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: "0.875rem", md: "0.9375rem" } }}>
                  {type.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
                  {type.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </TextField>

        {improvementType && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#F7FAFC",
              border: "1px solid #E2E8F0",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <LightbulbIcon sx={{ fontSize: 18, color: "#00684A" }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#001E2B", fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
                Current {getFieldForType(improvementType)}:
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontStyle: "italic",
                fontSize: { xs: "0.8125rem", md: "0.875rem" },
                maxHeight: 100,
                overflow: "auto",
              }}
            >
              {getCurrentValue(improvementType) || "Empty"}
            </Typography>
          </Box>
        )}

        <Button
          variant="contained"
          onClick={handleImprove}
          disabled={!improvementType || loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AIIcon />}
          fullWidth
          sx={{
            fontWeight: 600,
            backgroundColor: "#00684A",
            "&:hover": {
              backgroundColor: "#004D37",
            },
            fontSize: { xs: "0.875rem", md: "0.9375rem" },
          }}
        >
          {loading ? "Generating..." : "Generate/Improve Content"}
        </Button>
      </Stack>
    </Paper>
  );
}

