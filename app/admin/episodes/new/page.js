"use client";

import { useState } from "react";
import { Typography, Box, Button, Stack } from "@mui/material";
import { ArrowBack as ArrowBackIcon, AutoAwesome as TemplateIcon } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EpisodeForm from "@/components/EpisodeForm";
import EpisodeTemplateSelector from "@/components/EpisodeTemplateSelector";

export default function NewEpisodePage() {
  const router = useRouter();
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateData, setTemplateData] = useState(null);

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

  function handleTemplateSelect(template) {
    setTemplateData({
      hook: template.hook,
      problem: template.problem,
      tip: template.tip,
      quickWin: template.quickWin,
      cta: template.cta,
      visualSuggestion: template.visualSuggestion,
      category: template.category,
      difficulty: template.difficulty,
    });
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

      <Box sx={{ mb: { xs: 3, md: 4 }, px: { xs: 0, sm: 0 } }}>
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          justifyContent="space-between" 
          alignItems={{ xs: "flex-start", sm: "flex-end" }}
          spacing={{ xs: 2, sm: 0 }}
        >
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.75rem" },
              }}
            >
              Create New Episode
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
            >
              Start crafting your 60-second MongoDB tip
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<TemplateIcon />}
            onClick={() => setTemplateDialogOpen(true)}
            size="small"
            sx={{
              borderColor: "#00684A",
              color: "#00684A",
              "&:hover": {
                borderColor: "#004D37",
                backgroundColor: "#E6F7F0",
              },
              fontWeight: 600,
              width: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
          >
            Use Template
          </Button>
        </Stack>
      </Box>

      <EpisodeForm 
        onSubmit={handleSubmit} 
        submitLabel="Create Episode"
        initialData={templateData || {}}
      />

      <EpisodeTemplateSelector
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    </Box>
  );
}
