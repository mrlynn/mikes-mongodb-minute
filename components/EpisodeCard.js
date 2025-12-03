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
  "Data Modeling": "#00684A",
  "Indexing": "#00ED64",
  "Atlas": "#0066CC",
  "Vector & AI": "#7B2CBF",
  "Atlas Search": "#00B4D8",
  "Aggregation": "#FF6B35",
  "Security": "#E63946",
  "Migration": "#5F6C76",
  "New Features": "#00684A",
};

export default function EpisodeCard({ episode }) {
  const categoryColor = categoryColors[episode.category] || "#00684A";
  const difficultyColor = difficultyColors[episode.difficulty] || difficultyColors.Beginner;

  return (
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          border: "1px solid #E2E8F0",
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.04)",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)",
            borderColor: "#CBD5E0",
            "& .card-button": {
              color: "#00684A",
            },
          },
        }}
      >
      {/* Category accent bar */}
      <Box
        sx={{
          height: 3,
          background: categoryColor,
          width: "100%",
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 0.75 }}>
          {episode.episodeNumber && (
            <Chip
              label={`Episode #${episode.episodeNumber}`}
              size="small"
              sx={{
                backgroundColor: "#EDF2F7",
                color: "#001E2B",
                fontWeight: 500,
                fontSize: "0.6875rem",
                height: "22px",
              }}
            />
          )}
          <Chip
            label={episode.category}
            size="small"
            sx={{
              backgroundColor: "#EDF2F7",
              color: "#001E2B",
              fontWeight: 500,
              fontSize: "0.6875rem",
              height: "22px",
            }}
          />
        </Stack>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1.5,
            minHeight: { xs: "auto", md: "56px" },
            fontSize: { xs: "1rem", md: "1.125rem" },
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: "#001E2B",
          }}
        >
          {episode.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 2,
            minHeight: "40px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.5,
            color: "#5F6C76",
            fontSize: "0.875rem",
          }}
        >
          {episode.hook}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: "auto", alignItems: "center" }}>
          <Chip
            icon={<ScheduleIcon sx={{ fontSize: "14px !important", color: "#5F6C76 !important" }} />}
            label={episode.difficulty}
            size="small"
            sx={{
              backgroundColor: "#EDF2F7",
              color: "#001E2B",
              fontWeight: 500,
              fontSize: "0.6875rem",
              height: "22px",
            }}
          />
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          href={`/episodes/${episode.slug}`}
          endIcon={<ArrowForwardIcon sx={{ fontSize: "16px" }} />}
          className="card-button"
          variant="text"
          sx={{
            fontWeight: 500,
            color: "#5F6C76",
            fontSize: "0.875rem",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(0, 104, 74, 0.04)",
              color: "#00684A",
            },
          }}
        >
          View Script
        </Button>
      </CardActions>
    </Card>
  );
}
