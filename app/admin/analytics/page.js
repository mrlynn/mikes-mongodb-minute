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
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as LightbulbIcon,
  AutoAwesome as AIIcon,
} from "@mui/icons-material";
import { useTheme } from "@/contexts/ThemeContext";
import CoverageChart from "@/components/analytics/CoverageChart";
import TopicGapAnalysis from "@/components/analytics/TopicGapAnalysis";
import CategoryDistribution from "@/components/analytics/CategoryDistribution";
import DifficultyBreakdown from "@/components/analytics/DifficultyBreakdown";
import StatusOverview from "@/components/analytics/StatusOverview";

export default function AnalyticsPage() {
  const { darkMode } = useTheme();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  async function fetchEpisodes() {
    try {
      const res = await fetch("/api/episodes");
      const data = await res.json();
      setEpisodes(data);
      calculateStats(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching episodes:", error);
      setLoading(false);
    }
  }

  function calculateStats(episodesList) {
    const categoryCount = {};
    const difficultyCount = {};
    const statusCount = {};
    const categoryDifficulty = {};

    episodesList.forEach((ep) => {
      // Category counts
      categoryCount[ep.category] = (categoryCount[ep.category] || 0) + 1;

      // Difficulty counts
      difficultyCount[ep.difficulty] = (difficultyCount[ep.difficulty] || 0) + 1;

      // Status counts
      statusCount[ep.status] = (statusCount[ep.status] || 0) + 1;

      // Category + Difficulty matrix
      const key = `${ep.category}-${ep.difficulty}`;
      categoryDifficulty[key] = (categoryDifficulty[key] || 0) + 1;
    });

    setStats({
      total: episodesList.length,
      categoryCount,
      difficultyCount,
      statusCount,
      categoryDifficulty,
      published: episodesList.filter((e) => e.status === "published").length,
      draft: episodesList.filter((e) => e.status === "draft").length,
    });
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.75rem" },
            color: darkMode ? "#E2E8F0" : "inherit",
          }}
        >
          Content Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
          Analyze topic coverage and identify content gaps across MongoDB's product platform
        </Typography>
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
              {stats?.total || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Total Episodes
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
              {stats?.published || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Published
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              borderRadius: 2,
              backgroundColor: darkMode ? "#1A1F24" : "warning.light",
              border: darkMode ? "1px solid #3D3020" : "1px solid #E2E8F0",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: darkMode ? "#FFA726" : "warning.dark" }}>
              {stats?.draft || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Draft
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
                ? "linear-gradient(135deg, rgba(95, 108, 118, 0.15) 0%, rgba(95, 108, 118, 0.08) 100%)"
                : "linear-gradient(135deg, rgba(95, 108, 118, 0.1) 0%, rgba(95, 108, 118, 0.05) 100%)",
              border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
              backgroundColor: darkMode ? "#13181D" : "background.paper",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: darkMode ? "#A0AEC0" : "#5F6C76" }}>
              {Object.keys(stats?.categoryCount || {}).length}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Categories
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Analytics Grid */}
      <Grid container spacing={3}>
        {/* Category Distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CategoryDistribution episodes={episodes} stats={stats} />
        </Grid>

        {/* Difficulty Breakdown */}
        <Grid size={{ xs: 12, md: 6 }}>
          <DifficultyBreakdown episodes={episodes} stats={stats} />
        </Grid>

        {/* Status Overview */}
        <Grid size={{ xs: 12 }}>
          <StatusOverview episodes={episodes} stats={stats} />
        </Grid>

        {/* AI-Powered Gap Analysis */}
        <Grid size={{ xs: 12 }}>
          <TopicGapAnalysis episodes={episodes} />
        </Grid>

        {/* Coverage Matrix */}
        <Grid size={{ xs: 12 }}>
          <CoverageChart episodes={episodes} stats={stats} />
        </Grid>
      </Grid>
    </Box>
  );
}

