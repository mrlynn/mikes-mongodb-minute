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
    <Box sx={{ maxWidth: "1000px", mx: "auto" }}>
      {/* Header with Video */}
      <Box
        sx={{
          mb: 5,
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Video Embed Area */}
        {episode.videoUrl && (
          <Box
            sx={{
              position: "relative",
              paddingBottom: "56.25%", // 16:9 aspect ratio
              height: 0,
              backgroundColor: "#000",
            }}
          >
            <iframe
              src={episode.videoUrl.replace('watch?v=', 'embed/')}
              title={episode.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </Box>
        )}

        {/* Episode Info */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
            {episode.episodeNumber && (
              <Chip
                label={`Episode #${episode.episodeNumber}`}
                size="small"
                sx={{
                  backgroundColor: "#EDF2F7",
                  color: "#001E2B",
                  fontWeight: 500,
                  fontSize: "0.75rem",
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
                fontSize: "0.75rem",
              }}
            />
            <Chip
              label={episode.difficulty}
              size="small"
              sx={{
                backgroundColor: "#EDF2F7",
                color: "#001E2B",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          </Stack>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              lineHeight: 1.3,
              color: "#001E2B",
              mb: 2,
            }}
          >
            {episode.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              lineHeight: 1.7,
              color: "#5F6C76",
            }}
          >
            {episode.hook}
          </Typography>
        </Box>
      </Box>

      {/* What You'll Learn */}
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 3,
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: "#001E2B",
          }}
        >
          What You'll Learn
        </Typography>

        {/* The Problem */}
        {episode.problem && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                color: "#00684A",
                fontSize: "1rem",
              }}
            >
              The Challenge
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "#001E2B",
              }}
            >
              {episode.problem}
            </Typography>
          </Box>
        )}

        {/* The Solution */}
        {episode.tip && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                color: "#00684A",
                fontSize: "1rem",
              }}
            >
              The Solution
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "#001E2B",
                whiteSpace: "pre-wrap",
              }}
            >
              {episode.tip}
            </Typography>
          </Box>
        )}

        {/* Key Takeaway */}
        {episode.quickWin && (
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "rgba(0, 104, 74, 0.05)",
              borderLeft: "4px solid #00684A",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                color: "#00684A",
                fontSize: "1rem",
              }}
            >
              Key Takeaway
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "#001E2B",
              }}
            >
              {episode.quickWin}
            </Typography>
          </Box>
        )}
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
