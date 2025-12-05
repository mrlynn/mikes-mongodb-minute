"use client";

import { useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Chip,
  Grid,
} from "@mui/material";
import { BarChart as BarChartIcon } from "@mui/icons-material";

const STATUS_COLORS = {
  draft: "#FF9800",
  "ready-to-record": "#2196F3",
  recorded: "#9E9E9E",
  published: "#00ED64",
};

const STATUS_LABELS = {
  draft: "Draft",
  "ready-to-record": "Ready to Record",
  recorded: "Recorded",
  published: "Published",
};

export default function StatusOverview({ episodes, stats }) {
  const statusData = useMemo(() => {
    if (!stats?.statusCount) return [];

    const total = episodes.length;
    const statuses = ["draft", "ready-to-record", "recorded", "published"];

    return statuses.map((status) => {
      const count = stats.statusCount[status] || 0;
      const percentage = total > 0 ? (count / total) * 100 : 0;
      return {
        status,
        label: STATUS_LABELS[status],
        count,
        percentage: Math.round(percentage * 10) / 10,
        color: STATUS_COLORS[status],
      };
    });
  }, [stats, episodes]);

  const maxCount = Math.max(...statusData.map((d) => d.count), 1);

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: { xs: 2, md: 3 },
        border: "1px solid #E2E8F0",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <BarChartIcon sx={{ color: "#00684A", fontSize: 24 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "1rem", md: "1.25rem" } }}>
          Status Overview
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {statusData.map((item) => (
          <Grid size={{ xs: 6, sm: 3 }} key={item.status}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#F7FAFC",
                border: `2px solid ${item.color}`,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  color: item.color,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                }}
              >
                {item.count}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: "#001E2B",
                  fontSize: { xs: "0.75rem", md: "0.8125rem" },
                  display: "block",
                  mb: 0.5,
                }}
              >
                {item.label}
              </Typography>
              <Chip
                label={`${item.percentage}%`}
                size="small"
                sx={{
                  fontSize: { xs: "0.65rem", md: "0.7rem" },
                  height: { xs: "18px", md: "20px" },
                  fontWeight: 600,
                  backgroundColor: item.color,
                  color: "#FFFFFF",
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

