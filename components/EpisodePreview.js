"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  Stack,
  Paper,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Close as CloseIcon,
  Preview as PreviewIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { categoryConfig } from "@/lib/episodeConfig";

export default function EpisodePreview({ formData, open, onClose }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!formData) return null;

  const categoryData = categoryConfig[formData.category] || categoryConfig["Data Modeling"];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: "90vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E2E8F0",
          pb: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <PreviewIcon sx={{ color: "#00684A" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Episode Preview
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Box sx={{ borderBottom: "1px solid #E2E8F0" }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
            <Tab label="Hero & Overview" />
            <Tab label="Deep Dive" />
            <Tab label="Enhanced Content" />
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {activeTab === 0 && <HeroPreview formData={formData} categoryData={categoryData} />}
          {activeTab === 1 && <DeepDivePreview formData={formData} categoryData={categoryData} />}
          {activeTab === 2 && <EnhancedContentPreview formData={formData} categoryData={categoryData} />}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function HeroPreview({ formData, categoryData }) {
  const CategoryIcon = categoryData.icon;

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          mb: 3,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #E2E8F0",
        }}
      >
        <Box
          sx={{
            height: 6,
            background: categoryData.gradient,
            borderRadius: "3px 3px 0 0",
          }}
        />

        <Box sx={{ p: 4 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
            {formData.episodeNumber && (
              <Chip
                label={`#${formData.episodeNumber}`}
                size="medium"
                sx={{
                  background: categoryData.gradient,
                  color: "#FFFFFF",
                  fontWeight: 700,
                }}
              />
            )}
            <Chip
              icon={<CategoryIcon sx={{ fontSize: "18px !important", color: `${categoryData.color} !important` }} />}
              label={formData.category || "Category"}
              size="medium"
              sx={{
                backgroundColor: categoryData.lightBg,
                color: categoryData.color,
                fontWeight: 600,
                border: `2px solid ${categoryData.color}30`,
              }}
            />
            <Chip
              label={formData.difficulty || "Difficulty"}
              size="medium"
              sx={{
                backgroundColor: "#EDF2F7",
                color: "#001E2B",
                fontWeight: 600,
              }}
            />
            <Chip
              label="60 seconds"
              size="medium"
              sx={{
                backgroundColor: "#EDF2F7",
                color: "#5F6C76",
                fontWeight: 600,
              }}
            />
          </Stack>

          <Box
            sx={{
              width: "60px",
              height: "4px",
              background: categoryData.gradient,
              borderRadius: "2px",
              mb: 3,
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontWeight: 600,
              fontSize: "2.25rem",
              lineHeight: 1.3,
              color: "#001E2B",
              mb: 2,
            }}
          >
            {formData.title || "Episode Title"}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              lineHeight: 1.7,
              color: "#5F6C76",
              fontWeight: formData.summary ? 500 : 400,
            }}
          >
            {formData.summary || formData.hook || "Summary or hook will appear here"}
          </Typography>
        </Box>
      </Paper>

      {/* What You'll Learn */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 3,
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
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
            <VisibilityIcon sx={{ fontSize: 28, color: "#FFFFFF" }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#001E2B" }}>
            What You'll Learn
          </Typography>
        </Stack>

        <Stack spacing={2}>
          {formData.hook && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: categoryData.color }}>
                Hook (0-5s)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.hook}
              </Typography>
            </Box>
          )}
          {formData.problem && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: categoryData.color }}>
                Problem/Context (5-15s)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.problem}
              </Typography>
            </Box>
          )}
          {formData.tip && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: categoryData.color }}>
                Tip/Solution (15-45s)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.tip}
              </Typography>
            </Box>
          )}
          {formData.quickWin && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: categoryData.color }}>
                Quick Win (45-52s)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.quickWin}
              </Typography>
            </Box>
          )}
          {formData.cta && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: categoryData.color }}>
                CTA (52-60s)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.cta}
              </Typography>
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

