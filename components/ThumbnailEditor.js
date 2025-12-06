"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Image as ImageIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Lightbulb as LightbulbIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useTheme } from "@/contexts/ThemeContext";

const LAYOUTS = [
  { value: "face-left", label: "Face Left" },
  { value: "face-right", label: "Face Right" },
  { value: "centered", label: "Centered Face" },
];

const THEMES = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

const BACKGROUNDS = [
  { value: "default", label: "Dark Gradient" },
  { value: "tech-grid", label: "Tech Grid" },
  { value: "brutalist", label: "Brutalist Blocks" },
  { value: "leaf-pattern", label: "Leaf Pattern" },
  { value: "geometric", label: "Geometric Lines" },
];

export default function ThumbnailEditor({ episodeId, episode, onThumbnailSaved }) {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [thumbnailConfig, setThumbnailConfig] = useState({
    titleText: episode?.title || "",
    layout: episode?.thumbnail?.layout || "face-right",
    theme: episode?.thumbnail?.theme || "dark",
    backgroundType: episode?.thumbnail?.backgroundType || "template",
    backgroundId: episode?.thumbnail?.backgroundId || "default",
    faceAssetUrl: episode?.thumbnail?.faceAssetUrl || null,
    faceSource: episode?.thumbnail?.faceSource || "upload",
    category: episode?.category || "",
    showCategoryBadge: episode?.thumbnail?.showCategoryBadge !== false, // Default to true, but allow disabling
    showBranding: episode?.thumbnail?.showBranding !== false, // Default to true, but allow disabling
    showTopicGraphic: episode?.thumbnail?.showTopicGraphic || false, // Default to false (off by default)
  });

  const [previewUrl, setPreviewUrl] = useState(episode?.thumbnail?.mainUrl || null);
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (episode?.thumbnail?.mainUrl) {
      setPreviewUrl(episode.thumbnail.mainUrl);
    }
  }, [episode]);

  const getTextFieldSx = (customSx = {}) => ({
    "& .MuiOutlinedInput-root": {
      color: darkMode ? "#E2E8F0" : "inherit",
      "& fieldset": {
        borderColor: darkMode ? "#2D3748" : "rgba(0, 0, 0, 0.23)",
      },
      "&:hover fieldset": {
        borderColor: darkMode ? "#00ED64" : "rgba(0, 0, 0, 0.87)",
      },
      "&.Mui-focused fieldset": {
        borderColor: darkMode ? "#00ED64" : "#00684A",
      },
      backgroundColor: darkMode ? "#0F1419" : "transparent",
    },
    "& .MuiInputLabel-root": {
      color: darkMode ? "#A0AEC0" : "rgba(0, 0, 0, 0.6)",
      "&.Mui-focused": {
        color: darkMode ? "#00ED64" : "#00684A",
      },
    },
    "& .MuiInputBase-input": {
      color: darkMode ? "#E2E8F0" : "inherit",
    },
    ...customSx,
  });

  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("episodeId", episodeId);

      const res = await fetch("/api/thumbnail/upload-face", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      setThumbnailConfig((prev) => ({
        ...prev,
        faceAssetUrl: data.url,
        faceSource: "upload",
      }));

      // Auto-generate preview after upload
      setTimeout(() => generatePreview(), 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function generatePreview() {
    if (!thumbnailConfig.titleText) {
      setError("Please enter a title");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/thumbnail/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId,
          ...thumbnailConfig,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Preview generation failed");
      }

      const data = await res.json();
      setPreviewUrl(data.previewUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveThumbnail() {
    if (!thumbnailConfig.titleText) {
      setError("Please enter a title");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/thumbnail/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId,
          ...thumbnailConfig,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }

      const data = await res.json();
      setPreviewUrl(data.mainUrl);
      setSuccess("Thumbnail saved successfully!");
      
      if (onThumbnailSaved) {
        onThumbnailSaved(data.thumbnail);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function fetchTitleSuggestions() {
    setLoadingSuggestions(true);
    try {
      const res = await fetch("/api/thumbnail/title-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId,
          title: episode?.title,
          description: episode?.tip || episode?.problem,
          tags: episode?.tags || [],
          category: episode?.category,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTitleSuggestions(data.suggestions || []);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    } finally {
      setLoadingSuggestions(false);
    }
  }

  function handleConfigChange(field, value) {
    setThumbnailConfig((prev) => ({ ...prev, [field]: value }));
  }

  function useSuggestion(suggestion) {
    handleConfigChange("titleText", suggestion);
    setTitleSuggestions([]);
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left Side: Controls */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            {/* Face Source */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: darkMode ? "#13181D" : "background.paper",
                border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: darkMode ? "#E2E8F0" : "inherit" }}>
                Face Source
              </Typography>
              
              {thumbnailConfig.faceAssetUrl ? (
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: 200,
                      height: 200,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: `3px solid ${darkMode ? "#00ED64" : "#00684A"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: darkMode ? "#0F1419" : "#F7FAFC",
                    }}
                  >
                    <img
                      src={thumbnailConfig.faceAssetUrl}
                      alt="Face"
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleConfigChange("faceAssetUrl", null)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ) : null}

              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                disabled={loading}
                fullWidth
                sx={{
                  borderColor: darkMode ? "#00ED64" : "#00684A",
                  color: darkMode ? "#00ED64" : "#00684A",
                  "&:hover": {
                    borderColor: darkMode ? "#00ED64" : "#00684A",
                    backgroundColor: darkMode ? "rgba(0, 237, 100, 0.1)" : "rgba(0, 104, 74, 0.1)",
                  },
                }}
              >
                {loading ? "Uploading..." : "Upload Headshot"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Button>
            </Paper>

            {/* Title */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: darkMode ? "#13181D" : "background.paper",
                border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? "#E2E8F0" : "inherit" }}>
                  Title
                </Typography>
                <Button
                  size="small"
                  startIcon={<LightbulbIcon />}
                  onClick={fetchTitleSuggestions}
                  disabled={loadingSuggestions}
                  sx={{ fontSize: "0.75rem" }}
                >
                  Suggest
                </Button>
              </Stack>

              <TextField
                fullWidth
                value={thumbnailConfig.titleText}
                onChange={(e) => handleConfigChange("titleText", e.target.value)}
                placeholder="Enter thumbnail title (3-5 words recommended)"
                variant="outlined"
                inputProps={{ maxLength: 50 }}
                error={thumbnailConfig.titleText.split(" ").filter(w => w.length > 0).length > 7}
                helperText={
                  (() => {
                    const wordCount = thumbnailConfig.titleText.split(" ").filter(w => w.length > 0).length;
                    const charCount = thumbnailConfig.titleText.length;
                    let helper = `${charCount}/50 characters • ${wordCount} words`;
                    
                    if (wordCount > 7) {
                      helper += " ⚠️ Too many words - may be cut off";
                    } else if (wordCount > 5) {
                      helper += " ⚠️ Consider shortening (3-5 words recommended)";
                    } else if (wordCount >= 3 && wordCount <= 5) {
                      helper += " ✓ Optimal length";
                    } else if (wordCount > 0) {
                      helper += " (3-5 words recommended)";
                    }
                    
                    return helper;
                  })()
                }
                sx={getTextFieldSx()}
              />

              {titleSuggestions.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                    Suggestions:
                  </Typography>
                  <Stack spacing={1}>
                    {titleSuggestions.map((suggestion, idx) => (
                      <Chip
                        key={idx}
                        label={suggestion}
                        onClick={() => useSuggestion(suggestion)}
                        sx={{
                          justifyContent: "flex-start",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: darkMode ? "#1A2F2A" : "rgba(0, 104, 74, 0.1)",
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>

            {/* Style Presets */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: darkMode ? "#13181D" : "background.paper",
                border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: darkMode ? "#E2E8F0" : "inherit" }}>
                Style Presets
              </Typography>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  select
                  label="Layout"
                  value={thumbnailConfig.layout}
                  onChange={(e) => handleConfigChange("layout", e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={getTextFieldSx()}
                >
                  {LAYOUTS.map((layout) => (
                    <MenuItem key={layout.value} value={layout.value}>
                      {layout.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Theme"
                  value={thumbnailConfig.theme}
                  onChange={(e) => handleConfigChange("theme", e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={getTextFieldSx()}
                >
                  {THEMES.map((theme) => (
                    <MenuItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Background"
                  value={thumbnailConfig.backgroundId}
                  onChange={(e) => handleConfigChange("backgroundId", e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={getTextFieldSx()}
                >
                  {BACKGROUNDS.map((bg) => (
                    <MenuItem key={bg.value} value={bg.value}>
                      {bg.label}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Category Badge Toggle */}
                {thumbnailConfig.category && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                      Show Category Badge
                    </Typography>
                    <Button
                      variant={thumbnailConfig.showCategoryBadge ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleConfigChange("showCategoryBadge", !thumbnailConfig.showCategoryBadge)}
                      fullWidth
                      sx={{
                        ...(thumbnailConfig.showCategoryBadge
                          ? {
                              background: darkMode
                                ? "linear-gradient(135deg, #00ED64 0%, #00684A 100%)"
                                : undefined,
                              color: darkMode ? "#001E2B" : undefined,
                            }
                          : {
                              borderColor: darkMode ? "#2D3748" : "#E2E8F0",
                              color: darkMode ? "#A0AEC0" : "inherit",
                            }),
                      }}
                    >
                      {thumbnailConfig.showCategoryBadge ? "Visible" : "Hidden"}
                    </Button>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", fontSize: "0.7rem" }}>
                      Category badge appears in top-left corner
                    </Typography>
                  </Box>
                )}

                {/* Branding Toggle */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                    Show MongoDB Branding
                  </Typography>
                  <Button
                    variant={thumbnailConfig.showBranding ? "contained" : "outlined"}
                    size="small"
                    onClick={() => handleConfigChange("showBranding", !thumbnailConfig.showBranding)}
                    fullWidth
                    sx={{
                      ...(thumbnailConfig.showBranding
                        ? {
                            background: darkMode
                              ? "linear-gradient(135deg, #00ED64 0%, #00684A 100%)"
                              : undefined,
                            color: darkMode ? "#001E2B" : undefined,
                          }
                        : {
                            borderColor: darkMode ? "#2D3748" : "#E2E8F0",
                            color: darkMode ? "#A0AEC0" : "inherit",
                          }),
                    }}
                  >
                    {thumbnailConfig.showBranding ? "Visible" : "Hidden"}
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", fontSize: "0.7rem" }}>
                    MongoDB Minute branding appears in bottom-right corner
                  </Typography>
                </Box>

                {/* Topic Graphic Toggle */}
                {thumbnailConfig.category && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                      Show Topic Icon
                    </Typography>
                    <Button
                      variant={thumbnailConfig.showTopicGraphic ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleConfigChange("showTopicGraphic", !thumbnailConfig.showTopicGraphic)}
                      fullWidth
                      sx={{
                        ...(thumbnailConfig.showTopicGraphic
                          ? {
                              background: darkMode
                                ? "linear-gradient(135deg, #00ED64 0%, #00684A 100%)"
                                : undefined,
                              color: darkMode ? "#001E2B" : undefined,
                            }
                          : {
                              borderColor: darkMode ? "#2D3748" : "#E2E8F0",
                              color: darkMode ? "#A0AEC0" : "inherit",
                            }),
                      }}
                    >
                      {thumbnailConfig.showTopicGraphic ? "Visible" : "Hidden"}
                    </Button>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", fontSize: "0.7rem" }}>
                      Small icon on right side (optional)
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* Actions */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: darkMode ? "#13181D" : "background.paper",
                border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
              }}
            >
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={generatePreview}
                  disabled={loading || !thumbnailConfig.titleText}
                  fullWidth
                  sx={{
                    borderColor: darkMode ? "#00ED64" : "#00684A",
                    color: darkMode ? "#00ED64" : "#00684A",
                    "&:hover": {
                      borderColor: darkMode ? "#00ED64" : "#00684A",
                      backgroundColor: darkMode ? "rgba(0, 237, 100, 0.1)" : "rgba(0, 104, 74, 0.1)",
                    },
                  }}
                >
                  {loading ? "Generating..." : "Generate Preview"}
                </Button>

                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={saveThumbnail}
                  disabled={saving || !thumbnailConfig.titleText}
                  fullWidth
                  sx={{
                    background: darkMode
                      ? "linear-gradient(135deg, #00ED64 0%, #00684A 100%)"
                      : undefined,
                    color: darkMode ? "#001E2B" : undefined,
                    "&:hover": darkMode
                      ? {
                          background: "linear-gradient(135deg, #00ED64 0%, #00684A 100%)",
                          filter: "brightness(1.1)",
                        }
                      : undefined,
                  }}
                >
                  {saving ? "Saving..." : "Save Thumbnail"}
                </Button>
              </Stack>
            </Paper>

            {/* Messages */}
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" onClose={() => setSuccess(null)}>
                {success}
              </Alert>
            )}
          </Stack>
        </Grid>

        {/* Right Side: Preview */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: darkMode ? "#13181D" : "background.paper",
              border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
              position: { md: "sticky" },
              top: { md: 100 },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: darkMode ? "#E2E8F0" : "inherit" }}>
              Preview (16:9)
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
                <CircularProgress />
              </Box>
            ) : previewUrl ? (
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: darkMode ? "2px solid #2D3748" : "2px solid #E2E8F0",
                }}
              >
                <img
                  src={previewUrl}
                  alt="Thumbnail preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: 2,
                  border: darkMode ? "2px dashed #2D3748" : "2px dashed #CBD5E0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: darkMode ? "#0F1419" : "#F7FAFC",
                }}
              >
                <ImageIcon sx={{ fontSize: 64, color: darkMode ? "#2D3748" : "#CBD5E0", mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Generate a preview to see your thumbnail
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

