"use client";

import { Card, CardContent, CardActions, Typography, Chip, Stack, Button, Box, IconButton, Tooltip } from "@mui/material";
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
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  PlayCircle as PlayCircleIcon,
} from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import HighlightText from "./HighlightText";
import { useTheme } from "@/contexts/ThemeContext";

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

export default function EpisodeCard({ episode, searchQuery = "" }) {
  const { darkMode } = useTheme();
  const categoryData = categoryConfig[episode.category] || categoryConfig["Data Modeling"];
  const CategoryIcon = categoryData.icon;
  const difficultyColor = difficultyColors[episode.difficulty] || difficultyColors.Beginner;

  // Select a brand shape based on episode number or ID for variety
  const shapeNumber = episode.episodeNumber
    ? ((episode.episodeNumber - 1) % 8) + 1
    : Math.abs((episode._id || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 8) + 1;
  const shapeOptions = [1, 5, 10, 15, 20, 25, 30, 35];
  const selectedShape = shapeOptions[shapeNumber - 1];

  // Extract YouTube video ID and get thumbnail
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // If already an embed URL
    const embedMatch = url.match(/\/embed\/([^?&]+)/);
    if (embedMatch) return embedMatch[1];
    
    // Standard watch URL
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) return watchMatch[1];
    
    // Short URL
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return shortMatch[1];
    
    return null;
  };

  const videoUrl = episode.videoUrl || episode.socialLinks?.youtube;
  const youtubeVideoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;
  const thumbnailUrl = youtubeVideoId 
    ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`
    : null;

  return (
      <Card
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          border: darkMode ? "1px solid #2D3748" : "1px solid #E2E8F0",
          borderRadius: "12px",
          boxShadow: darkMode
            ? "0px 2px 8px rgba(0, 237, 100, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)"
            : "0px 2px 8px rgba(0, 0, 0, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.04)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          background: darkMode ? "#13181D" : "#FFFFFF",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: darkMode
              ? "0px 12px 24px rgba(0, 237, 100, 0.25), 0px 4px 8px rgba(0, 0, 0, 0.3)"
              : "0px 12px 24px rgba(0, 104, 74, 0.15), 0px 4px 8px rgba(0, 0, 0, 0.08)",
            borderColor: darkMode ? "#00ED64" : categoryData.color,
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
            "& .brand-shape": {
              opacity: darkMode ? 0.18 : 0.12,
              transform: "scale(1.05)",
            },
          },
          "&:active": {
            transform: "translateY(-2px)",
          },
          "&:focus-visible": {
            outline: darkMode ? "2px solid #00ED64" : "2px solid #00684A",
            outlineOffset: "4px",
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

      {/* Brand Shape Background - Upper Right */}
      <Box
        sx={{
          position: "absolute",
          top: -10,
          right: -20,
          width: 140,
          height: 140,
          pointerEvents: "none",
          zIndex: 0,
          transition: "all 0.3s ease",
          opacity: darkMode ? 0.12 : 0.08,
          backgroundColor: categoryData.color,
          // Use CSS mask to apply the shape - the background color shows through
          WebkitMaskImage: `url(/assets/shapes/shape-${selectedShape}.png)`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskImage: `url(/assets/shapes/shape-${selectedShape}.png)`,
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          filter: darkMode ? "brightness(1.2)" : "none",
        }}
        className="brand-shape"
      />

      {/* Brand Shape Background - Lower Left */}
      <Box
        sx={{
          position: "absolute",
          bottom: -15,
          left: -25,
          width: 120,
          height: 120,
          pointerEvents: "none",
          zIndex: 0,
          transition: "all 0.3s ease",
          opacity: darkMode ? 0.1 : 0.06,
          backgroundColor: categoryData.color,
          // Use CSS mask to apply the shape - the background color shows through
          WebkitMaskImage: `url(/assets/shapes/shape-${shapeOptions[(shapeNumber % shapeOptions.length)]}.png)`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskImage: `url(/assets/shapes/shape-${shapeOptions[(shapeNumber % shapeOptions.length)]}.png)`,
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          filter: darkMode ? "brightness(1.2)" : "none",
        }}
        className="brand-shape"
      />

      <CardContent sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column", pb: 1.5, width: "100%", boxSizing: "border-box", position: "relative", zIndex: 1 }}>
        {/* Video Thumbnail/Placeholder */}
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16/9",
            mb: 2,
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            background: darkMode
              ? `linear-gradient(135deg, ${categoryData.color}20 0%, ${categoryData.color}10 100%)`
              : `linear-gradient(135deg, ${categoryData.color}15 0%, ${categoryData.color}08 100%)`,
            border: darkMode ? `1px solid ${categoryData.color}30` : `1px solid ${categoryData.color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              "& .play-overlay": {
                opacity: 1,
                transform: "scale(1.1)",
              },
              "& .video-thumbnail": {
                transform: "scale(1.05)",
              },
            },
          }}
        >
          {thumbnailUrl ? (
            <>
              <Box
                component="img"
                src={thumbnailUrl}
                alt={episode.title}
                className="video-thumbnail"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onError={(e) => {
                  // Fallback if thumbnail fails to load
                  e.target.style.display = "none";
                }}
              />
              <Box
                className="play-overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0, 0, 0, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.7,
                  transition: "all 0.3s ease",
                }}
              >
                <PlayCircleIcon
                  sx={{
                    fontSize: 64,
                    color: "#FFFFFF",
                    filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.5))",
                  }}
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  backgroundColor: "rgba(255, 0, 0, 0.9)",
                  color: "#FFFFFF",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <YouTubeIcon sx={{ fontSize: 12 }} />
                YouTube
              </Box>
            </>
          ) : (
            <>
              {/* Video Placeholder */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                }}
              >
                <PlayCircleIcon
                  sx={{
                    fontSize: 64,
                    color: categoryData.color,
                    opacity: 0.6,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: darkMode ? "#A0AEC0" : "#5F6C76",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                  }}
                >
                  60-Second Video
                </Typography>
              </Box>
              {/* Decorative elements */}
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: categoryData.gradient,
                  opacity: 0.2,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: categoryData.gradient,
                  opacity: 0.3,
                }}
              />
            </>
          )}
        </Box>

        {/* Tags section with enhanced styling */}
        <Box sx={{ mb: 2, minHeight: "30px", display: "flex", alignItems: "flex-start" }}>
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
            {/* Workflow Status Badge */}
            {episode.workflow && (
              <Chip
                label={
                  episode.workflow.currentStage === "draft"
                    ? "Draft"
                    : episode.workflow.currentStage === "tech-review"
                    ? "In Review"
                    : "Approved"
                }
                size="small"
                sx={{
                  backgroundColor:
                    episode.workflow.currentStage === "draft"
                      ? "rgba(95, 108, 118, 0.1)"
                      : episode.workflow.currentStage === "tech-review"
                      ? "rgba(0, 119, 181, 0.1)"
                      : "rgba(0, 104, 74, 0.1)",
                  color:
                    episode.workflow.currentStage === "draft"
                      ? "#5F6C76"
                      : episode.workflow.currentStage === "tech-review"
                      ? "#00ED64"
                      : "#00684A",
                  fontWeight: 600,
                  fontSize: "0.6875rem",
                  height: "24px",
                  border:
                    episode.workflow.currentStage === "draft"
                      ? "1px solid #5F6C7630"
                      : episode.workflow.currentStage === "tech-review"
                      ? "1px solid #00ED6430"
                      : "1px solid #00684A30",
                }}
              />
            )}
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
              color: darkMode ? "#E2E8F0" : "#001E2B",
            }}
          >
            <HighlightText text={episode.title} query={searchQuery} />
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
              color: darkMode ? "#A0AEC0" : "#5F6C76",
              fontSize: "0.875rem",
            }}
          >
            <HighlightText text={episode.hook} query={searchQuery} />
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
              color: darkMode ? "#A0AEC0" : "#5F6C76",
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

      {/* Social Media Links - Only show if any links exist */}
      {episode.socialLinks && Object.values(episode.socialLinks).some(link => link) && (
        <Box sx={{ px: 3, pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: darkMode ? "#A0AEC0" : "#5F6C76",
                fontSize: "0.6875rem",
                fontWeight: 500,
                mr: 0.5,
              }}
            >
              Watch on:
            </Typography>
            <Stack direction="row" spacing={0.5}>
              {episode.socialLinks.youtube && (
                <Tooltip title="YouTube" arrow>
                  <IconButton
                    component="a"
                    href={episode.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      width: 28,
                      height: 28,
                      backgroundColor: "rgba(255, 0, 0, 0.08)",
                      color: "#FF0000",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#FF0000",
                        color: "#FFFFFF",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <YouTubeIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
              {episode.socialLinks.linkedin && (
                <Tooltip title="LinkedIn" arrow>
                  <IconButton
                    component="a"
                    href={episode.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      width: 28,
                      height: 28,
                      backgroundColor: "rgba(0, 119, 181, 0.08)",
                      color: "#0077B5",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#00ED64",
                        color: "#FFFFFF",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <LinkedInIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
              {episode.socialLinks.x && (
                <Tooltip title="X (Twitter)" arrow>
                  <IconButton
                    component="a"
                    href={episode.socialLinks.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      width: 28,
                      height: 28,
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                      color: "#000000",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#000000",
                        color: "#FFFFFF",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <TwitterIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
              {episode.socialLinks.tiktok && (
                <Tooltip title="TikTok" arrow>
                  <IconButton
                    component="a"
                    href={episode.socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      width: 28,
                      height: 28,
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                      color: "#000000",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.625rem",
                      fontFamily: "monospace",
                      "&:hover": {
                        backgroundColor: "#000000",
                        color: "#FFFFFF",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    TT
                  </IconButton>
                </Tooltip>
              )}
              {episode.socialLinks.instagram && (
                <Tooltip title="Instagram" arrow>
                  <IconButton
                    component="a"
                    href={episode.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      width: 28,
                      height: 28,
                      background: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)",
                      color: "#FFFFFF",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.625rem",
                      fontFamily: "monospace",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: "0px 4px 8px rgba(245, 133, 41, 0.3)",
                      },
                    }}
                  >
                    IG
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Box>
        </Box>
      )}

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
            color: darkMode ? "#00ED64" : categoryData.color,
            fontSize: "0.875rem",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: "8px",
            py: 1.5,
            border: darkMode
              ? "1px solid #00ED6430"
              : `1px solid ${categoryData.color}20`,
            "&:hover": {
              backgroundColor: darkMode ? "#1A3A2F" : categoryData.lightBg,
              borderColor: darkMode ? "#00ED64" : categoryData.color,
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
