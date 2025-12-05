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

  const getCellColor = (count) => {
    if (count === 0) return "#F7FAFC";
    if (count <= 2) return "#E6F7F0";
    if (count <= 5) return "#B8E6D1";
    return "#00684A";
  };

  const getCellTextColor = (count) => {
    if (count === 0) return "#CBD5E0";
    if (count <= 2) return "#001E2B";
    return "#FFFFFF";
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: { xs: 2, md: 3 },
        border: "1px solid #E2E8F0",
        overflow: "auto",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <BarChartIcon sx={{ color: "#00684A", fontSize: 24 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "1rem", md: "1.25rem" } }}>
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
              <TableCell sx={{ fontWeight: 600, position: "sticky", left: 0, backgroundColor: "#FFFFFF", zIndex: 10 }}>
                Category
              </TableCell>
              {DIFFICULTIES.map((difficulty) => (
                <TableCell
                  key={difficulty}
                  align="center"
                  sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                >
                  {difficulty}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
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
                      backgroundColor: "#FFFFFF",
                      zIndex: 10,
                      fontSize: { xs: "0.8125rem", md: "0.875rem" },
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
                          backgroundColor: getCellColor(count),
                          color: getCellTextColor(count),
                          fontWeight: 600,
                          fontSize: { xs: "0.8125rem", md: "0.875rem" },
                          minWidth: 80,
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
                      backgroundColor: categoryTotal > 0 ? "#E6F7F0" : "#F7FAFC",
                      fontSize: { xs: "0.8125rem", md: "0.875rem" },
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

      <Box sx={{ mt: 2, p: 2, backgroundColor: "#F7FAFC", borderRadius: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, display: "block", mb: 1, fontSize: { xs: "0.75rem", md: "0.8125rem" } }}>
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

