"use client";

import { useEffect, useState, use } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Teleprompter from "@/components/Teleprompter";

export default function TeleprompterPage({ params }) {
  const resolvedParams = use(params);
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  function handleClose() {
    router.push(`/admin/episodes/${resolvedParams.id}`);
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#000",
        }}
      >
        <CircularProgress />
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
          backgroundColor: "#000",
        }}
      >
        <Typography sx={{ color: "#fff" }}>Episode not found</Typography>
      </Box>
    );
  }

  return <Teleprompter episode={episode} onClose={handleClose} />;
}
