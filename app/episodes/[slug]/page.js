import { getEpisodeBySlug, listEpisodes } from "@/lib/episodes";
import {
  Typography,
  Box,
  Paper,
  Chip,
  Stack,
  Divider,
  Button,
  IconButton,
  Container,
  Breadcrumbs,
} from "@mui/material";
import {
  YouTube as YouTubeIcon,
  OpenInNew as OpenInNewIcon,
  Storage as StorageIcon,
  Search as SearchIcon,
  Cloud as CloudIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  SwapHoriz as SwapHorizIcon,
  FiberNew as FiberNewIcon,
  CheckCircle as CheckCircleIcon,
  LightbulbOutlined as LightbulbIcon,
  RocketLaunch as RocketIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { notFound } from "next/navigation";

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

  // Get all episodes to find previous/next
  const allEpisodes = await listEpisodes();
  const sortedEpisodes = allEpisodes
    .filter(ep => ep.episodeNumber) // Only episodes with numbers
    .sort((a, b) => a.episodeNumber - b.episodeNumber);

  const currentIndex = sortedEpisodes.findIndex(ep => ep._id === episode._id);
  const previousEpisode = currentIndex > 0 ? sortedEpisodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < sortedEpisodes.length - 1 ? sortedEpisodes[currentIndex + 1] : null;

  const categoryData = categoryConfig[episode.category] || categoryConfig["Data Modeling"];
  const CategoryIcon = categoryData.icon;

  return (
    <Box sx={{ maxWidth: "1000px", mx: "auto" }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: "#5F6C76" }} />}
          sx={{
            "& .MuiBreadcrumbs-separator": {
              mx: 1,
            },
          }}
        >
          <Button
            href="/"
            startIcon={<HomeIcon />}
            sx={{
              color: "#5F6C76",
              fontWeight: 500,
              fontSize: "0.875rem",
              textTransform: "none",
              p: 0.5,
              minWidth: "auto",
              "&:hover": {
                backgroundColor: "transparent",
                color: categoryData.color,
              },
            }}
          >
            Home
          </Button>
          <Typography
            sx={{
              color: "#001E2B",
              fontWeight: 600,
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            {episode.title}
          </Typography>
        </Breadcrumbs>
      </Box>
      {/* Category gradient bar at top */}
      <Box
        sx={{
          height: 6,
          background: categoryData.gradient,
          borderRadius: "3px 3px 0 0",
          mb: 0,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
          },
        }}
      />

      {/* Header with Video */}
      <Box
        sx={{
          mb: 5,
          borderRadius: "0 0 12px 12px",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderTop: "none",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
          position: "relative",
        }}
      >
        {/* Decorative background icon */}
        <Box
          sx={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            opacity: 0.03,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <CategoryIcon sx={{ fontSize: 200, color: categoryData.color }} />
        </Box>
        {/* Video Embed Area */}
        {episode.videoUrl && (() => {
          // Extract YouTube video ID from various URL formats
          const getYouTubeEmbedUrl = (url) => {
            if (!url) return null;

            // If already an embed URL, return as is
            if (url.includes('/embed/')) {
              return url;
            }

            // Extract video ID from various YouTube URL formats
            let videoId = null;

            // Format: https://www.youtube.com/watch?v=VIDEO_ID
            // Format: https://youtube.com/watch?v=VIDEO_ID
            const watchMatch = url.match(/[?&]v=([^&]+)/);
            if (watchMatch) {
              videoId = watchMatch[1];
            }

            // Format: https://youtu.be/VIDEO_ID
            const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
            if (shortMatch) {
              videoId = shortMatch[1];
            }

            // Format: https://www.youtube.com/embed/VIDEO_ID
            const embedMatch = url.match(/\/embed\/([^?&]+)/);
            if (embedMatch) {
              videoId = embedMatch[1];
            }

            // If we found a video ID, construct proper embed URL
            if (videoId) {
              return `https://www.youtube.com/embed/${videoId}`;
            }

            // Fallback: return original URL
            return url;
          };

          const embedUrl = getYouTubeEmbedUrl(episode.videoUrl);

          return embedUrl ? (
            <Box
              sx={{
                position: "relative",
                paddingBottom: "56.25%", // 16:9 aspect ratio
                height: 0,
                backgroundColor: "#000",
              }}
            >
              <iframe
                src={embedUrl}
                title={episode.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </Box>
          ) : null;
        })()}

        {/* Episode Info */}
        <Box sx={{ p: { xs: 3, md: 4 }, position: "relative", zIndex: 1 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
            {episode.episodeNumber && (
              <Chip
                label={`#${episode.episodeNumber}`}
                size="medium"
                sx={{
                  background: categoryData.gradient,
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  height: "32px",
                  px: 1,
                }}
              />
            )}
            <Chip
              icon={<CategoryIcon sx={{ fontSize: "18px !important", color: `${categoryData.color} !important` }} />}
              label={episode.category}
              size="medium"
              sx={{
                backgroundColor: categoryData.lightBg,
                color: categoryData.color,
                fontWeight: 600,
                fontSize: "0.875rem",
                height: "32px",
                border: `2px solid ${categoryData.color}30`,
              }}
            />
            <Chip
              label={episode.difficulty}
              size="medium"
              sx={{
                backgroundColor: "#EDF2F7",
                color: "#001E2B",
                fontWeight: 600,
                fontSize: "0.875rem",
                height: "32px",
                border: "1px solid #CBD5E0",
              }}
            />
            <Chip
              label="60 seconds"
              size="medium"
              sx={{
                backgroundColor: "#EDF2F7",
                color: "#5F6C76",
                fontWeight: 600,
                fontSize: "0.875rem",
                height: "32px",
              }}
            />
          </Stack>

          {/* Decorative accent line */}
          <Box
            sx={{
              width: "60px",
              height: "4px",
              background: categoryData.gradient,
              borderRadius: "2px",
              mb: 3,
            }}
          />

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
            <LightbulbIcon sx={{ fontSize: 28, color: "#FFFFFF" }} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#001E2B",
            }}
          >
            What You'll Learn
          </Typography>
        </Stack>

        {/* The Problem */}
        {episode.problem && (
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: categoryData.gradient,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: categoryData.color,
                  fontSize: "1.125rem",
                }}
              >
                The Challenge
              </Typography>
            </Stack>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.0625rem",
                lineHeight: 1.8,
                color: "#001E2B",
                pl: 3,
              }}
            >
              {episode.problem}
            </Typography>
          </Box>
        )}

        {/* The Solution */}
        {episode.tip && (
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: categoryData.gradient,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: categoryData.color,
                  fontSize: "1.125rem",
                }}
              >
                The Solution
              </Typography>
            </Stack>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.0625rem",
                lineHeight: 1.8,
                color: "#001E2B",
                whiteSpace: "pre-wrap",
                pl: 3,
              }}
            >
              {episode.tip}
            </Typography>
          </Box>
        )}

        {/* Key Takeaway - Enhanced styling */}
        {episode.quickWin && (
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${categoryData.lightBg} 0%, ${categoryData.lightBg}cc 100%)`,
              border: `2px solid ${categoryData.color}30`,
              borderLeft: `6px solid ${categoryData.color}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background decoration */}
            <Box
              sx={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                opacity: 0.05,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 100, color: categoryData.color }} />
            </Box>

            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2, position: "relative", zIndex: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 24, color: categoryData.color }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: categoryData.color,
                  fontSize: "1.125rem",
                }}
              >
                Key Takeaway
              </Typography>
            </Stack>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.0625rem",
                lineHeight: 1.8,
                color: "#001E2B",
                fontWeight: 500,
                position: "relative",
                zIndex: 1,
              }}
            >
              {episode.quickWin}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* CTA Section - NEW */}
      {episode.cta && (
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 3,
            background: categoryData.gradient,
            color: "#FFFFFF",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
          }}
        >
          {/* Decorative elements */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
            }}
          />

          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3, position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RocketIcon sx={{ fontSize: 28, color: "#FFFFFF" }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              Take Action
            </Typography>
          </Stack>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              lineHeight: 1.8,
              color: "#FFFFFF",
              mb: 3,
              position: "relative",
              zIndex: 1,
            }}
          >
            {episode.cta}
          </Typography>

          <Button
            href="/"
            variant="contained"
            size="large"
            sx={{
              background: "#FFFFFF",
              color: categoryData.color,
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              position: "relative",
              zIndex: 1,
              "&:hover": {
                background: "#F7FAFC",
                transform: "translateY(-2px)",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Explore More Episodes
          </Button>
        </Paper>
      )}

      {/* Social Links - Enhanced */}
      {episode.socialLinks && Object.values(episode.socialLinks).some(link => link) && (
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 3,
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

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 3,
              mt: 1,
              color: "#001E2B",
            }}
          >
            Watch on Social Media
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 2 }}>
            {episode.socialLinks.youtube && (
              <Button
                href={episode.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="medium"
                endIcon={<OpenInNewIcon />}
                sx={{
                  borderColor: categoryData.color,
                  color: categoryData.color,
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: categoryData.color,
                    background: categoryData.lightBg,
                  },
                }}
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
                size="medium"
                endIcon={<OpenInNewIcon />}
                sx={{
                  borderColor: categoryData.color,
                  color: categoryData.color,
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: categoryData.color,
                    background: categoryData.lightBg,
                  },
                }}
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
                size="medium"
                endIcon={<OpenInNewIcon />}
                sx={{
                  borderColor: categoryData.color,
                  color: categoryData.color,
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: categoryData.color,
                    background: categoryData.lightBg,
                  },
                }}
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
                size="medium"
                endIcon={<OpenInNewIcon />}
                sx={{
                  borderColor: categoryData.color,
                  color: categoryData.color,
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: categoryData.color,
                    background: categoryData.lightBg,
                  },
                }}
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
                size="medium"
                endIcon={<OpenInNewIcon />}
                sx={{
                  borderColor: categoryData.color,
                  color: categoryData.color,
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: categoryData.color,
                    background: categoryData.lightBg,
                  },
                }}
              >
                X (Twitter)
              </Button>
            )}
          </Stack>
        </Paper>
      )}

      {/* Episode Navigation - Enhanced with Previous/Next */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
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

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: "stretch",
            mt: 1,
          }}
        >
          {/* Previous Episode */}
          <Box sx={{ flex: 1 }}>
            {previousEpisode ? (
              <Button
                href={`/episodes/${previousEpisode.slug}`}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  p: 2,
                  borderRadius: "8px",
                  border: `1px solid ${categoryData.color}30`,
                  background: "#FFFFFF",
                  color: categoryData.color,
                  transition: "all 0.3s ease",
                  height: "100%",
                  "&:hover": {
                    background: categoryData.lightBg,
                    borderColor: categoryData.color,
                    transform: "translateX(-4px)",
                    boxShadow: `0px 4px 12px ${categoryData.color}30`,
                  },
                }}
              >
                <Stack spacing={0.5} alignItems="flex-start" sx={{ width: "100%" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ArrowBackIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, textTransform: "uppercase", fontSize: "0.6875rem" }}>
                      Previous
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Episode #{previousEpisode.episodeNumber}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.8125rem",
                      color: "#5F6C76",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {previousEpisode.title}
                  </Typography>
                </Stack>
              </Button>
            ) : (
              <Box
                sx={{
                  p: 2,
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  background: "#F7FAFC",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" sx={{ color: "#A0AEC0", fontSize: "0.875rem" }}>
                  No previous episode
                </Typography>
              </Box>
            )}
          </Box>

          {/* Back to All Episodes - Center */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: { xs: "100%", md: "200px" } }}>
            <Button
              href="/"
              variant="outlined"
              size="large"
              sx={{
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: "8px",
                borderColor: categoryData.color,
                color: categoryData.color,
                borderWidth: 2,
                whiteSpace: "nowrap",
                "&:hover": {
                  borderWidth: 2,
                  borderColor: categoryData.color,
                  background: categoryData.lightBg,
                  transform: "translateY(-2px)",
                  boxShadow: `0px 4px 12px ${categoryData.color}30`,
                },
                transition: "all 0.3s ease",
              }}
            >
              All Episodes
            </Button>
          </Box>

          {/* Next Episode */}
          <Box sx={{ flex: 1 }}>
            {nextEpisode ? (
              <Button
                href={`/episodes/${nextEpisode.slug}`}
                fullWidth
                sx={{
                  justifyContent: "flex-end",
                  textAlign: "right",
                  p: 2,
                  borderRadius: "8px",
                  border: `1px solid ${categoryData.color}30`,
                  background: "#FFFFFF",
                  color: categoryData.color,
                  transition: "all 0.3s ease",
                  height: "100%",
                  "&:hover": {
                    background: categoryData.lightBg,
                    borderColor: categoryData.color,
                    transform: "translateX(4px)",
                    boxShadow: `0px 4px 12px ${categoryData.color}30`,
                  },
                }}
              >
                <Stack spacing={0.5} alignItems="flex-end" sx={{ width: "100%" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" sx={{ fontWeight: 600, textTransform: "uppercase", fontSize: "0.6875rem" }}>
                      Next
                    </Typography>
                    <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </Stack>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Episode #{nextEpisode.episodeNumber}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.8125rem",
                      color: "#5F6C76",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {nextEpisode.title}
                  </Typography>
                </Stack>
              </Button>
            ) : (
              <Box
                sx={{
                  p: 2,
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  background: "#F7FAFC",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" sx={{ color: "#A0AEC0", fontSize: "0.875rem" }}>
                  No next episode
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
