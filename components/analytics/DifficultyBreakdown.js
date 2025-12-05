"use client";

import { useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Chip,
} from "@mui/material";
import { TrendingUp as TrendingUpIcon } from "@mui/icons-material";

const DIFFICULTY_COLORS = {
  Beginner: "#00ED64",
  Intermediate: "#00684A",
  Advanced: "#001E2B",
};

const DIFFICULTY_ICONS = {
  Beginner: "🌱",
  Intermediate: "⚡",
  Advanced: "🚀",
};

export default function DifficultyBreakdown({ episodes, stats }) {
  const breakdown = useMemo(() => {
    if (!stats?.difficultyCount) return [];

    const total = episodes.length;
    return ["Beginner", "Intermediate", "Advanced"].map((difficulty) => {
      const count = stats.difficultyCount[difficulty] || 0;
      const percentage = total > 0 ? (count / total) * 100 : 0;
      return {
        difficulty,
        count,
        percentage: Math.round(percentage * 10) / 10,
        color: DIFFICULTY_COLORS[difficulty],
        icon: DIFFICULTY_ICONS[difficulty],
      };
    });
  }, [stats, episodes]);

  const idealDistribution = {
    Beginner: 40,
    Intermediate: 40,
    Advanced: 20,
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: { xs: 2, md: 3 },
        border: "1px solid #E2E8F0",
        height: "100%",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <TrendingUpIcon sx={{ color: "#00684A", fontSize: 24 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "1rem", md: "1.25rem" } }}>
          Difficulty Breakdown
        </Typography>
      </Stack>

      <Stack spacing={2.5}>
        {breakdown.map((item) => {
          const ideal = idealDistribution[item.difficulty];
          const deviation = item.percentage - ideal;
          const isBalanced = Math.abs(deviation) <= 10;

          return (
            <Box key={item.difficulty}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1.5 }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h5">{item.icon}</Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.9375rem", md: "1rem" },
                    }}
                  >
                    {item.difficulty}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#001E2B",
                      fontSize: { xs: "0.875rem", md: "0.9375rem" },
                    }}
                  >
                    {item.count} episodes
                  </Typography>
                  <Chip
                    label={`${item.percentage}%`}
                    size="small"
                    sx={{
                      fontSize: { xs: "0.7rem", md: "0.75rem" },
                      height: { xs: "20px", md: "22px" },
                      fontWeight: 600,
                      backgroundColor: item.color,
                      color: "#FFFFFF",
                    }}
                  />
                </Stack>
              </Stack>

              <Box
                sx={{
                  position: "relative",
                  height: 32,
                  backgroundColor: "#F7FAFC",
                  borderRadius: 2,
                  border: "1px solid #E2E8F0",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                    opacity: 0.8,
                    transition: "width 0.3s ease",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    left: `${ideal}%`,
                    top: 0,
                    height: "100%",
                    width: "2px",
                    backgroundColor: "#001E2B",
                    opacity: 0.3,
                  }}
                />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    position: "relative",
                    height: "100%",
                    px: 2,
                    zIndex: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: item.percentage > 5 ? "#FFFFFF" : "#001E2B",
                      fontSize: { xs: "0.7rem", md: "0.75rem" },
                    }}
                  >
                    Current: {item.percentage}%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: "#5F6C76",
                      fontSize: { xs: "0.7rem", md: "0.75rem" },
                    }}
                  >
                    Target: {ideal}%
                  </Typography>
                </Stack>
              </Box>

              {!isBalanced && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    color: deviation > 0 ? "#FF9800" : "#00BCD4",
                    fontSize: { xs: "0.7rem", md: "0.75rem" },
                    fontStyle: "italic",
                  }}
                >
                  {deviation > 0
                    ? `+${deviation.toFixed(1)}% above ideal`
                    : `${deviation.toFixed(1)}% below ideal`}
                </Typography>
              )}
            </Box>
          );
        })}
      </Stack>

      {episodes.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No episodes to analyze
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

