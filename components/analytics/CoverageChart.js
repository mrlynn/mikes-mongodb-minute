"use client";

import { useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { BarChart as BarChartIcon } from "@mui/icons-material";
import { useTheme } from "@/contexts/ThemeContext";

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
  "Miscellaneous",
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export default function CoverageChart({ episodes, stats }) {
  const { darkMode } = useTheme();
  const matrix = useMemo(() => {
    const matrixData = {};

    CATEGORIES.forEach((category) => {
      DIFFICULTIES.forEach((difficulty) => {
        const key = `${category}-${difficulty}`;
        matrixData[key] = {
          category,
          difficulty,
          count: stats?.categoryDifficulty?.[key] || 0,
        };
      });
    });

    return matrixData;
  }, [stats]);

  const getCellColor = (count, darkMode) => {
    if (count === 0) return darkMode ? "#1A2328" : "#F7FAFC";
    if (count <= 2) return darkMode ? "#1A3A2F" : "#E6F7F0";
    if (count <= 5) return darkMode ? "#00684A" : "#B8E6D1";
    return darkMode ? "#00ED64" : "#00684A";
  };

  const getCellTextColor = (count, darkMode) => {
    if (count === 0) return darkMode ? "#5F6C76" : "#CBD5E0";
    if (count <= 2) return darkMode ? "#00ED64" : "#001E2B";
    return darkMode ? "#001E2B" : "#FFFFFF";
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: { xs: 2, md: 3 },
        border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
        backgroundColor: darkMode ? "#13181D" : "background.paper",
        overflow: "auto",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <BarChartIcon sx={{ color: darkMode ? "#00ED64" : "#00684A", fontSize: 24 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "1rem", md: "1.25rem" }, color: darkMode ? "#E2E8F0" : "inherit" }}>
          Coverage Matrix
        </Typography>
      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2, fontSize: { xs: "0.875rem", md: "0.9375rem" } }}
      >
        Episodes by Category and Difficulty Level
      </Typography>

      <TableContainer>
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, position: "sticky", left: 0, backgroundColor: darkMode ? "#13181D" : "#FFFFFF", color: darkMode ? "#E2E8F0" : "inherit", zIndex: 10, borderBottom: darkMode ? "1px solid #2D3748" : undefined }}>
                Category
              </TableCell>
              {DIFFICULTIES.map((difficulty) => (
                <TableCell
                  key={difficulty}
                  align="center"
                  sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", md: "0.875rem" }, color: darkMode ? "#E2E8F0" : "inherit", borderBottom: darkMode ? "1px solid #2D3748" : undefined }}
                >
                  {difficulty}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", md: "0.875rem" }, color: darkMode ? "#E2E8F0" : "inherit", borderBottom: darkMode ? "1px solid #2D3748" : undefined }}>
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {CATEGORIES.map((category) => {
              const categoryTotal = DIFFICULTIES.reduce(
                (sum, difficulty) => sum + (matrix[`${category}-${difficulty}`]?.count || 0),
                0
              );

              return (
                <TableRow key={category}>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      position: "sticky",
                      left: 0,
                      backgroundColor: darkMode ? "#13181D" : "#FFFFFF",
                      color: darkMode ? "#E2E8F0" : "inherit",
                      zIndex: 10,
                      fontSize: { xs: "0.8125rem", md: "0.875rem" },
                      borderBottom: darkMode ? "1px solid #2D3748" : undefined,
                    }}
                  >
                    {category}
                  </TableCell>
                  {DIFFICULTIES.map((difficulty) => {
                    const cell = matrix[`${category}-${difficulty}`];
                    const count = cell?.count || 0;

                    return (
                      <TableCell
                        key={difficulty}
                        align="center"
                        sx={{
                          backgroundColor: getCellColor(count, darkMode),
                          color: getCellTextColor(count, darkMode),
                          fontWeight: 600,
                          fontSize: { xs: "0.8125rem", md: "0.875rem" },
                          minWidth: 80,
                          borderBottom: darkMode ? "1px solid #2D3748" : undefined,
                        }}
                      >
                        {count}
                      </TableCell>
                    );
                  })}
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      backgroundColor: categoryTotal > 0 ? (darkMode ? "#1A3A2F" : "#E6F7F0") : (darkMode ? "#1A2328" : "#F7FAFC"),
                      color: darkMode ? "#E2E8F0" : "inherit",
                      fontSize: { xs: "0.8125rem", md: "0.875rem" },
                      borderBottom: darkMode ? "1px solid #2D3748" : undefined,
                    }}
                  >
                    {categoryTotal}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, p: 2, backgroundColor: darkMode ? "#1A2328" : "#F7FAFC", border: darkMode ? "1px solid #2D3748" : undefined, borderRadius: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, display: "block", mb: 1, fontSize: { xs: "0.75rem", md: "0.8125rem" }, color: darkMode ? "#E2E8F0" : "inherit" }}>
          Legend:
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 16, height: 16, backgroundColor: "#F7FAFC", border: "1px solid #E2E8F0" }} />
            <Typography variant="caption" sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
              0 episodes
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 16, height: 16, backgroundColor: "#E6F7F0" }} />
            <Typography variant="caption" sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
              1-2 episodes
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 16, height: 16, backgroundColor: "#B8E6D1" }} />
            <Typography variant="caption" sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
              3-5 episodes
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 16, height: 16, backgroundColor: "#00684A" }} />
            <Typography variant="caption" sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" }, color: "#00684A" }}>
              6+ episodes
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}

