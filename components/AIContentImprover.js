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

const IMPROVEMENT_TYPES = [
  { value: "polish-hook", label: "Polish Hook", description: "Make the hook more engaging and attention-grabbing" },
  { value: "expand-tip", label: "Expand Tip", description: "Add more detail and examples to the tip section" },
  { value: "improve-title", label: "Improve Title", description: "Generate a more catchy and SEO-friendly title" },
  { value: "strengthen-cta", label: "Strengthen CTA", description: "Make the call-to-action more compelling" },
  { value: "add-context", label: "Add Context", description: "Enhance the problem section with more context" },
  { value: "enhance-quick-win", label: "Enhance Quick Win", description: "Make the quick win more impactful with metrics" },
];

export default function AIContentImprover({ formData, onImprove }) {
  const [improvementType, setImprovementType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastImproved, setLastImproved] = useState(null);

  async function handleImprove() {
    if (!improvementType) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/improve-content", {
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
      "polish-hook": "hook",
      "expand-tip": "tip",
      "improve-title": "title",
      "strengthen-cta": "cta",
      "add-context": "problem",
      "enhance-quick-win": "quickWin",
    };
    return fieldMap[type] || "";
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #E2E8F0",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <AIIcon sx={{ color: "#00684A" }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#001E2B" }}>
          AI Content Improver
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Use AI to enhance specific sections of your episode content
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
          label="What would you like to improve?"
          value={improvementType}
          onChange={(e) => setImprovementType(e.target.value)}
          variant="outlined"
          size="small"
        >
          {IMPROVEMENT_TYPES.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {type.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
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
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#001E2B" }}>
                Current {getFieldForType(improvementType)}:
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
              {formData[getFieldForType(improvementType)] || "Empty"}
            </Typography>
          </Box>
        )}

        <Button
          variant="contained"
          onClick={handleImprove}
          disabled={!improvementType || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <AIIcon />}
          fullWidth
          sx={{
            fontWeight: 600,
            backgroundColor: "#00684A",
            "&:hover": {
              backgroundColor: "#004D37",
            },
          }}
        >
          {loading ? "Improving..." : "Improve Content"}
        </Button>
      </Stack>
    </Paper>
  );
}

