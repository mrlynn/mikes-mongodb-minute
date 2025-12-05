"use client";

import { useEffect, useState } from "react";
import { Typography, Paper, Stack, Box, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Add as AddIcon, List as ListIcon, AutoAwesome as AIIcon, RateReview as ReviewIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import AIGenerateDialog from "@/components/AIGenerateDialog";
import AdminTour from "@/components/AdminTour";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    readyToRecord: 0,
    recorded: 0,
    published: 0,
    workflowDraft: 0,
    workflowReview: 0,
    workflowApproved: 0,
  });
  const [reviewQueue, setReviewQueue] = useState([]);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/episodes");
      const episodes = await res.json();

      // Filter episodes in review
      const episodesNeedingReview = episodes.filter(
        ep => ep.workflow && ep.workflow.currentStage === "tech-review"
      );

      setStats({
        total: episodes.length,
        draft: episodes.filter(ep => ep.status === "draft").length,
        readyToRecord: episodes.filter(ep => ep.status === "ready-to-record").length,
        recorded: episodes.filter(ep => ep.status === "recorded").length,
        published: episodes.filter(ep => ep.status === "published").length,
        workflowDraft: episodes.filter(ep => ep.workflow && ep.workflow.currentStage === "draft").length,
        workflowReview: episodesNeedingReview.length,
        workflowApproved: episodes.filter(ep => ep.workflow && ep.workflow.currentStage === "approved").length,
      });

      setReviewQueue(episodesNeedingReview.slice(0, 5)); // Show top 5
    }

    fetchStats();
  }, []);

  async function handleAIGenerate(generatedEpisode) {
    // Save the AI-generated episode as a draft
    const res = await fetch("/api/episodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(generatedEpisode),
    });

    if (res.ok) {
      const savedEpisode = await res.json();
      // Navigate to edit page to review and refine
      router.push(`/admin/episodes/${savedEpisode._id}`);
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            mb: 1,
            fontSize: { xs: "2rem", md: "2.75rem" },
          }}
        >
          Admin Dashboard
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 400, color: "#5F6C76" }}>
          Manage your MongoDB Minute episodes
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Box
        sx={{
          mb: 5,
          p: 3,
          borderRadius: 3,
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
        data-tour="quick-actions"
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Quick Actions
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<AIIcon />}
            size="large"
            onClick={() => setAiDialogOpen(true)}
            sx={{
              fontWeight: 600,
              px: 4,
              background: "linear-gradient(135deg, #00684A 0%, #004D37 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #00ED64 0%, #00684A 100%)",
              },
            }}
          >
            AI Generate Episode
          </Button>
          {stats.workflowReview > 0 && (
            <Button
              variant="contained"
              startIcon={<ReviewIcon />}
              size="large"
              onClick={() => {
                document.getElementById('review-queue')?.scrollIntoView({ behavior: 'smooth' });
              }}
              sx={{
                fontWeight: 600,
                px: 4,
                background: "linear-gradient(135deg, #00684A 0%, #004D37 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #00ED64 0%, #00684A 100%)",
                },
                position: "relative",
                "&::after": {
                  content: `"${stats.workflowReview}"`,
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: "#E63946",
                  color: "#FFFFFF",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                },
              }}
            >
              Review Queue
            </Button>
          )}
          <Link href="/admin/episodes/new" style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              size="large"
              sx={{
                fontWeight: 600,
                px: 4,
              }}
            >
              Create Manually
            </Button>
          </Link>
          <Link href="/admin/episodes" style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              startIcon={<ListIcon />}
              size="large"
              sx={{
                fontWeight: 600,
                px: 4,
              }}
            >
              View All Episodes
            </Button>
          </Link>
        </Stack>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} data-tour="statistics">
        <Grid item xs={6} sm={4} md={2.4}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: "center",
              borderRadius: 3,
              background: "linear-gradient(135deg, rgba(0, 104, 74, 0.1) 0%, rgba(0, 104, 74, 0.05) 100%)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "#00684A" }}>
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Total Episodes
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: "center",
              borderRadius: 3,
              backgroundColor: "warning.light",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h3" color="warning.dark" sx={{ fontWeight: 700, mb: 1 }}>
              {stats.draft}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Draft
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: "center",
              borderRadius: 3,
              backgroundColor: "info.light",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h3" color="info.dark" sx={{ fontWeight: 700, mb: 1 }}>
              {stats.readyToRecord}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Ready to Record
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: "center",
              borderRadius: 3,
              backgroundColor: "grey.200",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h3" color="text.secondary" sx={{ fontWeight: 700, mb: 1 }}>
              {stats.recorded}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Recorded
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: "center",
              borderRadius: 3,
              background: "linear-gradient(135deg, rgba(0, 237, 100, 0.1) 0%, rgba(0, 237, 100, 0.05) 100%)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "#00ED64" }}>
              {stats.published}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Published
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Workflow Stats */}
      <Box sx={{ mt: 5 }} data-tour="workflow-stats">
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Workflow Status
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                background: "linear-gradient(135deg, rgba(95, 108, 118, 0.1) 0%, rgba(95, 108, 118, 0.05) 100%)",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "#5F6C76" }}>
                {stats.workflowDraft}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Draft Stage
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                background: "linear-gradient(135deg, rgba(0, 237, 100, 0.1) 0%, rgba(0, 237, 100, 0.05) 100%)",
                border: "2px solid",
                borderColor: stats.workflowReview > 0 ? "#00ED64" : "divider",
                position: "relative",
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "#00ED64" }}>
                {stats.workflowReview}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                In Review
              </Typography>
              {stats.workflowReview > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#E63946",
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 1, transform: "scale(1)" },
                      "50%": { opacity: 0.5, transform: "scale(1.2)" },
                    },
                  }}
                />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                background: "linear-gradient(135deg, rgba(0, 104, 74, 0.1) 0%, rgba(0, 104, 74, 0.05) 100%)",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "#00684A" }}>
                {stats.workflowApproved}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Approved
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Review Queue */}
      {reviewQueue.length > 0 && (
        <Box id="review-queue" sx={{ mt: 5 }} data-tour="review-queue">
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Review Queue
            </Typography>
            <Chip
              label={`${stats.workflowReview} pending`}
              sx={{
                backgroundColor: "#00684A",
                color: "#FFFFFF",
                fontWeight: 600,
              }}
            />
          </Stack>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F7FAFC" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Episode</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Submitted By</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Submitted At</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviewQueue.map((episode) => (
                  <TableRow
                    key={episode._id}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                    onClick={() => router.push(`/admin/episodes/${episode._id}`)}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {episode.episodeNumber && `#${episode.episodeNumber} - `}{episode.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {episode.hook?.substring(0, 80)}...
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={episode.category}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.6875rem",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {episode.workflow?.submittedForReview?.name || "Unknown"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {episode.workflow?.submittedForReview?.timestamp &&
                          new Date(episode.workflow.submittedForReview.timestamp).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ReviewIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/episodes/${episode._id}`);
                        }}
                        sx={{
                          fontWeight: 600,
                          background: "linear-gradient(135deg, #00684A 0%, #004D37 100%)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #00ED64 0%, #00684A 100%)",
                          },
                        }}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {stats.workflowReview > 5 && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Showing 5 of {stats.workflowReview} episodes pending review
              </Typography>
            </Box>
          )}
        </Box>
      )}

      <AIGenerateDialog
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        onGenerate={handleAIGenerate}
      />

      {/* Onboarding Tour */}
      <AdminTour />
    </Box>
  );
}
