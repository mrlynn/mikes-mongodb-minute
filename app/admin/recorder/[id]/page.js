"use client";

import { useEffect, useState, use } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import TeleprompterRecorder from "@/components/recorder/TeleprompterRecorder";

export default function RecorderWithEpisodePage({ params }) {
  const resolvedParams = use(params);
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEpisode();
  }, []);

  async function fetchEpisode() {
    try {
      const res = await fetch(`/api/episodes/${resolvedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        setEpisode(data);
      }
    } catch (error) {
      console.error("Failed to fetch episode:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#00ED64" }} />
      </Box>
    );
  }

  if (!episode) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography>Episode not found</Typography>
      </Box>
    );
  }

  // Build full script from episode sections
  const fullScript = [
    `[Hook (0-5s)]\n${episode.hook || ""}`,
    `\n\n[Problem (5-15s)]\n${episode.problem || ""}`,
    `\n\n[Tip (15-45s)]\n${episode.tip || ""}`,
    `\n\n[Quick Win (45-52s)]\n${episode.quickWin || ""}`,
    `\n\n[CTA (52-60s)]\n${episode.cta || ""}`,
  ].join("");

  return <TeleprompterRecorder initialScript={fullScript} episodeId={resolvedParams.id} />;
}
