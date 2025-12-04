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
} from "@mui/icons-material";

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

const STATUSES = ["draft", "ready-to-record", "recorded", "published"];

export default function EpisodeForm({ initialData = {}, onSubmit, submitLabel = "Save" }) {
  const [formData, setFormData] = useState({
    episodeNumber: initialData.episodeNumber || "",
    title: initialData.title || "",
    slug: initialData.slug || "",
    category: initialData.category || "",
    difficulty: initialData.difficulty || "",
    status: initialData.status || "draft",
    hook: initialData.hook || "",
    problem: initialData.problem || "",
    tip: initialData.tip || "",
    quickWin: initialData.quickWin || "",
    cta: initialData.cta || "",
    visualSuggestion: initialData.visualSuggestion || "",
    videoUrl: initialData.videoUrl || "",
    socialLinks: initialData.socialLinks || {
      youtube: "",
      tiktok: "",
      linkedin: "",
      instagram: "",
      x: "",
    },
  });

  const [saving, setSaving] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);

  // Fetch QR code when component mounts (if editing existing episode)
  useEffect(() => {
    if (initialData._id) {
      fetchQRCode();
    }
  }, [initialData._id]);

  async function fetchQRCode() {
    if (!initialData._id) return;

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
    link.download = `mongodb-minute-${initialData.slug || initialData._id}-qr.png`;
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
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={4}>
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
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                overflow: "hidden",
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Header Section */}
              <Box
                sx={{
                  background: "#F7FAFC",
                  p: 2.5,
                  borderBottom: "1px solid #E2E8F0",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#001E2B", fontSize: "1rem" }}>
                  Episode Details
                </Typography>
                <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "#5F6C76", fontSize: "0.75rem" }}>
                  Basic information and metadata
                </Typography>
              </Box>

              {/* Form Fields Section */}
              <Box sx={{ p: 2.5 }}>
                <Stack spacing={3}>
                  {/* Title - Most Important */}
                  <Box>
                    <TextField
                      fullWidth
                      required
                      label="Episode Title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      variant="outlined"
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: "1.1rem",
                          fontWeight: 500,
                        },
                      }}
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
                      >
                        {CATEGORIES.map((cat) => (
                          <MenuItem key={cat} value={cat}>
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
                      >
                        {DIFFICULTIES.map((diff) => (
                          <MenuItem key={diff} value={diff}>
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
                    >
                      {STATUSES.map((status) => (
                        <MenuItem key={status} value={status}>
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
                    />
                  </Box>

                  {/* QR Code Section - Only show for existing episodes */}
                  {initialData._id && (
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
                  p: 2.5,
                  pt: 2,
                  borderTop: "1px solid #E2E8F0",
                  backgroundColor: "#F7FAFC",
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
          <Stack spacing={4}>

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
                  p: 3,
                  mb: 2.5,
                  borderRadius: 8,
                  backgroundColor: "#F7FAFC",
                  border: "1px solid #E2E8F0",
                  borderLeft: "3px solid #00684A",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Chip
                    label="0-5s"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Hook
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                  Provocative question or surprising stat to grab attention
                </Typography>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={formData.hook}
                  onChange={(e) => handleChange("hook", e.target.value)}
                  placeholder="Did you know that most MongoDB performance issues..."
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-root": {
                      fontSize: "1.05rem",
                      lineHeight: 1.7,
                      backgroundColor: "white",
                    },
                  }}
                />
              </Paper>

              {/* Problem Section */}
              <Paper
                sx={{
                  p: 3,
                  mb: 2.5,
                  borderRadius: 8,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderLeft: "3px solid #00ED64",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Chip
                    label="5-15s"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Problem / Context
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                  Why this matters - set up the problem or context
                </Typography>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={5}
                  value={formData.problem}
                  onChange={(e) => handleChange("problem", e.target.value)}
                  placeholder="Many developers struggle with..."
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-root": {
                      fontSize: "1.05rem",
                      lineHeight: 1.7,
                    },
                  }}
                />
              </Paper>

              {/* Tip/Solution Section - Largest */}
              <Paper
                sx={{
                  p: 3,
                  mb: 2.5,
                  borderRadius: 8,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderLeft: "3px solid #00684A",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Chip
                    label="15-45s"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Tip / Solution
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                  Core educational content - the main learning point
                </Typography>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={8}
                  value={formData.tip}
                  onChange={(e) => handleChange("tip", e.target.value)}
                  placeholder="Here's the solution: use embedded documents to..."
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-root": {
                      fontSize: "1.05rem",
                      lineHeight: 1.7,
                    },
                  }}
                />
              </Paper>

              {/* Quick Win Section */}
              <Paper
                sx={{
                  p: 3,
                  mb: 2.5,
                  borderRadius: 8,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderLeft: "3px solid #00ED64",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Chip
                    label="45-52s"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Quick Win / Proof
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                  Show the result or benefit - demonstrate the value
                </Typography>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={formData.quickWin}
                  onChange={(e) => handleChange("quickWin", e.target.value)}
                  placeholder="This approach reduced query time by 80%..."
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-root": {
                      fontSize: "1.05rem",
                      lineHeight: 1.7,
                    },
                  }}
                />
              </Paper>

              {/* CTA Section */}
              <Paper
                sx={{
                  p: 3,
                  mb: 2.5,
                  borderRadius: 8,
                  backgroundColor: "#F7FAFC",
                  border: "1px solid #E2E8F0",
                  borderLeft: "3px solid #004D37",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Chip
                    label="52-60s"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    CTA + Tease
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                  Engagement driver - call to action and tease next episode
                </Typography>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={formData.cta}
                  onChange={(e) => handleChange("cta", e.target.value)}
                  placeholder="Try this today and let me know how it works! Next week, I'll show you..."
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-root": {
                      fontSize: "1.05rem",
                      lineHeight: 1.7,
                      backgroundColor: "white",
                    },
                  }}
                />
              </Paper>
            </Box>

            {/* Visual Suggestion */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 8,
                backgroundColor: "#FFFFFF",
                border: "1px dashed #CBD5E0",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
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
              />
            </Paper>

            {/* Video & Social Links - Collapsible */}
            <Accordion
              defaultExpanded={false}
              sx={{
                borderRadius: 3,
                "&:before": {
                  display: "none",
                },
                boxShadow: 1,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  px: 3,
                  py: 2,
                  "& .MuiAccordionSummary-content": {
                    my: 0,
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Video & Social Links
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Primary Video URL"
                    value={formData.videoUrl}
                    onChange={(e) => handleChange("videoUrl", e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    variant="outlined"
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
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
