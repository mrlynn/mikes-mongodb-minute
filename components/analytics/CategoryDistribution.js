"use client";

import { useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Chip,
} from "@mui/material";
import { PieChart as PieChartIcon } from "@mui/icons-material";
import { useTheme } from "@/contexts/ThemeContext";

const CATEGORY_COLORS = {
  "Data Modeling": "#00684A",
  "Indexing": "#00ED64",
  "Atlas": "#001E2B",
  "Vector & AI": "#5F6C76",
  "Atlas Search": "#0077B5",
  "Aggregation": "#E63946",
  "Security": "#FFA726",
  "Migration": "#9C27B0",
  "New Features": "#00BCD4",
  "Miscellaneous": "#795548",
};

const EXPECTED_CATEGORIES = [
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

export default function CategoryDistribution({ episodes, stats }) {
  const { darkMode } = useTheme();
  const distribution = useMemo(() => {
    if (!stats?.categoryCount) return [];

    const total = episodes.length;
    const items = EXPECTED_CATEGORIES.map((category) => {
      const count = stats.categoryCount[category] || 0;
      const percentage = total > 0 ? (count / total) * 100 : 0;
      return {
        category,
        count,
        percentage: Math.round(percentage * 10) / 10,
        color: CATEGORY_COLORS[category] || "#CBD5E0",
      };
    });

    return items.sort((a, b) => b.count - a.count);
  }, [stats, episodes]);

  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: { xs: 2, md: 3 },
        border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
        backgroundColor: darkMode ? "#13181D" : "background.paper",
        height: "100%",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <PieChartIcon sx={{ color: darkMode ? "#00ED64" : "#00684A", fontSize: 24 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "1rem", md: "1.25rem" }, color: darkMode ? "#E2E8F0" : "inherit" }}>
          Category Distribution
        </Typography>
      </Stack>

      <Stack spacing={2}>
        {distribution.map((item) => (
          <Box key={item.category}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: item.color,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "0.875rem", md: "0.9375rem" },
                    color: darkMode ? "#E2E8F0" : "inherit",
                  }}
                >
                  {item.category}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: darkMode ? "#E2E8F0" : "#001E2B",
                    fontSize: { xs: "0.875rem", md: "0.9375rem" },
                  }}
                >
                  {item.count}
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
            <LinearProgress
              variant="determinate"
              value={(item.count / maxCount) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: darkMode ? "#2D3748" : "#E2E8F0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: item.color,
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        ))}
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

