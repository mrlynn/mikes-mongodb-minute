"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Divider,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  QrCode as QrCodeIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Preview as PreviewIcon,
} from "@mui/icons-material";
import ContentQualityChecker from "./ContentQualityChecker";
import AIContentImprover from "./AIContentImprover";
import AIEnhancedContentHelper from "./AIEnhancedContentHelper";
import EpisodePreview from "./EpisodePreview";
import { useTheme } from "@/contexts/ThemeContext";

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
  "Miscellaneous",
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const STATUSES = ["draft", "ready-to-record", "recorded", "published"];

export default function EpisodeForm({ initialData = {}, onSubmit, submitLabel = "Save" }) {
  const { darkMode } = useTheme();
  // Ensure initialData is always an object, never null or undefined
  const safeInitialData = initialData || {};

  // Helper function for TextField dark mode styling
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
    "& .MuiSelect-icon": {
      color: darkMode ? "#A0AEC0" : "inherit",
    },
    ...customSx,
  });

  const [formData, setFormData] = useState({
    episodeNumber: safeInitialData.episodeNumber || "",
    title: safeInitialData.title || "",
    slug: safeInitialData.slug || "",
    category: safeInitialData.category || "",
    difficulty: safeInitialData.difficulty || "",
    status: safeInitialData.status || "draft",
    hook: safeInitialData.hook || "",
    problem: safeInitialData.problem || "",
    tip: safeInitialData.tip || "",
    quickWin: safeInitialData.quickWin || "",
    cta: safeInitialData.cta || "",
    visualSuggestion: safeInitialData.visualSuggestion || "",
    videoUrl: safeInitialData.videoUrl || "",
    socialLinks: safeInitialData.socialLinks || {
      youtube: "",
      tiktok: "",
      linkedin: "",
      instagram: "",
      x: "",
    },
    githubRepo: safeInitialData.githubRepo || "",
    deepDive: safeInitialData.deepDive || "",
    transcript: safeInitialData.transcript || "",
    tags: safeInitialData.tags || [],
    notesFromMike: safeInitialData.notesFromMike || "",
    resources: safeInitialData.resources || [],
    schema: safeInitialData.schema || { documents: null, indexes: null },
    summary: safeInitialData.summary || "", // One-sentence summary for hero section
    versionTags: safeInitialData.versionTags || { driverVersion: "", atlasFeatures: [] }, // Version info
    keyConcepts: safeInitialData.keyConcepts || { pitfalls: "", whenToUse: "", whenNotToUse: "" }, // Deep dive callouts
  });

  // Update form when initialData changes (e.g., when template is selected)
  useEffect(() => {
    // Ensure initialData is always an object
    const safeInitialData = initialData || {};
    
    // Only update if initialData has meaningful content (not just empty object)
    const hasContent = safeInitialData && Object.keys(safeInitialData).length > 0 && (
      safeInitialData.hook || 
      safeInitialData.problem || 
      safeInitialData.tip || 
      safeInitialData.quickWin || 
      safeInitialData.cta ||
      safeInitialData.category ||
      safeInitialData.difficulty
    );
    
    if (hasContent) {
      setFormData((prev) => ({
        ...prev,
        // Only update fields that are provided in initialData
        category: safeInitialData.category || prev.category,
        difficulty: safeInitialData.difficulty || prev.difficulty,
        hook: safeInitialData.hook || prev.hook,
        problem: safeInitialData.problem || prev.problem,
        tip: safeInitialData.tip || prev.tip,
        quickWin: safeInitialData.quickWin || prev.quickWin,
        cta: safeInitialData.cta || prev.cta,
        visualSuggestion: safeInitialData.visualSuggestion || prev.visualSuggestion,
        // Preserve other fields
        episodeNumber: safeInitialData.episodeNumber !== undefined ? safeInitialData.episodeNumber : prev.episodeNumber,
        title: safeInitialData.title || prev.title,
        slug: safeInitialData.slug || prev.slug,
        status: safeInitialData.status || prev.status,
        videoUrl: safeInitialData.videoUrl || prev.videoUrl,
        socialLinks: safeInitialData.socialLinks || prev.socialLinks,
        // Enhanced content fields
        githubRepo: safeInitialData.githubRepo !== undefined ? safeInitialData.githubRepo : prev.githubRepo,
        deepDive: safeInitialData.deepDive !== undefined ? safeInitialData.deepDive : prev.deepDive,
        transcript: safeInitialData.transcript !== undefined ? safeInitialData.transcript : prev.transcript,
        tags: safeInitialData.tags !== undefined ? safeInitialData.tags : prev.tags,
        notesFromMike: safeInitialData.notesFromMike !== undefined ? safeInitialData.notesFromMike : prev.notesFromMike,
        resources: safeInitialData.resources !== undefined ? safeInitialData.resources : prev.resources,
        schema: safeInitialData.schema !== undefined ? safeInitialData.schema : prev.schema,
        summary: safeInitialData.summary !== undefined ? safeInitialData.summary : prev.summary,
        versionTags: safeInitialData.versionTags !== undefined ? safeInitialData.versionTags : prev.versionTags,
        keyConcepts: safeInitialData.keyConcepts !== undefined ? safeInitialData.keyConcepts : prev.keyConcepts,
      }));
    }
  }, [initialData]);

  const [saving, setSaving] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Fetch QR code when component mounts (if editing existing episode)
  useEffect(() => {
    const safeInitialData = initialData || {};
    if (safeInitialData._id) {
      fetchQRCode();
    }
  }, [initialData]);

  async function fetchQRCode() {
    if (!initialData?._id) return;

    setLoadingQR(true);
    try {
      const res = await fetch(`/api/episodes/${initialData._id}/qrcode`);
      if (res.ok) {
        const data = await res.json();
        setQrCode(data.qrCode);
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
    } finally {
      setLoadingQR(false);
    }
  }

  function downloadQRCode() {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `mongodb-minute-${initialData?.slug || initialData?._id || 'episode'}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSocialLinkChange(platform, value) {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await onSubmit(formData);
    setSaving(false);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ px: { xs: 0, sm: 0 } }}>
      {/* Episode Preview Dialog */}
      <EpisodePreview
        formData={formData}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
      <Grid container spacing={{ xs: 2, md: 4 }}>
        {/* Left Sidebar - Metadata */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              position: { md: "sticky" },
              top: { md: 100 },
              maxHeight: { md: "calc(100vh - 120px)" },
              overflowY: { md: "auto" },
            }}
          >
            <Paper
              sx={{
                borderRadius: { xs: 2, md: 8 },
                border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
                overflow: "hidden",
                boxShadow: darkMode
                  ? "0px 2px 8px rgba(0, 237, 100, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)"
                  : "0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.04)",
                backgroundColor: darkMode ? "#13181D" : "background.paper",
              }}
            >
              {/* Header Section */}
              <Box
                sx={{
                  background: darkMode ? "#1A2328" : "#F7FAFC",
                  p: { xs: 2, md: 2.5 },
                  borderBottom: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? "#E2E8F0" : "#001E2B", fontSize: "1rem" }}>
                    Episode Details
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: darkMode ? "#A0AEC0" : "#5F6C76", fontSize: "0.75rem" }}>
                    Basic information and metadata
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<PreviewIcon />}
                  onClick={() => setPreviewOpen(true)}
                  size="small"
                  sx={{
                    borderColor: "#00684A",
                    color: "#00684A",
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", md: "0.8125rem" },
                    "&:hover": {
                      borderColor: "#004D37",
                      backgroundColor: "#E6F7F0",
                    },
                  }}
                >
                  Preview
                </Button>
              </Box>

              {/* Form Fields Section */}
              <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack spacing={{ xs: 2, md: 3 }}>
                  {/* Title - Most Important */}
                  <Box>
                    <TextField
                      fullWidth
                      required
                      label="Episode Title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      variant="outlined"
                      sx={getTextFieldSx({
                        "& .MuiInputBase-root": {
                          fontSize: "1.1rem",
                          fontWeight: 500,
                        },
                      })}
                    />
                  </Box>

                  {/* Episode Number */}
                  <Box>
                    <TextField
                      fullWidth
                      label="Episode Number"
                      type="number"
                      value={formData.episodeNumber}
                      onChange={(e) => handleChange("episodeNumber", parseInt(e.target.value) || "")}
                      variant="outlined"
                      size="small"
                      sx={getTextFieldSx()}
                    />
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  {/* Classification Group */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: "block", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Classification
                    </Typography>
                    <Stack spacing={2}>
                      {/* Category */}
                      <TextField
                        fullWidth
                        required
                        select
                        label="Category"
                        value={formData.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={getTextFieldSx()}
                      >
                        {CATEGORIES.map((cat) => (
                          <MenuItem key={cat} value={cat} sx={{ color: darkMode ? "#E2E8F0" : "inherit", backgroundColor: darkMode ? "#13181D" : "inherit", "&:hover": { backgroundColor: darkMode ? "#1A2F2A" : "rgba(0, 0, 0, 0.04)" } }}>
                            {cat}
                          </MenuItem>
                        ))}
                      </TextField>

                      {/* Difficulty */}
                      <TextField
                        fullWidth
                        required
                        select
                        label="Difficulty Level"
                        value={formData.difficulty}
                        onChange={(e) => handleChange("difficulty", e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={getTextFieldSx()}
                      >
                        {DIFFICULTIES.map((diff) => (
                          <MenuItem key={diff} value={diff} sx={{ color: darkMode ? "#E2E8F0" : "inherit", backgroundColor: darkMode ? "#13181D" : "inherit", "&:hover": { backgroundColor: darkMode ? "#1A2F2A" : "rgba(0, 0, 0, 0.04)" } }}>
                            {diff}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  {/* Workflow Group */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: "block", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Workflow
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      select
                      label="Status"
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={getTextFieldSx()}
                    >
                      {STATUSES.map((status) => (
                        <MenuItem key={status} value={status} sx={{ color: darkMode ? "#E2E8F0" : "inherit", backgroundColor: darkMode ? "#13181D" : "inherit", "&:hover": { backgroundColor: darkMode ? "#1A2F2A" : "rgba(0, 0, 0, 0.04)" } }}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, " ")}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  {/* URL Settings */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: "block", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      URL Settings
                    </Typography>
                    <TextField
                      fullWidth
                      label="URL Slug"
                      value={formData.slug}
                      onChange={(e) => handleChange("slug", e.target.value)}
                      helperText="Leave blank to auto-generate from title"
                      variant="outlined"
                      size="small"
                      sx={getTextFieldSx()}
                    />
                  </Box>

                  {/* QR Code Section - Only show for existing episodes */}
                  {initialData?._id && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            QR Code
                          </Typography>
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Refresh QR Code">
                              <IconButton size="small" onClick={fetchQRCode} disabled={loadingQR}>
                                <RefreshIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {qrCode && (
                              <Tooltip title="Download QR Code">
                                <IconButton size="small" onClick={downloadQRCode}>
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </Stack>
                        {loadingQR ? (
                          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress size={40} />
                          </Box>
                        ) : qrCode ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              p: 2,
                              backgroundColor: "#FFFFFF",
                              borderRadius: 2,
                              border: "2px solid #E2E8F0",
                            }}
                          >
                            <img
                              src={qrCode}
                              alt="Episode QR Code"
                              style={{
                                width: "100%",
                                maxWidth: "200px",
                                height: "auto",
                                display: "block",
                              }}
                            />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              p: 3,
                              backgroundColor: "#F7FAFC",
                              borderRadius: 2,
                              border: "2px dashed #CBD5E0",
                            }}
                          >
                            <QrCodeIcon sx={{ fontSize: 48, color: "#A0AEC0", mb: 1 }} />
                            <Typography variant="caption" color="text.secondary" align="center">
                              QR Code unavailable
                            </Typography>
                          </Box>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block", textAlign: "center" }}>
                          Scan to view episode detail page
                        </Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              </Box>

              {/* Save Button - Sticky at bottom of sidebar */}
              <Box
                sx={{
                  p: { xs: 2, md: 2.5 },
                  pt: { xs: 1.5, md: 2 },
                  borderTop: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
                  backgroundColor: darkMode ? "#1A2328" : "#F7FAFC",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="medium"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                  sx={{
                    fontWeight: 500,
                    py: 1,
                    fontSize: "0.875rem",
                    background: darkMode
                      ? "linear-gradient(135deg, #00ED64 0%, #00684A 100%)"
                      : undefined,
                    color: darkMode ? "#001E2B" : undefined,
                    "&:hover": darkMode ? {
                      background: "linear-gradient(135deg, #00ED64 0%, #00684A 100%)",
                      filter: "brightness(1.1)",
                    } : undefined,
                  }}
                >
                  {saving ? "Saving..." : submitLabel}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Grid>

        {/* Right Column - Content Editor */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={{ xs: 2, md: 4 }}>

            {/* Script Content Section */}
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  60-Second Script
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Structure your content for a perfect 60-second delivery
                </Typography>
              </Box>

              {/* Hook Section */}
              <Paper
                sx={{
                  p: { xs: 2, md: 3 },
                  mb: { xs: 2, md: 2.5 },
                  borderRadius: { xs: 2, md: 8 },
                  backgroundColor: darkMode ? "#1A2328" : "#F7FAFC",
                  border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
                  borderLeft: darkMode ? "3px solid #00ED64" : "3px solid #00684A",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: { xs: 1.5, md: 2 } }}>
                  <Chip
                    label="0-5s"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600, fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: "1rem", md: "1.25rem" },
                    }}
                  >
                    Hook
                  </Typography>
                </Stack>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    mb: { xs: 1.5, md: 2 }, 
                    display: "block",
                    fontSize: { xs: "0.75rem", md: "0.8125rem" },
                  }}
                >
                  Provocative question or surprising stat to grab attention
                </Typography>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  value={formData.hook}
                  onChange={(e) => handleChange("hook", e.target.value)}
                  placeholder="Did you know that most MongoDB performance issues..."
                  variant="outlined"
                  sx={getTextFieldSx({
                    "& .MuiInputBase-root": {
                      fontSize: { xs: "0.95rem", md: "1.05rem" },
                      lineHeight: 1.7,
                      backgroundColor: darkMode ? "#0F1419" : "white",
                    },
                  })}
                />
              </Paper>

              {/* Problem Section */}
              <Paper
                sx={{
                  p: { xs: 2, md: 3 },
                  mb: { xs: 2, md: 2.5 },
                  borderRadius: { xs: 2, md: 8 },
                  backgroundColor: darkMode ? "#1A2328" : "#FFFFFF",
                  border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
                  borderLeft: darkMode ? "3px solid #00ED64" : "3px solid #00ED64",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: { xs: 1.5, md: 2 } }}>
                  <Chip
                    label="5-15s"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600, fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: "1rem", md: "1.25rem" },
                    }}
                  >
                    Problem / Context
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Why this matters - set up the problem or context
                  </Typography>
                  <Chip
                    label={`${(formData.problem || "").trim().split(/\s+/).filter(w => w.length > 0).length} words • ~${Math.ceil((formData.problem || "").trim().split(/\s+/).filter(w => w.length > 0).length / 2.5)}s`}
                    size="small"
                    sx={{ fontSize: "0.65rem", height: "20px", fontWeight: 600 }}
                  />
                </Stack>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={formData.problem}
                  onChange={(e) => handleChange("problem", e.target.value)}
                  placeholder="Many developers struggle with..."
                  variant="outlined"
                  sx={getTextFieldSx({
                    "& .MuiInputBase-root": {
                      fontSize: { xs: "0.95rem", md: "1.05rem" },
                      lineHeight: 1.7,
                    },
                  })}
                />
              </Paper>

              {/* Tip/Solution Section - Largest */}
              <Paper
                sx={{
                  p: { xs: 2, md: 3 },
                  mb: { xs: 2, md: 2.5 },
                  borderRadius: { xs: 2, md: 8 },
                  backgroundColor: darkMode ? "#1A2328" : "#FFFFFF",
                  border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
                  borderLeft: darkMode ? "3px solid #00ED64" : "3px solid #00684A",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: { xs: 1.5, md: 2 } }}>
                  <Chip
                    label="15-45s"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600, fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: "1rem", md: "1.25rem" },
                    }}
                  >
                    Tip / Solution
                  </Typography>
                </Stack>
                <Stack 
                  direction={{ xs: "column", sm: "row" }} 
                  justifyContent="space-between" 
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={{ xs: 0.5, sm: 0 }}
                  sx={{ mb: 1 }}
                >
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                  >
                    Core educational content - the main learning point
                  </Typography>
                  <Chip
                    label={`${(formData.tip || "").trim().split(/\s+/).filter(w => w.length > 0).length} words • ~${Math.ceil((formData.tip || "").trim().split(/\s+/).filter(w => w.length > 0).length / 2.5)}s`}
                    size="small"
                    sx={{ fontSize: { xs: "0.6rem", md: "0.65rem" }, height: { xs: "18px", md: "20px" }, fontWeight: 600 }}
                  />
                </Stack>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={6}
                  value={formData.tip}
                  onChange={(e) => handleChange("tip", e.target.value)}
                  placeholder="Here's the solution: use embedded documents to..."
                  variant="outlined"
                  sx={getTextFieldSx({
                    "& .MuiInputBase-root": {
                      fontSize: { xs: "0.95rem", md: "1.05rem" },
                      lineHeight: 1.7,
                    },
                  })}
                />
              </Paper>

              {/* Quick Win Section */}
              <Paper
                sx={{
                  p: { xs: 2, md: 3 },
                  mb: { xs: 2, md: 2.5 },
                  borderRadius: { xs: 2, md: 8 },
                  backgroundColor: darkMode ? "#1A2328" : "#FFFFFF",
                  border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
                  borderLeft: darkMode ? "3px solid #00ED64" : "3px solid #00ED64",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: { xs: 1.5, md: 2 } }}>
                  <Chip
                    label="45-52s"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600, fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: "1rem", md: "1.25rem" },
                    }}
                  >
                    Quick Win / Proof
                  </Typography>
                </Stack>
                <Stack 
                  direction={{ xs: "column", sm: "row" }} 
                  justifyContent="space-between" 
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={{ xs: 0.5, sm: 0 }}
                  sx={{ mb: 1 }}
                >
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                  >
                    Show the result or benefit - demonstrate the value
                  </Typography>
                  <Chip
                    label={`${(formData.quickWin || "").trim().split(/\s+/).filter(w => w.length > 0).length} words • ~${Math.ceil((formData.quickWin || "").trim().split(/\s+/).filter(w => w.length > 0).length / 2.5)}s`}
                    size="small"
                    sx={{ fontSize: { xs: "0.6rem", md: "0.65rem" }, height: { xs: "18px", md: "20px" }, fontWeight: 600 }}
                  />
                </Stack>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  value={formData.quickWin}
                  onChange={(e) => handleChange("quickWin", e.target.value)}
                  placeholder="This approach reduced query time by 80%..."
                  variant="outlined"
                  sx={getTextFieldSx({
                    "& .MuiInputBase-root": {
                      fontSize: { xs: "0.95rem", md: "1.05rem" },
                      lineHeight: 1.7,
                    },
                  })}
                />
              </Paper>

              {/* CTA Section */}
              <Paper
                sx={{
                  p: { xs: 2, md: 3 },
                  mb: { xs: 2, md: 2.5 },
                  borderRadius: { xs: 2, md: 8 },
                  backgroundColor: darkMode ? "#1A2328" : "#F7FAFC",
                  border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
                  borderLeft: darkMode ? "3px solid #00684A" : "3px solid #004D37",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: { xs: 1.5, md: 2 } }}>
                  <Chip
                    label="52-60s"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600, fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: "1rem", md: "1.25rem" },
                    }}
                  >
                    CTA + Tease
                  </Typography>
                </Stack>
                <Stack 
                  direction={{ xs: "column", sm: "row" }} 
                  justifyContent="space-between" 
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={{ xs: 0.5, sm: 0 }}
                  sx={{ mb: 1 }}
                >
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                  >
                    Engagement driver - call to action and tease next episode
                  </Typography>
                  <Chip
                    label={`${(formData.cta || "").trim().split(/\s+/).filter(w => w.length > 0).length} words • ~${Math.ceil((formData.cta || "").trim().split(/\s+/).filter(w => w.length > 0).length / 2.5)}s`}
                    size="small"
                    sx={{ fontSize: { xs: "0.6rem", md: "0.65rem" }, height: { xs: "18px", md: "20px" }, fontWeight: 600 }}
                  />
                </Stack>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  value={formData.cta}
                  onChange={(e) => handleChange("cta", e.target.value)}
                  placeholder="Try this today and let me know how it works! Next week, I'll show you..."
                  variant="outlined"
                  sx={getTextFieldSx({
                    "& .MuiInputBase-root": {
                      fontSize: { xs: "0.95rem", md: "1.05rem" },
                      lineHeight: 1.7,
                    },
                  })}
                />
              </Paper>
            </Box>

            {/* Visual Suggestion */}
            <Paper
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: { xs: 2, md: 8 },
                backgroundColor: darkMode ? "#1A2328" : "#FFFFFF",
                border: darkMode ? "1px dashed #2D3748" : "1px dashed #CBD5E0",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: darkMode ? "#E2E8F0" : "inherit" }}>
                Visual Suggestion
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                Production notes for video - what to show on screen
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={formData.visualSuggestion}
                onChange={(e) => handleChange("visualSuggestion", e.target.value)}
                placeholder="Show code example, diagram, or screen recording of..."
                variant="outlined"
                sx={getTextFieldSx({
                  "& .MuiInputBase-root": {
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                    lineHeight: 1.7,
                  },
                })}
              />
            </Paper>

            {/* Content Quality Checker */}
            <ContentQualityChecker formData={formData} />

            {/* AI Content Improver */}
            <AIContentImprover
              formData={formData}
              onImprove={(data) => {
                if (data.field && data.improvedContent) {
                  handleChange(data.field, data.improvedContent);
                }
              }}
            />

            {/* Video & Social Links - Collapsible */}
            <Accordion
              defaultExpanded={false}
              sx={{
                borderRadius: 3,
                "&:before": {
                  display: "none",
                },
                boxShadow: 1,
                backgroundColor: darkMode ? "#13181D" : "background.paper",
                border: darkMode ? "1px solid #2D3748" : undefined,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? "#E2E8F0" : "inherit" }} />}
                sx={{
                  px: 3,
                  py: 2,
                  "& .MuiAccordionSummary-content": {
                    my: 0,
                  },
                  backgroundColor: darkMode ? "#1A2328" : undefined,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? "#E2E8F0" : "inherit" }}>
                  Video & Social Links
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3, backgroundColor: darkMode ? "#13181D" : "background.paper" }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Primary Video URL"
                    value={formData.videoUrl}
                    onChange={(e) => handleChange("videoUrl", e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    variant="outlined"
                    sx={getTextFieldSx()}
                  />
                  <Divider>Social Media Links</Divider>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="YouTube"
                        value={formData.socialLinks.youtube}
                        onChange={(e) => handleSocialLinkChange("youtube", e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={getTextFieldSx()}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="TikTok"
                        value={formData.socialLinks.tiktok}
                        onChange={(e) => handleSocialLinkChange("tiktok", e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={getTextFieldSx()}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        label="LinkedIn"
                        value={formData.socialLinks.linkedin}
                        onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={getTextFieldSx()}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        label="Instagram"
                        value={formData.socialLinks.instagram}
                        onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={getTextFieldSx()}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        label="X (Twitter)"
                        value={formData.socialLinks.x}
                        onChange={(e) => handleSocialLinkChange("x", e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={getTextFieldSx()}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Enhanced Content - Collapsible */}
            <Accordion
              defaultExpanded={false}
              sx={{
                borderRadius: 3,
                "&:before": {
                  display: "none",
                },
                boxShadow: 1,
                backgroundColor: darkMode ? "#13181D" : "background.paper",
                border: darkMode ? "1px solid #2D3748" : undefined,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? "#E2E8F0" : "inherit" }} />}
                sx={{
                  px: 3,
                  py: 2,
                  "& .MuiAccordionSummary-content": {
                    my: 0,
                  },
                  backgroundColor: darkMode ? "#1A2328" : undefined,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "0.9375rem", md: "1rem" }, color: darkMode ? "#E2E8F0" : "inherit" }}>
                  Enhanced Content
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3, backgroundColor: darkMode ? "#13181D" : "background.paper" }}>
                <Stack spacing={3}>
                  {/* AI Enhanced Content Helper */}
                  <AIEnhancedContentHelper
                    formData={formData}
                    onImprove={(data) => {
                      if (data.field === "keyConcepts" && data.subField) {
                        // Handle keyConcepts sub-fields
                        handleChange("keyConcepts", {
                          ...formData.keyConcepts,
                          [data.subField]: data.improvedContent,
                        });
                      } else if (data.field === "keyConcepts" && typeof data.improvedContent === "object") {
                        // Handle full keyConcepts object
                        handleChange("keyConcepts", data.improvedContent);
                      } else if (data.field === "tags" && Array.isArray(data.improvedContent)) {
                        // Handle tags array
                        handleChange("tags", data.improvedContent);
                      } else if (data.field && data.improvedContent) {
                        // Handle simple field updates
                        handleChange(data.field, data.improvedContent);
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="GitHub Repository URL"
                    value={formData.githubRepo}
                    onChange={(e) => handleChange("githubRepo", e.target.value)}
                    placeholder="https://github.com/mrlynn/mongodb-minute-42"
                    variant="outlined"
                    size="small"
                    helperText="Link to the episode's GitHub repository"
                    sx={getTextFieldSx()}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="Deep Dive Content"
                    value={formData.deepDive}
                    onChange={(e) => handleChange("deepDive", e.target.value)}
                    placeholder="Expanded explanation beyond the 60-second video. Supports markdown formatting."
                    variant="outlined"
                    helperText="Extended technical explanation with markdown support"
                    sx={getTextFieldSx({
                      "& .MuiInputBase-root": {
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        lineHeight: 1.7,
                      },
                    })}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Transcript"
                    value={formData.transcript}
                    onChange={(e) => handleChange("transcript", e.target.value)}
                    placeholder="Full transcript of the video..."
                    variant="outlined"
                    helperText="Complete transcript of the episode"
                    sx={getTextFieldSx({
                      "& .MuiInputBase-root": {
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        lineHeight: 1.7,
                      },
                    })}
                  />

                  <TextField
                    fullWidth
                    label="One-Sentence Summary"
                    value={formData.summary}
                    onChange={(e) => handleChange("summary", e.target.value)}
                    placeholder="A concise one-sentence summary of what this episode covers"
                    variant="outlined"
                    size="small"
                    helperText="Used in the hero section below the title"
                    sx={getTextFieldSx()}
                  />

                  <TextField
                    fullWidth
                    label="Tags (comma-separated)"
                    value={Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags}
                    onChange={(e) => {
                      const tags = e.target.value.split(",").map(t => t.trim()).filter(t => t);
                      handleChange("tags", tags);
                    }}
                    placeholder="indexing, performance, optimization"
                    variant="outlined"
                    size="small"
                    helperText="Tags for discoverability and cross-linking"
                    sx={getTextFieldSx()}
                  />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: darkMode ? "#E2E8F0" : "#001E2B" }}>
                      Version Information
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Driver Version"
                        value={formData.versionTags?.driverVersion || ""}
                        onChange={(e) => handleChange("versionTags", { ...formData.versionTags, driverVersion: e.target.value })}
                        placeholder="6.0.0"
                        variant="outlined"
                        size="small"
                        helperText="MongoDB Node.js driver version used"
                        sx={getTextFieldSx()}
                      />
                      <TextField
                        fullWidth
                        label="Atlas Features (comma-separated)"
                        value={Array.isArray(formData.versionTags?.atlasFeatures) ? formData.versionTags.atlasFeatures.join(", ") : ""}
                        onChange={(e) => {
                          const features = e.target.value.split(",").map(f => f.trim()).filter(f => f);
                          handleChange("versionTags", { ...formData.versionTags, atlasFeatures: features });
                        }}
                        placeholder="Atlas Search, Vector Search, Serverless"
                        variant="outlined"
                        size="small"
                        helperText="Atlas features referenced in this episode"
                        sx={getTextFieldSx()}
                      />
                    </Stack>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: darkMode ? "#E2E8F0" : "#001E2B" }}>
                      Key Concepts (for Deep Dive Callouts)
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Pitfalls to Avoid"
                        value={formData.keyConcepts?.pitfalls || ""}
                        onChange={(e) => handleChange("keyConcepts", { ...formData.keyConcepts, pitfalls: e.target.value })}
                        placeholder="Common mistakes developers make with this concept..."
                        variant="outlined"
                        size="small"
                        sx={getTextFieldSx()}
                      />
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="When to Use"
                        value={formData.keyConcepts?.whenToUse || ""}
                        onChange={(e) => handleChange("keyConcepts", { ...formData.keyConcepts, whenToUse: e.target.value })}
                        placeholder="Best scenarios for using this approach..."
                        variant="outlined"
                        size="small"
                        sx={getTextFieldSx()}
                      />
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="When NOT to Use"
                        value={formData.keyConcepts?.whenNotToUse || ""}
                        onChange={(e) => handleChange("keyConcepts", { ...formData.keyConcepts, whenNotToUse: e.target.value })}
                        placeholder="Situations where this approach isn't ideal..."
                        variant="outlined"
                        size="small"
                        sx={getTextFieldSx()}
                      />
                    </Stack>
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Notes From Mike"
                    value={formData.notesFromMike}
                    onChange={(e) => handleChange("notesFromMike", e.target.value)}
                    placeholder="Why this episode exists, real-world scenarios, FAQs..."
                    variant="outlined"
                    helperText="Personal insights and context about this episode"
                    sx={getTextFieldSx({
                      "& .MuiInputBase-root": {
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        lineHeight: 1.7,
                      },
                    })}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Resources (JSON)"
                    value={JSON.stringify(formData.resources || [], null, 2)}
                    onChange={(e) => {
                      try {
                        const resources = JSON.parse(e.target.value);
                        handleChange("resources", resources);
                      } catch (err) {
                        // Invalid JSON, don't update
                      }
                    }}
                    placeholder='[{"type": "code", "title": "Example", "content": "...", "language": "javascript"}]'
                    variant="outlined"
                    helperText="Array of resources: code snippets, downloads, etc. (JSON format)"
                    sx={getTextFieldSx({
                      "& .MuiInputBase-root": {
                        fontFamily: "monospace",
                        fontSize: { xs: "0.8rem", md: "0.85rem" },
                      },
                    })}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Schema (JSON)"
                    value={JSON.stringify(formData.schema || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const schema = JSON.parse(e.target.value);
                        handleChange("schema", schema);
                      } catch (err) {
                        // Invalid JSON, don't update
                      }
                    }}
                    placeholder='{"documents": [...], "indexes": [...]}'
                    variant="outlined"
                    helperText="Sample documents and index definitions (JSON format)"
                    sx={getTextFieldSx({
                      "& .MuiInputBase-root": {
                        fontFamily: "monospace",
                        fontSize: { xs: "0.8rem", md: "0.85rem" },
                      },
                    })}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
