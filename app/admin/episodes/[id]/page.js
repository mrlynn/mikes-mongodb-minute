"use client";

import { useEffect, useState, use } from "react";
import { Typography, Box, Button, CircularProgress, Stack } from "@mui/material";
import { ArrowBack as ArrowBackIcon, Videocam as VideocamIcon } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EpisodeForm from "@/components/EpisodeForm";

export default function EditEpisodePage({ params }) {
  const resolvedParams = use(params);
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
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
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Link href="/admin/episodes" style={{ textDecoration: "none" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            Back to Episodes
          </Button>
        </Link>

        <Button
          variant="contained"
          startIcon={<VideocamIcon />}
          onClick={() => router.push(`/admin/teleprompter/${resolvedParams.id}`)}
          sx={{
            fontWeight: 600,
            background: "linear-gradient(135deg, #10A84F 0%, #0D8A3F 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #0D8A3F 0%, #0A6D32 100%)",
            },
          }}
        >
          Teleprompter Mode
        </Button>
      </Stack>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: "2rem", md: "2.75rem" },
          }}
        >
          Edit Episode
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {episode.episodeNumber && `Episode #${episode.episodeNumber}`} {episode.title}
        </Typography>
      </Box>

      <EpisodeForm initialData={episode} onSubmit={handleSubmit} submitLabel="Update Episode" />
    </Box>
  );
}
