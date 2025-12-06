"use client";

import { useEffect, useState, use } from "react";
import { Typography, Box, Button, CircularProgress, Stack, Grid, Tabs, Tab } from "@mui/material";
import { ArrowBack as ArrowBackIcon, Videocam as VideocamIcon, FiberManualRecord as RecordIcon, Edit as EditIcon, Image as ImageIcon } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EpisodeForm from "@/components/EpisodeForm";
import WorkflowStatus from "@/components/WorkflowStatus";
import SocialMediaPublisher from "@/components/SocialMediaPublisher";
import ThumbnailEditor from "@/components/ThumbnailEditor";

export default function EditEpisodePage({ params }) {
  const resolvedParams = use(params);
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchEpisode();
  }, []);

  async function fetchEpisode() {
    const res = await fetch(`/api/episodes/${resolvedParams.id}`);
    if (res.ok) {
      const data = await res.json();
      setEpisode(data);
    }
    setLoading(false);
  }

  async function handleSubmit(formData) {
    const res = await fetch(`/api/episodes/${resolvedParams.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/admin/episodes");
    }
  }

  function handleWorkflowUpdate(updatedEpisode) {
    setEpisode(updatedEpisode);
  }

  function handleThumbnailSaved(thumbnailData) {
    // Refresh episode data to get updated thumbnail
    fetchEpisode();
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!episode) {
    return <Typography>Episode not found</Typography>;
  }

  return (
    <Box sx={{ px: { xs: 0, sm: 0 } }}>
      <Stack 
        direction={{ xs: "column", sm: "row" }} 
        justifyContent="space-between" 
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={{ xs: 2, sm: 0 }}
        sx={{ mb: { xs: 2, md: 3 } }}
      >
        <Link href="/admin/episodes" style={{ textDecoration: "none" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "action.hover",
              },
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
          >
            Back to Episodes
          </Button>
        </Link>

        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={{ xs: 1.5, sm: 2 }}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            variant="contained"
            startIcon={<VideocamIcon />}
            onClick={() => router.push(`/admin/teleprompter/${resolvedParams.id}`)}
            fullWidth={false}
            sx={{
              fontWeight: 600,
              background: "linear-gradient(135deg, #00684A 0%, #004D37 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #00ED64 0%, #00684A 100%)",
              },
              fontSize: { xs: "0.875rem", md: "1rem" },
              px: { xs: 2, md: 3 },
              py: { xs: 1, md: 1.5 },
            }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Teleprompter Mode
            </Box>
            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
              Teleprompter
            </Box>
          </Button>

          <Button
            variant="contained"
            startIcon={<RecordIcon />}
            onClick={() => router.push(`/admin/recorder/${resolvedParams.id}`)}
            fullWidth={false}
            sx={{
              fontWeight: 600,
              background: "linear-gradient(135deg, #E63946 0%, #D62828 100%)",
              color: "#FFF",
              "&:hover": {
                background: "linear-gradient(135deg, #F77F00 0%, #E63946 100%)",
              },
              fontSize: { xs: "0.875rem", md: "1rem" },
              px: { xs: 2, md: 3 },
              py: { xs: 1, md: 1.5 },
            }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Record with Teleprompter
            </Box>
            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
              Record
            </Box>
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.75rem" },
          }}
        >
          Edit Episode
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            fontSize: { xs: "0.875rem", md: "1rem" },
            wordBreak: "break-word",
          }}
        >
          {episode.episodeNumber && `Episode #${episode.episodeNumber}`} {episode.title}
        </Typography>
      </Box>

      <Box>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab icon={<EditIcon />} iconPosition="start" label="Details" />
            <Tab icon={<ImageIcon />} iconPosition="start" label="Thumbnail" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <>
            <EpisodeForm initialData={episode} onSubmit={handleSubmit} submitLabel="Update Episode" />
            <Box sx={{ mt: { xs: 2, md: 3 } }}>
              <WorkflowStatus episode={episode} onWorkflowUpdate={handleWorkflowUpdate} />
            </Box>
            <Box sx={{ mt: { xs: 2, md: 3 } }}>
              <SocialMediaPublisher episode={episode} />
            </Box>
          </>
        )}

        {activeTab === 1 && (
          <ThumbnailEditor
            episodeId={resolvedParams.id}
            episode={episode}
            onThumbnailSaved={handleThumbnailSaved}
          />
        )}
      </Box>
    </Box>
  );
}
