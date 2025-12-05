"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import {
  YouTube as YouTubeIcon,
  CheckCircle as CheckCircleIcon,
  Link as LinkIcon,
  Publish as PublishIcon,
  LinkOff as LinkOffIcon,
  VideoLibrary as TikTokIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";

export default function SocialMediaPublisher({ episode }) {
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  const [tiktokConnected, setTiktokConnected] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState({ youtube: false, tiktok: false, linkedin: false });
  const [publishStatus, setPublishStatus] = useState(null);
  const [youtubePost, setYoutubePost] = useState(null);
  const [tiktokPost, setTiktokPost] = useState(null);
  const [linkedinPost, setLinkedinPost] = useState(null);
  const [publishDialog, setPublishDialog] = useState(null); // null, 'youtube', 'tiktok', or 'linkedin'
  const [privacyStatus, setPrivacyStatus] = useState("unlisted");

  // Check connection status on mount
  useEffect(() => {
    checkConnections();
    checkPublishStatus();
  }, [episode._id]);

  async function checkConnections() {
    try {
      const res = await fetch("/api/social/status");
      if (res.ok) {
        const data = await res.json();
        setYoutubeConnected(data.youtube?.connected || false);
        setTiktokConnected(data.tiktok?.connected || false);
        setLinkedinConnected(data.linkedin?.connected || false);
      }
    } catch (error) {
      console.error("Failed to check connections:", error);
    } finally {
      setLoading(false);
    }
  }

  async function checkPublishStatus() {
    try {
      const res = await fetch(`/api/social/status/${episode._id}`);
      if (res.ok) {
        const data = await res.json();
        setYoutubePost(data.youtube);
        setTiktokPost(data.tiktok);
        setLinkedinPost(data.linkedin);
      }
    } catch (error) {
      console.error("Failed to check publish status:", error);
    }
  }

  // YouTube functions
  async function connectYouTube() {
    window.location.href = "/api/social/youtube/connect";
  }

  async function disconnectYouTube() {
    if (!confirm("Are you sure you want to disconnect your YouTube account?")) {
      return;
    }

    try {
      const res = await fetch("/api/social/youtube/disconnect", {
        method: "POST",
      });

      if (res.ok) {
        setYoutubeConnected(false);
        setPublishStatus({ type: "success", message: "YouTube disconnected" });
      }
    } catch (error) {
      setPublishStatus({ type: "error", message: "Failed to disconnect YouTube" });
    }
  }

  async function publishToYouTube() {
    if (!episode.videoUrl) {
      setPublishStatus({
        type: "error",
        message: "No video URL found for this episode",
      });
      return;
    }

    setPublishing(prev => ({ ...prev, youtube: true }));
    setPublishStatus(null);
    setPublishDialog(null);

    try {
      const res = await fetch("/api/social/youtube/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId: episode._id,
          privacyStatus,
          videoUrl: episode.videoUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPublishStatus({
          type: "success",
          message: `Published to YouTube! Video ID: ${data.videoId}`,
        });
        setYoutubePost({
          postId: data.videoId,
          postUrl: data.videoUrl,
          status: "published",
        });
      } else {
        setPublishStatus({
          type: "error",
          message: data.error || "Failed to publish to YouTube",
        });
      }
    } catch (error) {
      setPublishStatus({
        type: "error",
        message: "Failed to publish to YouTube",
      });
    } finally {
      setPublishing(prev => ({ ...prev, youtube: false }));
    }
  }

  // TikTok functions
  async function connectTikTok() {
    window.location.href = "/api/social/tiktok/connect";
  }

  async function disconnectTikTok() {
    if (!confirm("Are you sure you want to disconnect your TikTok account?")) {
      return;
    }

    try {
      const res = await fetch("/api/social/tiktok/disconnect", {
        method: "POST",
      });

      if (res.ok) {
        setTiktokConnected(false);
        setPublishStatus({ type: "success", message: "TikTok disconnected" });
      }
    } catch (error) {
      setPublishStatus({ type: "error", message: "Failed to disconnect TikTok" });
    }
  }

  async function publishToTikTok() {
    if (!episode.videoUrl) {
      setPublishStatus({
        type: "error",
        message: "No video URL found for this episode",
      });
      return;
    }

    setPublishing(prev => ({ ...prev, tiktok: true }));
    setPublishStatus(null);
    setPublishDialog(null);

    try {
      const res = await fetch("/api/social/tiktok/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId: episode._id,
          privacyLevel: privacyStatus === "public" ? "PUBLIC_TO_EVERYONE" : "SELF_ONLY",
          videoUrl: episode.videoUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPublishStatus({
          type: "success",
          message: `Published to TikTok! ${data.status === "processing" ? "Video is processing..." : ""}`,
        });
        setTiktokPost({
          postId: data.publishId,
          postUrl: data.videoUrl,
          status: data.status,
        });
      } else {
        setPublishStatus({
          type: "error",
          message: data.error || "Failed to publish to TikTok",
        });
      }
    } catch (error) {
      setPublishStatus({
        type: "error",
        message: "Failed to publish to TikTok",
      });
    } finally {
      setPublishing(prev => ({ ...prev, tiktok: false }));
    }
  }

  // LinkedIn functions
  async function connectLinkedIn() {
    window.location.href = "/api/social/linkedin/connect";
  }

  async function disconnectLinkedIn() {
    if (!confirm("Are you sure you want to disconnect your LinkedIn account?")) {
      return;
    }

    try {
      const res = await fetch("/api/social/linkedin/disconnect", {
        method: "POST",
      });

      if (res.ok) {
        setLinkedinConnected(false);
        setPublishStatus({ type: "success", message: "LinkedIn disconnected" });
      }
    } catch (error) {
      setPublishStatus({ type: "error", message: "Failed to disconnect LinkedIn" });
    }
  }

  async function publishToLinkedIn() {
    if (!episode.videoUrl) {
      setPublishStatus({
        type: "error",
        message: "No video URL found for this episode",
      });
      return;
    }

    setPublishing(prev => ({ ...prev, linkedin: true }));
    setPublishStatus(null);
    setPublishDialog(null);

    try {
      const res = await fetch("/api/social/linkedin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId: episode._id,
          videoUrl: episode.videoUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPublishStatus({
          type: "success",
          message: "Published to LinkedIn!",
        });
        setLinkedinPost({
          postId: data.postId,
          postUrl: data.postUrl,
          status: "published",
        });
      } else {
        setPublishStatus({
          type: "error",
          message: data.error || "Failed to publish to LinkedIn",
        });
      }
    } catch (error) {
      setPublishStatus({
        type: "error",
        message: "Failed to publish to LinkedIn",
      });
    } finally {
      setPublishing(prev => ({ ...prev, linkedin: false }));
    }
  }

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#00684A", fontSize: "1.1rem" }}>
        Social Media Publishing
      </Typography>

      {publishStatus && (
        <Alert severity={publishStatus.type} sx={{ mb: 2 }}>
          {publishStatus.message}
        </Alert>
      )}

      {/* Horizontal Layout for Platforms */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: "flex-start" }}>
        {/* YouTube Section */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
            <YouTubeIcon sx={{ fontSize: 24, color: "#FF0000" }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
              YouTube
            </Typography>
            {youtubeConnected && (
              <Chip
                icon={<CheckCircleIcon />}
                label="Connected"
                color="success"
                size="small"
                sx={{ height: "20px", fontSize: "0.7rem" }}
              />
            )}
          </Stack>

          {!youtubeConnected ? (
            <Button
              variant="contained"
              startIcon={<LinkIcon />}
              onClick={connectYouTube}
              size="small"
              fullWidth
              sx={{
                backgroundColor: "#FF0000",
                "&:hover": { backgroundColor: "#CC0000" },
                fontSize: "0.875rem",
                py: 0.75,
              }}
            >
              Connect
            </Button>
          ) : (
            <Stack spacing={1}>
              {youtubePost ? (
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ py: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Published
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 0.25, display: "block", fontSize: "0.75rem" }}>
                    <a
                      href={youtubePost.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#00684A" }}
                    >
                      View →
                    </a>
                  </Typography>
                </Alert>
              ) : (
                <Stack direction="column" spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<PublishIcon />}
                    onClick={() => setPublishDialog('youtube')}
                    disabled={publishing.youtube || !episode.videoUrl}
                    size="small"
                    fullWidth
                    sx={{
                      backgroundColor: "#00684A",
                      "&:hover": { backgroundColor: "#004D37" },
                      fontSize: "0.875rem",
                      py: 0.75,
                    }}
                  >
                    {publishing.youtube ? "Publishing..." : "Publish"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<LinkOffIcon />}
                    onClick={disconnectYouTube}
                    size="small"
                    fullWidth
                    sx={{ borderColor: "#E63946", color: "#E63946", fontSize: "0.875rem", py: 0.75 }}
                  >
                    Disconnect
                  </Button>
                </Stack>
              )}

              {!episode.videoUrl && (
                <Alert severity="warning" sx={{ py: 0.5, fontSize: "0.75rem" }}>
                  <Typography variant="caption">No video URL</Typography>
                </Alert>
              )}
            </Stack>
          )}
        </Box>

        {/* Vertical Divider */}
        <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

        {/* LinkedIn Section */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
            <LinkedInIcon sx={{ fontSize: 24, color: "#0A66C2" }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
              LinkedIn
            </Typography>
            {linkedinConnected && (
              <Chip
                icon={<CheckCircleIcon />}
                label="Connected"
                color="success"
                size="small"
                sx={{ height: "20px", fontSize: "0.7rem" }}
              />
            )}
          </Stack>

          {!linkedinConnected ? (
            <Button
              variant="contained"
              startIcon={<LinkIcon />}
              onClick={connectLinkedIn}
              size="small"
              fullWidth
              sx={{
                backgroundColor: "#0A66C2",
                "&:hover": { backgroundColor: "#004182" },
                fontSize: "0.875rem",
                py: 0.75,
              }}
            >
              Connect
            </Button>
          ) : (
            <Stack spacing={1}>
              {linkedinPost ? (
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ py: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Published
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 0.25, display: "block", fontSize: "0.75rem" }}>
                    <a
                      href={linkedinPost.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#00684A" }}
                    >
                      View →
                    </a>
                  </Typography>
                </Alert>
              ) : (
                <Stack direction="column" spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<PublishIcon />}
                    onClick={() => setPublishDialog('linkedin')}
                    disabled={publishing.linkedin || !episode.videoUrl}
                    size="small"
                    fullWidth
                    sx={{
                      backgroundColor: "#00684A",
                      "&:hover": { backgroundColor: "#004D37" },
                      fontSize: "0.875rem",
                      py: 0.75,
                    }}
                  >
                    {publishing.linkedin ? "Publishing..." : "Publish"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<LinkOffIcon />}
                    onClick={disconnectLinkedIn}
                    size="small"
                    fullWidth
                    sx={{ borderColor: "#E63946", color: "#E63946", fontSize: "0.875rem", py: 0.75 }}
                  >
                    Disconnect
                  </Button>
                </Stack>
              )}

              {!episode.videoUrl && (
                <Alert severity="warning" sx={{ py: 0.5, fontSize: "0.75rem" }}>
                  <Typography variant="caption">No video URL</Typography>
                </Alert>
              )}
            </Stack>
          )}
        </Box>

        {/* Vertical Divider */}
        <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

        {/* TikTok Section */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
            <TikTokIcon sx={{ fontSize: 24, color: "#000000" }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
              TikTok
            </Typography>
            {tiktokConnected && (
              <Chip
                icon={<CheckCircleIcon />}
                label="Connected"
                color="success"
                size="small"
                sx={{ height: "20px", fontSize: "0.7rem" }}
              />
            )}
          </Stack>

          {!tiktokConnected ? (
            <Button
              variant="contained"
              startIcon={<LinkIcon />}
              onClick={connectTikTok}
              size="small"
              fullWidth
              sx={{
                backgroundColor: "#000000",
                "&:hover": { backgroundColor: "#333333" },
                fontSize: "0.875rem",
                py: 0.75,
              }}
            >
              Connect
            </Button>
          ) : (
            <Stack spacing={1}>
              {tiktokPost ? (
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ py: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Published {tiktokPost.status === "processing" && "(Processing)"}
                  </Typography>
                  {tiktokPost.postUrl && (
                    <Typography variant="caption" sx={{ mt: 0.25, display: "block", fontSize: "0.75rem" }}>
                      <a
                        href={tiktokPost.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#00684A" }}
                      >
                        View →
                      </a>
                    </Typography>
                  )}
                </Alert>
              ) : (
                <Stack direction="column" spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<PublishIcon />}
                    onClick={() => setPublishDialog('tiktok')}
                    disabled={publishing.tiktok || !episode.videoUrl}
                    size="small"
                    fullWidth
                    sx={{
                      backgroundColor: "#00684A",
                      "&:hover": { backgroundColor: "#004D37" },
                      fontSize: "0.875rem",
                      py: 0.75,
                    }}
                  >
                    {publishing.tiktok ? "Publishing..." : "Publish"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<LinkOffIcon />}
                    onClick={disconnectTikTok}
                    size="small"
                    fullWidth
                    sx={{ borderColor: "#E63946", color: "#E63946", fontSize: "0.875rem", py: 0.75 }}
                  >
                    Disconnect
                  </Button>
                </Stack>
              )}

              {!episode.videoUrl && (
                <Alert severity="warning" sx={{ py: 0.5, fontSize: "0.75rem" }}>
                  <Typography variant="caption">No video URL</Typography>
                </Alert>
              )}
            </Stack>
          )}
        </Box>
      </Stack>

      {/* YouTube Publish Dialog */}
      <Dialog open={publishDialog === 'youtube'} onClose={() => setPublishDialog(null)}>
        <DialogTitle>Publish to YouTube</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Choose the privacy status for your YouTube video:
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Privacy Status</InputLabel>
            <Select
              value={privacyStatus}
              label="Privacy Status"
              onChange={(e) => setPrivacyStatus(e.target.value)}
            >
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="unlisted">Unlisted</MenuItem>
              <MenuItem value="public">Public</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
            <strong>Private:</strong> Only you can see the video
            <br />
            <strong>Unlisted:</strong> Anyone with the link can see the video
            <br />
            <strong>Public:</strong> Anyone can find and view the video
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialog(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={publishToYouTube}
            sx={{
              backgroundColor: "#00684A",
              "&:hover": { backgroundColor: "#004D37" },
            }}
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>

      {/* LinkedIn Publish Dialog */}
      <Dialog open={publishDialog === 'linkedin'} onClose={() => setPublishDialog(null)}>
        <DialogTitle>Publish to LinkedIn</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This will publish your video to your LinkedIn feed with a public visibility.
          </Typography>
          <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
            The video will be shared with your LinkedIn network and include the episode title, description, and relevant hashtags.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialog(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={publishToLinkedIn}
            sx={{
              backgroundColor: "#00684A",
              "&:hover": { backgroundColor: "#004D37" },
            }}
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>

      {/* TikTok Publish Dialog */}
      <Dialog open={publishDialog === 'tiktok'} onClose={() => setPublishDialog(null)}>
        <DialogTitle>Publish to TikTok</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Choose the privacy level for your TikTok video:
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Privacy Level</InputLabel>
            <Select
              value={privacyStatus}
              label="Privacy Level"
              onChange={(e) => setPrivacyStatus(e.target.value)}
            >
              <MenuItem value="private">Private (Self Only)</MenuItem>
              <MenuItem value="public">Public</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
            <strong>Private:</strong> Only you can see the video
            <br />
            <strong>Public:</strong> Everyone can discover and watch your video
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialog(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={publishToTikTok}
            sx={{
              backgroundColor: "#00684A",
              "&:hover": { backgroundColor: "#004D37" },
            }}
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
