"use client";

import {
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  DataObject as DataObjectIcon,
  PictureAsPdf as PdfIcon,
  FolderZip as ZipIcon,
} from "@mui/icons-material";
import { trackEvent } from "./EpisodeAnalytics";

export default function DownloadableResources({ resources = [], categoryData, episodeId }) {
  if (!resources || resources.length === 0) {
    return null;
  }

  const downloadableResources = resources.filter((r) => r.type !== "code");

  if (downloadableResources.length === 0) {
    return null;
  }

  const getIcon = (type) => {
    switch (type) {
      case "pdf":
        return <PdfIcon />;
      case "zip":
        return <ZipIcon />;
      case "json":
        return <DataObjectIcon />;
      case "markdown":
        return <DescriptionIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  const handleDownload = (resource) => {
    if (episodeId) {
      trackEvent("resource_download", {
        episodeId,
        type: resource.type,
        title: resource.title,
      });
    }

    if (resource.url) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    } else if (resource.content) {
      // Create a blob and download
      const blob = new Blob([resource.content], { type: getMimeType(resource.type) });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = resource.filename || `${resource.title}.${resource.type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getMimeType = (type) => {
    const mimeTypes = {
      pdf: "application/pdf",
      zip: "application/zip",
      json: "application/json",
      markdown: "text/markdown",
    };
    return mimeTypes[type] || "application/octet-stream";
  };

  return (
    <Paper
      sx={{
        p: { xs: 3, md: 4 },
        mb: 4,
        borderRadius: 3,
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: categoryData.gradient,
        }}
      />

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3, mt: 1 }}>
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
          <DownloadIcon sx={{ fontSize: 28, color: "#FFFFFF" }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#001E2B",
            fontSize: { xs: "1.25rem", md: "1.5rem" },
          }}
        >
          Downloadable Resources
        </Typography>
      </Stack>

      <List sx={{ p: 0 }}>
        {downloadableResources.map((resource, index) => (
          <ListItem
            key={index}
            sx={{
              p: 2,
              mb: 1,
              borderRadius: 2,
              border: `1px solid ${categoryData.color}30`,
              backgroundColor: "#F7FAFC",
              "&:hover": {
                backgroundColor: categoryData.lightBg,
                borderColor: categoryData.color,
              },
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: categoryData.color }}>
              {getIcon(resource.type)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "#001E2B",
                    fontSize: { xs: "0.9375rem", md: "1rem" },
                  }}
                >
                  {resource.title}
                </Typography>
              }
              secondary={
                resource.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#5F6C76",
                      fontSize: { xs: "0.8125rem", md: "0.875rem" },
                      mt: 0.5,
                    }}
                  >
                    {resource.description}
                  </Typography>
                )
              }
            />
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload(resource)}
              sx={{
                borderColor: categoryData.color,
                color: categoryData.color,
                fontWeight: 600,
                "&:hover": {
                  borderColor: categoryData.color,
                  backgroundColor: categoryData.lightBg,
                },
              }}
            >
              Download
            </Button>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

