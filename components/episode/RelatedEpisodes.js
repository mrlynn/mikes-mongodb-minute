"use client";

import {
  Paper,
  Typography,
  Box,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
} from "@mui/material";
import {
  Link as LinkIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import Link from "next/link";

export default function RelatedEpisodes({ relatedEpisodes = [], categoryData }) {
  if (!relatedEpisodes || relatedEpisodes.length === 0) {
    return null;
  }

  return (
    <Paper
      sx={{
        p: { xs: 3, md: 4 },
        mb: 4,
        borderRadius: 3,
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: categoryData.gradient,
        }}
      />

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3, mt: 1 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            background: categoryData.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LinkIcon sx={{ fontSize: 28, color: "#FFFFFF" }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#001E2B",
            fontSize: { xs: "1.25rem", md: "1.5rem" },
          }}
        >
          Related Episodes
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {relatedEpisodes.map((episode) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={episode._id}>
            <Card
              component={Link}
              href={`/episodes/${episode.slug}`}
              sx={{
                height: "100%",
                textDecoration: "none",
                border: `1px solid ${categoryData.color}30`,
                borderRadius: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: categoryData.color,
                  boxShadow: `0px 4px 12px ${categoryData.color}30`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardActionArea sx={{ height: "100%", p: 2 }}>
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      {episode.episodeNumber && (
                        <Chip
                          label={`#${episode.episodeNumber}`}
                          size="small"
                          sx={{
                            backgroundColor: categoryData.lightBg,
                            color: categoryData.color,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            height: "24px",
                          }}
                        />
                      )}
                      <Chip
                        label={episode.difficulty}
                        size="small"
                        sx={{
                          backgroundColor: "#EDF2F7",
                          color: "#001E2B",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          height: "24px",
                        }}
                      />
                    </Stack>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#001E2B",
                        fontSize: { xs: "0.9375rem", md: "1rem" },
                        lineHeight: 1.4,
                      }}
                    >
                      {episode.title}
                    </Typography>
                    {episode.hook && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#5F6C76",
                          fontSize: { xs: "0.8125rem", md: "0.875rem" },
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {episode.hook}
                      </Typography>
                    )}
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: categoryData.color,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                        }}
                      >
                        View Episode
                      </Typography>
                      <ArrowForwardIcon
                        sx={{
                          fontSize: 16,
                          color: categoryData.color,
                        }}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

