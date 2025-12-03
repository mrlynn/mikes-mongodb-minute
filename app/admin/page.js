"use client";

import { useEffect, useState } from "react";
import { Typography, Paper, Stack, Box, Grid, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Add as AddIcon, List as ListIcon, AutoAwesome as AIIcon } from "@mui/icons-material";
import AIGenerateDialog from "@/components/AIGenerateDialog";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    readyToRecord: 0,
    recorded: 0,
    published: 0,
  });
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/episodes");
      const episodes = await res.json();

      setStats({
        total: episodes.length,
        draft: episodes.filter(ep => ep.status === "draft").length,
        readyToRecord: episodes.filter(ep => ep.status === "ready-to-record").length,
        recorded: episodes.filter(ep => ep.status === "recorded").length,
        published: episodes.filter(ep => ep.status === "published").length,
      });
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
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
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
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Quick Actions
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button
            variant="contained"
            startIcon={<AIIcon />}
            size="large"
            onClick={() => setAiDialogOpen(true)}
            sx={{
              fontWeight: 600,
              px: 4,
              background: "linear-gradient(135deg, #10A84F 0%, #0D8A3F 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #0D8A3F 0%, #0A6D32 100%)",
              },
            }}
          >
            AI Generate Episode
          </Button>
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
      <Grid container spacing={3}>
        <Grid item xs={6} sm={4} md={2.4}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: "center",
              borderRadius: 3,
              background: "linear-gradient(135deg, rgba(16, 168, 79, 0.1) 0%, rgba(16, 168, 79, 0.05) 100%)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
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
              background: "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h3" color="success.dark" sx={{ fontWeight: 700, mb: 1 }}>
              {stats.published}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Published
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <AIGenerateDialog
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        onGenerate={handleAIGenerate}
      />
    </Box>
  );
}
