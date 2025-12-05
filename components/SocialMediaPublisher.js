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
} from "@mui/icons-material";

export default function SocialMediaPublisher({ episode }) {
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  const [tiktokConnected, setTiktokConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState({ youtube: false, tiktok: false });
  const [publishStatus, setPublishStatus] = useState(null);
  const [youtubePost, setYoutubePost] = useState(null);
  const [tiktokPost, setTiktokPost] = useState(null);
  const [publishDialog, setPublishDialog] = useState(null); // null, 'youtube', or 'tiktok'
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

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "#00684A" }}>
        Social Media Publishing
      </Typography>

      {publishStatus && (
        <Alert severity={publishStatus.type} sx={{ mb: 3 }}>
          {publishStatus.message}
        </Alert>
      )}

      {/* YouTube Section */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <YouTubeIcon sx={{ fontSize: 32, color: "#FF0000" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            YouTube
          </Typography>
          {youtubeConnected && (
            <Chip
              icon={<CheckCircleIcon />}
              label="Connected"
              color="success"
              size="small"
            />
          )}
        </Stack>

        {!youtubeConnected ? (
          <Button
            variant="contained"
            startIcon={<LinkIcon />}
            onClick={connectYouTube}
            sx={{
              backgroundColor: "#FF0000",
              "&:hover": { backgroundColor: "#CC0000" },
            }}
          >
            Connect YouTube
          </Button>
        ) : (
          <Stack spacing={2}>
            {youtubePost ? (
              <Alert severity="success" icon={<CheckCircleIcon />}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Published to YouTube
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  <a
                    href={youtubePost.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#00684A" }}
                  >
                    View on YouTube →
                  </a>
                </Typography>
              </Alert>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<PublishIcon />}
                  onClick={() => setPublishDialog('youtube')}
                  disabled={publishing.youtube || !episode.videoUrl}
                  sx={{
                    backgroundColor: "#00684A",
                    "&:hover": { backgroundColor: "#004D37" },
                  }}
                >
                  {publishing.youtube ? "Publishing..." : "Publish to YouTube"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LinkOffIcon />}
                  onClick={disconnectYouTube}
                  sx={{ borderColor: "#E63946", color: "#E63946" }}
                >
                  Disconnect
                </Button>
              </Stack>
            )}

            {!episode.videoUrl && (
              <Alert severity="warning">
                No video URL found. Please add a video URL to this episode before
                publishing.
              </Alert>
            )}
          </Stack>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* TikTok Section */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <TikTokIcon sx={{ fontSize: 32, color: "#000000" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            TikTok
          </Typography>
          {tiktokConnected && (
            <Chip
              icon={<CheckCircleIcon />}
              label="Connected"
              color="success"
              size="small"
            />
          )}
        </Stack>

        {!tiktokConnected ? (
          <Button
            variant="contained"
            startIcon={<LinkIcon />}
            onClick={connectTikTok}
            sx={{
              backgroundColor: "#000000",
              "&:hover": { backgroundColor: "#333333" },
            }}
          >
            Connect TikTok
          </Button>
        ) : (
          <Stack spacing={2}>
            {tiktokPost ? (
              <Alert severity="success" icon={<CheckCircleIcon />}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Published to TikTok {tiktokPost.status === "processing" && "(Processing)"}
                </Typography>
                {tiktokPost.postUrl && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    <a
                      href={tiktokPost.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#00684A" }}
                    >
                      View on TikTok →
                    </a>
                  </Typography>
                )}
              </Alert>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<PublishIcon />}
                  onClick={() => setPublishDialog('tiktok')}
                  disabled={publishing.tiktok || !episode.videoUrl}
                  sx={{
                    backgroundColor: "#00684A",
                    "&:hover": { backgroundColor: "#004D37" },
                  }}
                >
                  {publishing.tiktok ? "Publishing..." : "Publish to TikTok"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LinkOffIcon />}
                  onClick={disconnectTikTok}
                  sx={{ borderColor: "#E63946", color: "#E63946" }}
                >
                  Disconnect
                </Button>
              </Stack>
            )}

            {!episode.videoUrl && (
              <Alert severity="warning">
                No video URL found. Please add a video URL to this episode before
                publishing.
              </Alert>
            )}
          </Stack>
        )}
      </Box>

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
