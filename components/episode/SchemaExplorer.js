"use client";

import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Storage as StorageIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { trackEvent } from "./EpisodeAnalytics";

export default function SchemaExplorer({ schema, categoryData, episodeId }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!schema || (!schema.documents && !schema.indexes)) {
    return null;
  }

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      if (episodeId) {
        trackEvent("schema_copy", {
          episodeId,
          type: activeTab === 0 ? "document" : "index",
        });
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const tabs = [];
  if (schema.documents) tabs.push({ label: "Sample Documents", content: schema.documents });
  if (schema.indexes) tabs.push({ label: "Indexes", content: schema.indexes });

  if (tabs.length === 0) return null;

  const currentContent = tabs[activeTab]?.content;

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
          <StorageIcon sx={{ fontSize: 28, color: "#FFFFFF" }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#001E2B",
            fontSize: { xs: "1.25rem", md: "1.5rem" },
          }}
        >
          Schema Explorer
        </Typography>
      </Stack>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{
          mb: 2,
          "& .MuiTab-root": {
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.9375rem",
            minHeight: 48,
          },
          "& .Mui-selected": {
            color: categoryData.color,
          },
          "& .MuiTabs-indicator": {
            backgroundColor: categoryData.color,
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      <Box
        sx={{
          position: "relative",
          border: `1px solid ${categoryData.color}30`,
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "#F7FAFC",
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: categoryData.lightBg,
            borderBottom: `1px solid ${categoryData.color}30`,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Tooltip title={copied ? "Copied!" : "Copy JSON"}>
            <IconButton
              size="small"
              onClick={() => handleCopy(JSON.stringify(currentContent, null, 2))}
              sx={{
                color: categoryData.color,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                },
              }}
            >
              {copied ? (
                <CheckIcon sx={{ fontSize: 20 }} />
              ) : (
                <CopyIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{
            "& pre": {
              margin: 0,
              borderRadius: 0,
              fontSize: { xs: "0.8125rem", md: "0.875rem" },
            },
          }}
        >
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "1.5rem",
              backgroundColor: "#1E1E1E",
            }}
          >
            {JSON.stringify(currentContent, null, 2)}
          </SyntaxHighlighter>
        </Box>
      </Box>
    </Paper>
  );
}

