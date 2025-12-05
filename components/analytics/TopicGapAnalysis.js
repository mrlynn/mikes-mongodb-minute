"use client";

import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";
import {
  AutoAwesome as AIIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

const MONGODB_PRODUCT_AREAS = [
  {
    area: "Core Database",
    topics: [
      "Document Model",
      "Collections & Databases",
      "CRUD Operations",
      "Transactions",
      "Change Streams",
    ],
  },
  {
    area: "Data Modeling",
    topics: [
      "Embedded vs Referenced",
      "Schema Design Patterns",
      "Polymorphic Patterns",
      "Time-Series Data",
      "Subset Patterns",
    ],
  },
  {
    area: "Query & Indexing",
    topics: [
      "Query Optimization",
      "Index Types",
      "Compound Indexes",
      "Text Indexes",
      "Geospatial Indexes",
      "Explain Plans",
    ],
  },
  {
    area: "Aggregation Framework",
    topics: [
      "Pipeline Stages",
      "$lookup & Joins",
      "$group & $project",
      "$facet",
      "$merge & $out",
      "Performance Tips",
    ],
  },
  {
    area: "Atlas Platform",
    topics: [
      "Atlas Clusters",
      "Serverless Instances",
      "Atlas Triggers",
      "Atlas Functions",
      "Atlas Data Lake",
      "Atlas Charts",
    ],
  },
  {
    area: "Atlas Search",
    topics: [
      "Full-Text Search",
      "Autocomplete",
      "Facets",
      "Fuzzy Matching",
      "Relevance Tuning",
      "Synonyms",
    ],
  },
  {
    area: "Vector Search & AI",
    topics: [
      "Embeddings",
      "Vector Search",
      "RAG Patterns",
      "Semantic Search",
      "Hybrid Search",
      "AI Integration",
    ],
  },
  {
    area: "Security",
    topics: [
      "Authentication",
      "Authorization",
      "Encryption",
      "Network Security",
      "Audit Logging",
      "Field-Level Encryption",
    ],
  },
  {
    area: "Migration & Integration",
    topics: [
      "SQL to MongoDB",
      "Relational Migrator",
      "Schema Evolution",
      "Data Import/Export",
      "ETL Patterns",
    ],
  },
  {
    area: "Performance & Operations",
    topics: [
      "Monitoring",
      "Backup & Restore",
      "Scaling",
      "Sharding",
      "Replication",
      "Performance Tuning",
    ],
  },
];

export default function TopicGapAnalysis({ episodes }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  async function runGapAnalysis() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/analyze-gaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodes: episodes.map((e) => ({
            title: e.title,
            category: e.category,
            difficulty: e.difficulty,
            hook: e.hook,
            tip: e.tip,
          })),
          productAreas: MONGODB_PRODUCT_AREAS,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to analyze gaps");
      }

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: { xs: 2, md: 3 },
        border: "1px solid #E2E8F0",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <AIIcon sx={{ color: "#00684A", fontSize: 24 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "1rem", md: "1.25rem" } }}>
          AI-Powered Gap Analysis
        </Typography>
      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, fontSize: { xs: "0.875rem", md: "0.9375rem" } }}
      >
        Analyze your content coverage and get AI-powered recommendations for topics to cover based on MongoDB's product platform.
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!analysis && (
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AIIcon />}
          onClick={runGapAnalysis}
          disabled={loading || episodes.length === 0}
          sx={{
            backgroundColor: "#00684A",
            "&:hover": { backgroundColor: "#004D37" },
            fontWeight: 600,
          }}
        >
          {loading ? "Analyzing..." : "Run Gap Analysis"}
        </Button>
      )}

      {analysis && (
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: "0.9375rem", md: "1rem" } }}>
              Analysis Results
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={runGapAnalysis}
              disabled={loading}
              sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
            >
              Re-analyze
            </Button>
          </Stack>

          {/* Coverage Summary */}
          <Box
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              backgroundColor: "#F7FAFC",
              border: "1px solid #E2E8F0",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: { xs: "0.875rem", md: "0.9375rem" } }}>
              Overall Coverage
            </Typography>
            <Stack direction="row" spacing={3} flexWrap="wrap">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#00684A", fontSize: { xs: "1.5rem", md: "2rem" } }}>
                  {analysis.coveragePercentage}%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
                  Coverage Score
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#001E2B", fontSize: { xs: "1.5rem", md: "2rem" } }}>
                  {analysis.coveredAreas}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
                  Areas Covered
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#FF9800", fontSize: { xs: "1.5rem", md: "2rem" } }}>
                  {analysis.gapCount}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
                  Identified Gaps
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Recommended Topics */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <LightbulbIcon sx={{ color: "#FF9800", fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: "0.9375rem", md: "1rem" } }}>
                  Recommended Topics
                </Typography>
              </Stack>
              <List sx={{ p: 0 }}>
                {analysis.recommendations.map((rec, index) => (
                  <Box key={index}>
                    <ListItem
                      sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: 2,
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        "&:hover": {
                          backgroundColor: "#F7FAFC",
                          borderColor: "#00684A",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: "#00684A", fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              mb: 0.5,
                              fontSize: { xs: "0.875rem", md: "0.9375rem" },
                            }}
                          >
                            {rec.topic}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: { xs: "0.75rem", md: "0.8125rem" }, display: "block", mb: 1 }}
                            >
                              {rec.reason}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Chip
                                label={rec.category}
                                size="small"
                                sx={{
                                  fontSize: { xs: "0.65rem", md: "0.7rem" },
                                  height: { xs: "18px", md: "20px" },
                                  fontWeight: 500,
                                }}
                              />
                              <Chip
                                label={rec.suggestedDifficulty}
                                size="small"
                                sx={{
                                  fontSize: { xs: "0.65rem", md: "0.7rem" },
                                  height: { xs: "18px", md: "20px" },
                                  fontWeight: 500,
                                  backgroundColor: "#E6F7F0",
                                  color: "#00684A",
                                }}
                              />
                              {rec.priority && (
                                <Chip
                                  label={`Priority: ${rec.priority}`}
                                  size="small"
                                  sx={{
                                    fontSize: { xs: "0.65rem", md: "0.7rem" },
                                    height: { xs: "18px", md: "20px" },
                                    fontWeight: 600,
                                    backgroundColor: rec.priority === "High" ? "#FFE0E0" : "#FFF4E6",
                                    color: rec.priority === "High" ? "#E63946" : "#FF9800",
                                  }}
                                />
                              )}
                            </Stack>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < analysis.recommendations.length - 1 && <Divider sx={{ my: 0.5 }} />}
                  </Box>
                ))}
              </List>
            </Box>
          )}

          {/* Coverage by Area */}
          {analysis.areaCoverage && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, fontSize: { xs: "0.9375rem", md: "1rem" } }}>
                Coverage by Product Area
              </Typography>
              <Stack spacing={2}>
                {analysis.areaCoverage.map((area, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "#F7FAFC",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "0.875rem", md: "0.9375rem" },
                        }}
                      >
                        {area.area}
                      </Typography>
                      <Chip
                        label={`${area.coverage}% covered`}
                        size="small"
                        sx={{
                          fontSize: { xs: "0.7rem", md: "0.75rem" },
                          height: { xs: "20px", md: "22px" },
                          fontWeight: 600,
                          backgroundColor: area.coverage >= 70 ? "#00ED64" : area.coverage >= 40 ? "#FFA726" : "#E63946",
                          color: "#FFFFFF",
                        }}
                      />
                    </Stack>
                    <Box
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#E2E8F0",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${area.coverage}%`,
                          backgroundColor: area.coverage >= 70 ? "#00ED64" : area.coverage >= 40 ? "#FFA726" : "#E63946",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </Box>
                    {area.missingTopics && area.missingTopics.length > 0 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block", fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                      >
                        Missing: {area.missingTopics.slice(0, 3).join(", ")}
                        {area.missingTopics.length > 3 && ` +${area.missingTopics.length - 3} more`}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
}

