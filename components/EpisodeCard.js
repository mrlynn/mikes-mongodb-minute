"use client";

import { Card, CardContent, CardActions, Typography, Chip, Stack, Button, Box } from "@mui/material";
import { ArrowForward as ArrowForwardIcon, Schedule as ScheduleIcon } from "@mui/icons-material";
import Link from "next/link";

const difficultyColors = {
  Beginner: { bg: "#E8F5E9", color: "#2E7D32" },
  Intermediate: { bg: "#E3F2FD", color: "#1976D2" },
  Advanced: { bg: "#F3E5F5", color: "#7B1FA2" },
};

const categoryColors = {
  "Data Modeling": "#10A84F",
  "Indexing": "#FF9800",
  "Atlas": "#2196F3",
  "Vector & AI": "#9C27B0",
  "Atlas Search": "#00BCD4",
  "Aggregation": "#FF5722",
  "Security": "#F44336",
  "Migration": "#607D8B",
  "New Features": "#4CAF50",
};

export default function EpisodeCard({ episode }) {
  const categoryColor = categoryColors[episode.category] || "#10A84F";
  const difficultyColor = difficultyColors[episode.difficulty] || difficultyColors.Beginner;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        border: "none",
        "&:hover": {
          "& .card-hover-overlay": {
            opacity: 1,
          },
          "& .card-button": {
            transform: "translateX(4px)",
          },
        },
      }}
    >
      {/* Category accent bar */}
      <Box
        sx={{
          height: 4,
          background: `linear-gradient(90deg, ${categoryColor} 0%, ${categoryColor}CC 100%)`,
          width: "100%",
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
          {episode.episodeNumber && (
            <Chip
              label={`Episode #${episode.episodeNumber}`}
              size="small"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
          )}
          <Chip
            label={episode.category}
            size="small"
            sx={{
              backgroundColor: `${categoryColor}15`,
              color: categoryColor,
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        </Stack>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            minHeight: { xs: "auto", md: "64px" },
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {episode.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            minHeight: "40px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.6,
          }}
        >
          {episode.hook}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: "auto", alignItems: "center" }}>
          <Chip
            icon={<ScheduleIcon sx={{ fontSize: "16px !important" }} />}
            label={episode.difficulty}
            size="small"
            sx={{
              backgroundColor: difficultyColor.bg,
              color: difficultyColor.color,
              fontWeight: 500,
              fontSize: "0.75rem",
            }}
          />
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          href={`/episodes/${episode.slug}`}
          endIcon={<ArrowForwardIcon />}
          className="card-button"
          sx={{
            fontWeight: 600,
            color: "primary.main",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(16, 168, 79, 0.08)",
            },
          }}
        >
          View Script
        </Button>
      </CardActions>

      {/* Hover overlay effect */}
      <Box
        className="card-hover-overlay"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${categoryColor}08 0%, transparent 100%)`,
          opacity: 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />
    </Card>
  );
}
