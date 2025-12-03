"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AutoAwesome as AIIcon } from "@mui/icons-material";

const CATEGORIES = [
  "Data Modeling",
  "Indexing",
  "Atlas",
  "Vector & AI",
  "Atlas Search",
  "Aggregation",
  "Security",
  "Migration",
  "New Features",
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export default function AIGenerateDialog({ open, onClose, onGenerate }) {
  const [formData, setFormData] = useState({
    topic: "",
    category: "",
    difficulty: "",
    additionalContext: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleGenerate() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/generate-episode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate episode");
      }

      const data = await res.json();
      onGenerate(data.episode);

      // Reset form and close
      setFormData({
        topic: "",
        category: "",
        difficulty: "",
        additionalContext: "",
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) {
      setFormData({
        topic: "",
        category: "",
        difficulty: "",
        additionalContext: "",
      });
      setError(null);
      onClose();
    }
  }

  const isValid = formData.topic && formData.category && formData.difficulty;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <AIIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            AI Generate Episode
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Provide details about your episode and let AI craft a 60-second script
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            required
            label="Episode Topic"
            value={formData.topic}
            onChange={(e) => handleChange("topic", e.target.value)}
            placeholder="e.g., Why embedded documents beat joins"
            variant="outlined"
            disabled={loading}
            helperText="What MongoDB concept or technique should this episode cover?"
          />

          <TextField
            fullWidth
            required
            select
            label="Category"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            variant="outlined"
            disabled={loading}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            required
            select
            label="Difficulty Level"
            value={formData.difficulty}
            onChange={(e) => handleChange("difficulty", e.target.value)}
            variant="outlined"
            disabled={loading}
          >
            {DIFFICULTIES.map((diff) => (
              <MenuItem key={diff} value={diff}>
                {diff}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Additional Context (Optional)"
            value={formData.additionalContext}
            onChange={(e) => handleChange("additionalContext", e.target.value)}
            placeholder="Any specific examples, code snippets, or details to include..."
            variant="outlined"
            disabled={loading}
            helperText="Provide extra context to help AI generate better content"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={!isValid || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <AIIcon />}
          sx={{ fontWeight: 600 }}
        >
          {loading ? "Generating..." : "Generate Episode"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