function DeepDivePreview({ formData, categoryData }) {
  if (!formData.deepDive) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="body1" color="text.secondary">
          No deep dive content yet. Use the AI helper to generate one!
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
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
          <VisibilityIcon sx={{ fontSize: 28, color: "#FFFFFF" }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#001E2B" }}>
          Deep Dive
        </Typography>
      </Stack>

      {/* Key Concepts Callouts */}
      {formData.keyConcepts && (
        <Stack spacing={2} sx={{ mb: 4 }}>
          {formData.keyConcepts.pitfalls && (
            <Paper
              sx={{
                p: 2,
                backgroundColor: "#FFF4E6",
                border: "1px solid #FFA726",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                ⚠️ Pitfalls to Avoid
              </Typography>
              <Typography variant="body2">{formData.keyConcepts.pitfalls}</Typography>
            </Paper>
          )}
          {formData.keyConcepts.whenToUse && (
            <Paper
              sx={{
                p: 2,
                backgroundColor: "#E6F7F0",
                border: "1px solid #00ED64",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                ✅ When to Use
              </Typography>
              <Typography variant="body2">{formData.keyConcepts.whenToUse}</Typography>
            </Paper>
          )}
          {formData.keyConcepts.whenNotToUse && (
            <Paper
              sx={{
                p: 2,
                backgroundColor: "#E3F2FD",
                border: "1px solid #2196F3",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                💡 When NOT to Use
              </Typography>
              <Typography variant="body2">{formData.keyConcepts.whenNotToUse}</Typography>
            </Paper>
          )}
        </Stack>
      )}

      <Box
        sx={{
          "& p": {
            fontSize: "1.0625rem",
            lineHeight: 1.8,
            color: "#001E2B",
            mb: 2,
          },
          "& h3": {
            fontSize: "1.25rem",
            fontWeight: 700,
            color: categoryData.color,
            mt: 3,
            mb: 1.5,
          },
          whiteSpace: "pre-wrap",
        }}
      >
        {formData.deepDive}
      </Box>
    </Paper>
  );
}

function EnhancedContentPreview({ formData, categoryData }) {
  return (
    <Stack spacing={3}>
      {/* Summary */}
      {formData.summary && (
        <Paper sx={{ p: 3, border: "1px solid #E2E8F0" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formData.summary}
          </Typography>
        </Paper>
      )}

      {/* Tags */}
      {formData.tags && formData.tags.length > 0 && (
        <Paper sx={{ p: 3, border: "1px solid #E2E8F0" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Tags
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {Array.isArray(formData.tags) ? (
              formData.tags.map((tag, idx) => (
                <Chip key={idx} label={tag} size="small" />
              ))
            ) : (
              <Chip label={formData.tags} size="small" />
            )}
          </Stack>
        </Paper>
      )}

      {/* Version Tags */}
      {formData.versionTags && (formData.versionTags.driverVersion || formData.versionTags.atlasFeatures?.length > 0) && (
        <Paper sx={{ p: 3, border: "1px solid #E2E8F0" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Version Information
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {formData.versionTags.driverVersion && (
              <Chip label={`Driver ${formData.versionTags.driverVersion}`} size="small" />
            )}
            {formData.versionTags.atlasFeatures?.map((feature, idx) => (
              <Chip key={idx} label={feature} size="small" />
            ))}
          </Stack>
        </Paper>
      )}

      {/* GitHub Repo */}
      {formData.githubRepo && (
        <Paper sx={{ p: 3, border: "1px solid #E2E8F0" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            GitHub Repository
          </Typography>
          <Typography variant="body2" color="primary" sx={{ wordBreak: "break-all" }}>
            {formData.githubRepo}
          </Typography>
        </Paper>
      )}

      {/* Transcript */}
      {formData.transcript && (
        <Paper sx={{ p: 3, border: "1px solid #E2E8F0" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Transcript
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              maxHeight: 200,
              overflow: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {formData.transcript.substring(0, 500)}
            {formData.transcript.length > 500 && "..."}
          </Typography>
        </Paper>
      )}

      {/* Notes From Mike */}
      {formData.notesFromMike && (
        <Paper sx={{ p: 3, border: "1px solid #E2E8F0" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Notes From Mike
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
            {formData.notesFromMike}
          </Typography>
        </Paper>
      )}
    </Stack>
  );
}

