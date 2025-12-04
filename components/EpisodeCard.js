"use client";

import { Card, CardContent, CardActions, Typography, Chip, Stack, Button, Box } from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  Schedule as ScheduleIcon,
  Storage as StorageIcon,
  Search as SearchIcon,
  Cloud as CloudIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  SwapHoriz as SwapHorizIcon,
  FiberNew as FiberNewIcon,
} from "@mui/icons-material";
import Link from "next/link";

const difficultyColors = {
  Beginner: { bg: "#E8F5E9", color: "#2E7D32" },
  Intermediate: { bg: "#E3F2FD", color: "#1976D2" },
  Advanced: { bg: "#F3E5F5", color: "#7B1FA2" },
};

const categoryConfig = {
  "Data Modeling": {
    color: "#00684A",
    gradient: "linear-gradient(135deg, #00684A 0%, #004D37 100%)",
    icon: StorageIcon,
    lightBg: "rgba(0, 104, 74, 0.05)",
  },
  "Indexing": {
    color: "#00ED64",
    gradient: "linear-gradient(135deg, #00ED64 0%, #00C853 100%)",
    icon: TrendingUpIcon,
    lightBg: "rgba(0, 237, 100, 0.08)",
  },
  "Atlas": {
    color: "#0066CC",
    gradient: "linear-gradient(135deg, #0066CC 0%, #0047AB 100%)",
    icon: CloudIcon,
    lightBg: "rgba(0, 102, 204, 0.06)",
  },
  "Vector & AI": {
    color: "#7B2CBF",
    gradient: "linear-gradient(135deg, #7B2CBF 0%, #5A189A 100%)",
    icon: PsychologyIcon,
    lightBg: "rgba(123, 44, 191, 0.06)",
  },
  "Atlas Search": {
    color: "#00B4D8",
    gradient: "linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)",
    icon: SearchIcon,
    lightBg: "rgba(0, 180, 216, 0.06)",
  },
  "Aggregation": {
    color: "#FF6B35",
    gradient: "linear-gradient(135deg, #FF6B35 0%, #F44336 100%)",
    icon: TrendingUpIcon,
    lightBg: "rgba(255, 107, 53, 0.06)",
  },
  "Security": {
    color: "#E63946",
    gradient: "linear-gradient(135deg, #E63946 0%, #C62828 100%)",
    icon: SecurityIcon,
    lightBg: "rgba(230, 57, 70, 0.06)",
  },
  "Migration": {
    color: "#5F6C76",
    gradient: "linear-gradient(135deg, #5F6C76 0%, #4A5568 100%)",
    icon: SwapHorizIcon,
    lightBg: "rgba(95, 108, 118, 0.06)",
  },
  "New Features": {
    color: "#00684A",
    gradient: "linear-gradient(135deg, #00684A 0%, #004D37 100%)",
    icon: FiberNewIcon,
    lightBg: "rgba(0, 104, 74, 0.05)",
  },
};

export default function EpisodeCard({ episode }) {
  const categoryData = categoryConfig[episode.category] || categoryConfig["Data Modeling"];
  const CategoryIcon = categoryData.icon;
  const difficultyColor = difficultyColors[episode.difficulty] || difficultyColors.Beginner;

  return (
      <Card
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          border: "1px solid #E2E8F0",
          borderRadius: "12px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.04)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          background: "#FFFFFF",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 12px 24px rgba(0, 104, 74, 0.15), 0px 4px 8px rgba(0, 0, 0, 0.08)",
            borderColor: categoryData.color,
            "& .card-button": {
              background: categoryData.gradient,
              color: "#FFFFFF",
              transform: "translateX(4px)",
            },
            "& .category-icon": {
              transform: "scale(1.1) rotate(5deg)",
            },
            "& .accent-line": {
              width: "100%",
            },
          },
        }}
      >
      {/* Enhanced category accent bar with gradient */}
      <Box
        sx={{
          height: 4,
          background: categoryData.gradient,
          width: "100%",
          flexShrink: 0,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
          },
        }}
      />

      {/* Decorative background pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 4,
          right: -20,
          width: 120,
          height: 120,
          opacity: 0.04,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <CategoryIcon sx={{ fontSize: 120, color: categoryData.color }} />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column", pb: 1.5, width: "100%", boxSizing: "border-box", position: "relative", zIndex: 1 }}>
        {/* Tags section with enhanced styling */}
        <Box sx={{ mb: 2, height: "30px", display: "flex", alignItems: "flex-start" }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.75 }}>
            {episode.episodeNumber && (
              <Chip
                label={`#${episode.episodeNumber}`}
                size="small"
                sx={{
                  background: categoryData.gradient,
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "0.6875rem",
                  height: "24px",
                  px: 0.5,
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            )}
            <Chip
              icon={<CategoryIcon sx={{ fontSize: "14px !important", color: `${categoryData.color} !important` }} className="category-icon" />}
              label={episode.category}
              size="small"
              sx={{
                backgroundColor: categoryData.lightBg,
                color: categoryData.color,
                fontWeight: 600,
                fontSize: "0.6875rem",
                height: "24px",
                border: `1px solid ${categoryData.color}20`,
                transition: "all 0.2s ease",
              }}
            />
          </Stack>
        </Box>

        {/* Decorative accent line */}
        <Box
          className="accent-line"
          sx={{
            width: "40px",
            height: "3px",
            background: categoryData.gradient,
            borderRadius: "2px",
            mb: 2,
            transition: "width 0.3s ease",
          }}
        />

        {/* Title section - fixed height with 2 line clamp */}
        <Box sx={{ mb: 1.5, height: "56px", width: "100%" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1.125rem",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              color: "#001E2B",
            }}
          >
            {episode.title}
          </Typography>
        </Box>

        {/* Description section - fixed height with 3 line clamp */}
        <Box sx={{ mb: 2, height: "63px", width: "100%" }}>
          <Typography
            variant="body2"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              lineHeight: 1.5,
              color: "#5F6C76",
              fontSize: "0.875rem",
            }}
          >
            {episode.hook}
          </Typography>
        </Box>

        {/* Difficulty chip - fixed at bottom with enhanced styling */}
        <Box sx={{ mt: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Chip
            icon={<ScheduleIcon sx={{ fontSize: "14px !important", color: `${difficultyColor.color} !important` }} />}
            label={episode.difficulty}
            size="small"
            sx={{
              backgroundColor: difficultyColor.bg,
              color: difficultyColor.color,
              fontWeight: 600,
              fontSize: "0.6875rem",
              height: "24px",
              border: `1px solid ${difficultyColor.color}30`,
            }}
          />
          {/* 60-second indicator */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "#5F6C76",
              fontSize: "0.6875rem",
              fontWeight: 500,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: categoryData.gradient,
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                },
              }}
            />
            60s
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0, flexShrink: 0 }}>
        <Button
          component={Link}
          href={`/episodes/${episode.slug}`}
          endIcon={<ArrowForwardIcon sx={{ fontSize: "16px" }} />}
          className="card-button"
          variant="text"
          fullWidth
          sx={{
            fontWeight: 600,
            color: categoryData.color,
            fontSize: "0.875rem",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: "8px",
            py: 1.5,
            border: `1px solid ${categoryData.color}20`,
            "&:hover": {
              backgroundColor: categoryData.lightBg,
              borderColor: categoryData.color,
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
