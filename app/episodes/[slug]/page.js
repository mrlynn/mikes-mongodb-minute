import { getEpisodeBySlug } from "@/lib/episodes";
import {
  Typography,
  Box,
  Paper,
  Chip,
  Stack,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import {
  YouTube as YouTubeIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const episode = await getEpisodeBySlug(resolvedParams.slug);

  if (!episode) {
    return {
      title: "Episode Not Found",
    };
  }

  return {
    title: `${episode.title} | Mike's MongoDB Minute`,
    description: episode.hook || `Episode #${episode.episodeNumber} - ${episode.title}`,
  };
}

export default async function EpisodeDetailPage({ params }) {
  const resolvedParams = await params;
  const episode = await getEpisodeBySlug(resolvedParams.slug);

  if (!episode) {
    notFound();
  }

  return (
    <Box>
      {/* Header */}
      <Box 
        sx={{ 
          mb: 5,
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          background: "linear-gradient(135deg, rgba(16, 168, 79, 0.05) 0%, rgba(16, 168, 79, 0.02) 100%)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
          {episode.episodeNumber && (
            <Chip 
              label={`Episode #${episode.episodeNumber}`} 
              color="primary"
              sx={{ fontWeight: 600 }}
            />
          )}
          <Chip 
            label={episode.category} 
            sx={{ fontWeight: 500 }}
          />
          <Chip 
            label={episode.difficulty} 
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Stack>

        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 700,
            mb: 3,
            fontSize: { xs: "1.75rem", md: "2.5rem" },
            lineHeight: 1.2,
          }}
        >
          {episode.title}
        </Typography>

        {/* Video Link */}
        {episode.videoUrl && (
          <Button
            href={episode.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            size="large"
            startIcon={<YouTubeIcon />}
            sx={{ 
              fontWeight: 600,
              px: 4,
              py: 1.5,
            }}
          >
            Watch Video
          </Button>
        )}
      </Box>

      {/* Script Content */}
      <Paper 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          mb: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              color: "primary.main",
            }}
          >
            60-Second Script
          </Typography>
        </Box>

        <Box>
          {/* Hook */}
          <Box 
            sx={{ 
              mb: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "primary.main",
              color: "white",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Chip 
                label="0-5s" 
                size="small" 
                sx={{ 
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                }} 
              />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
                Hook
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.7, color: "white" }}>
              {episode.hook}
            </Typography>
          </Box>

          {/* Problem/Context */}
          <Box 
            sx={{ 
              mb: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "rgba(16, 168, 79, 0.05)",
              borderLeft: "4px solid",
              borderColor: "primary.main",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Chip label="5-15s" size="small" color="primary" sx={{ fontWeight: 600 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Problem / Context
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.7, pl: 0 }}>
              {episode.problem}
            </Typography>
          </Box>

          {/* Tip/Solution */}
          <Box 
            sx={{ 
              mb: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "rgba(16, 168, 79, 0.08)",
              borderLeft: "4px solid",
              borderColor: "primary.light",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Chip label="15-45s" size="small" color="primary" sx={{ fontWeight: 600 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Tip / Solution
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.7, whiteSpace: "pre-wrap", pl: 0 }}>
              {episode.tip}
            </Typography>
          </Box>

          {/* Quick Win */}
          <Box 
            sx={{ 
              mb: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "rgba(16, 168, 79, 0.05)",
              borderLeft: "4px solid",
              borderColor: "primary.main",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Chip label="45-52s" size="small" color="primary" sx={{ fontWeight: 600 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Quick Win / Proof
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.7, pl: 0 }}>
              {episode.quickWin}
            </Typography>
          </Box>

          {/* CTA */}
          <Box 
            sx={{ 
              mb: 4,
              p: 3,
              borderRadius: 2,
              background: "linear-gradient(135deg, rgba(16, 168, 79, 0.1) 0%, rgba(16, 168, 79, 0.05) 100%)",
              borderLeft: "4px solid",
              borderColor: "primary.dark",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Chip label="52-60s" size="small" color="primary" sx={{ fontWeight: 600 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                CTA + Tease
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.7, pl: 0 }}>
              {episode.cta}
            </Typography>
          </Box>

          {/* Visual Suggestion */}
          {episode.visualSuggestion && (
            <Box 
              sx={{ 
                mt: 4,
                p: 3,
                borderRadius: 2,
                backgroundColor: "background.paper",
                border: "1px dashed",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Visual Suggestion
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: "0.95rem" }}>
                {episode.visualSuggestion}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Social Links */}
      {episode.socialLinks && Object.values(episode.socialLinks).some(link => link) && (
        <Paper 
          sx={{ 
            p: { xs: 3, md: 4 },
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Watch on Social Media
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 1.5 }}>
            {episode.socialLinks.youtube && (
              <Button
                href={episode.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="small"
                endIcon={<OpenInNewIcon />}
              >
                YouTube
              </Button>
            )}
            {episode.socialLinks.tiktok && (
              <Button
                href={episode.socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="small"
                endIcon={<OpenInNewIcon />}
              >
                TikTok
              </Button>
            )}
            {episode.socialLinks.linkedin && (
              <Button
                href={episode.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="small"
                endIcon={<OpenInNewIcon />}
              >
                LinkedIn
              </Button>
            )}
            {episode.socialLinks.instagram && (
              <Button
                href={episode.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="small"
                endIcon={<OpenInNewIcon />}
              >
                Instagram
              </Button>
            )}
            {episode.socialLinks.x && (
              <Button
                href={episode.socialLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="small"
                endIcon={<OpenInNewIcon />}
              >
                X (Twitter)
              </Button>
            )}
          </Stack>
        </Paper>
      )}

      {/* Back Button */}
      <Box sx={{ mt: 4 }}>
        <Link href="/episodes" style={{ textDecoration: 'none' }}>
          <Button 
            variant="outlined" 
            size="large"
            sx={{ 
              fontWeight: 600,
              px: 4,
            }}
          >
            ← Back to All Episodes
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
