"use client";

import { Typography, Box, Button } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EpisodeForm from "@/components/EpisodeForm";

export default function NewEpisodePage() {
  const router = useRouter();

  async function handleSubmit(formData) {
    const res = await fetch("/api/episodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/admin/episodes");
    }
  }

  return (
    <Box>
      <Link href="/admin/episodes" style={{ textDecoration: "none" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ 
            mb: 3,
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          Back to Episodes
        </Button>
      </Link>

      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: "2rem", md: "2.75rem" },
          }}
        >
          Create New Episode
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Start crafting your 60-second MongoDB tip
        </Typography>
      </Box>

      <EpisodeForm onSubmit={handleSubmit} submitLabel="Create Episode" />
    </Box>
  );
}
