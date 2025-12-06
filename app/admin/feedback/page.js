"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  TrendingUp as TrendingUpIcon,
  Message as MessageIcon,
  Psychology as PsychologyIcon,
  BarChart as BarChartIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";

export default function FeedbackPage() {
  const { darkMode } = useTheme();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, [days]);

  async function fetchInsights() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/feedback/insights?days=${days}`);
      if (!res.ok) {
        throw new Error("Failed to fetch insights");
      }
      const data = await res.json();
      setInsights(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedback insights:", error);
      setError(error.message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button onClick={fetchInsights} startIcon={<RefreshIcon />} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  const satisfactionRatio = insights?.satisfaction?.ratio || 0;
  const helpfulCount = insights?.satisfaction?.helpful || 0;
  const notHelpfulCount = insights?.satisfaction?.notHelpful || 0;
  const totalSatisfaction = helpfulCount + notHelpfulCount;

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.75rem" },
              color: darkMode ? "#E2E8F0" : "inherit",
            }}
          >
            Feedback & Sentiment
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
            Understand what resonates, what confuses, and what developers want more of
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Period</InputLabel>
          <Select value={days} label="Time Period" onChange={(e) => setDays(e.target.value)}>
            <MenuItem value={7}>Last 7 days</MenuItem>
            <MenuItem value={30}>Last 30 days</MenuItem>
            <MenuItem value={90}>Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              borderRadius: 2,
              background: darkMode
                ? "linear-gradient(135deg, rgba(0, 237, 100, 0.15) 0%, rgba(0, 237, 100, 0.08) 100%)"
                : "linear-gradient(135deg, rgba(0, 104, 74, 0.1) 0%, rgba(0, 104, 74, 0.05) 100%)",
              border: darkMode ? "1px solid #2D4A3F" : "1px solid #E2E8F0",
              backgroundColor: darkMode ? "#13181D" : "background.paper",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: darkMode ? "#00ED64" : "#00684A" }}>
              {insights?.totalFeedback || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Total Feedback
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              borderRadius: 2,
              background: darkMode
                ? "linear-gradient(135deg, rgba(0, 237, 100, 0.15) 0%, rgba(0, 237, 100, 0.08) 100%)"
                : "linear-gradient(135deg, rgba(0, 237, 100, 0.1) 0%, rgba(0, 237, 100, 0.05) 100%)",
              border: darkMode ? "1px solid #2D4A3F" : "1px solid #E2E8F0",
              backgroundColor: darkMode ? "#13181D" : "background.paper",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: "#00ED64" }}>
              {totalSatisfaction > 0 ? `${(satisfactionRatio * 100).toFixed(0)}%` : "N/A"}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Helpful Ratio
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              borderRadius: 2,
              backgroundColor: darkMode ? "#1A1F24" : "info.light",
              border: darkMode ? "1px solid #2D4A3F" : "1px solid #E2E8F0",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: darkMode ? "#00B4D8" : "info.dark" }}>
              {insights?.byType?.freeText || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Free Text
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              borderRadius: 2,
              background: darkMode
                ? "linear-gradient(135deg, rgba(123, 44, 191, 0.15) 0%, rgba(123, 44, 191, 0.08) 100%)"
                : "linear-gradient(135deg, rgba(123, 44, 191, 0.1) 0%, rgba(123, 44, 191, 0.05) 100%)",
              border: darkMode ? "1px solid #2D4A3F" : "1px solid #E2E8F0",
              backgroundColor: darkMode ? "#13181D" : "background.paper",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: darkMode ? "#7B2CBF" : "#7B2CBF" }}>
              {insights?.byType?.behavior || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Behaviors
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Satisfaction Breakdown */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              background: darkMode ? "#13181D" : "#FFFFFF",
              border: darkMode ? "1px solid #2D4A3F" : "1px solid #E2E8F0",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Satisfaction Breakdown
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ThumbUpIcon sx={{ color: "#00ED64" }} />
                  <Typography>Helpful</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {helpfulCount}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ThumbDownIcon sx={{ color: "#E63946" }} />
                  <Typography>Not Helpful</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {notHelpfulCount}
                </Typography>
              </Box>
              {totalSatisfaction > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    height: 8,
                    borderRadius: 4,
                    background: darkMode ? "#2D4A3F" : "#E2E8F0",
                    overflow: "hidden",
                    display: "flex",
                  }}
                >
                  <Box
                    sx={{
                      width: `${satisfactionRatio * 100}%`,
                      background: "linear-gradient(90deg, #00ED64 0%, #00684A 100%)",
                    }}
                  />
                  <Box
                    sx={{
                      width: `${(1 - satisfactionRatio) * 100}%`,
                      background: "#E63946",
                    }}
                  />
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Behavior Metrics */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              background: darkMode ? "#13181D" : "#FFFFFF",
              border: darkMode ? "1px solid #2D4A3F" : "1px solid #E2E8F0",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Behavior Metrics
            </Typography>
            <Stack spacing={2}>
              {Object.entries(insights?.behaviorMetrics || {}).length > 0 ? (
                Object.entries(insights.behaviorMetrics)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([action, count]) => (
                    <Box key={action} sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ textTransform: "capitalize" }}>
                        {action.replace(/([A-Z])/g, " $1").trim()}
                      </Typography>
                      <Chip label={count} size="small" color="primary" />
                    </Box>
                  ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No behavior data yet
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Top Episodes by Feedback */}
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              background: darkMode ? "#13181D" : "#FFFFFF",
              border: darkMode ? "1px solid #2D4A3F" : "1px solid #E2E8F0",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Top Episodes by Feedback
            </Typography>
            {insights?.topEpisodes && insights.topEpisodes.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Episode</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Feedback Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {insights.topEpisodes.map((item) => (
                      <TableRow key={item.episodeId}>
                        <TableCell>
                          {item.episode ? (
                            <Link
                              href={`/episodes/${item.episode.slug}`}
                              sx={{ color: darkMode ? "#00ED64" : "#00684A", textDecoration: "none" }}
                            >
                              {item.episode.title}
                            </Link>
                          ) : (
                            `Episode ${item.episodeId}`
                          )}
                        </TableCell>
                        <TableCell>
                          {item.episode?.category && (
                            <Chip label={item.episode.category} size="small" />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={item.count} size="small" color="primary" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No episode feedback yet
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Confusion Hotspots */}
        {insights?.confusionHotspots && insights.confusionHotspots.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                background: darkMode ? "#13181D" : "#FFFFFF",
                border: darkMode ? "1px solid #2D4A3F" : "1px solid #E2E8F0",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Confusion Hotspots
              </Typography>
              <Stack spacing={1}>
                {insights.confusionHotspots.map((item, index) => (
                  <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                      {item.keyword}
                    </Typography>
                    <Chip label={item.count} size="small" color="warning" />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        )}

        {/* Feedback Clusters (if available) */}
        {insights?.feedbackClusters && insights.feedbackClusters.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                background: darkMode ? "#13181D" : "#FFFFFF",
                border: darkMode ? "1px solid #2D4A3F" : "1px solid #E2E8F0",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
                <PsychologyIcon sx={{ fontSize: 20 }} />
                Feedback Clusters
              </Typography>
              <Stack spacing={2}>
                {insights.feedbackClusters.slice(0, 5).map((cluster) => (
                  <Box
                    key={cluster.id}
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      background: darkMode ? "#1A2F2A" : "#F7FAFC",
                      border: darkMode ? "1px solid #2D4A3F" : "1px solid #E2E8F0",
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 1, fontStyle: "italic" }}>
                      "{cluster.representative}..."
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Chip label={`${cluster.count} similar`} size="small" />
                      {cluster.episodeIds.length > 0 && (
                        <Chip label={`${cluster.episodeIds.length} episodes`} size="small" color="secondary" />
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

