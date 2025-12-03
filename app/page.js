"use client";

import { useState, useEffect, useMemo } from "react";
import EpisodeCard from "@/components/EpisodeCard";
import {
  Typography,
  Grid,
  Box,
  Button,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

export default function HomePage() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [statusTab, setStatusTab] = useState(0); // 0 = all, 1 = published, 2 = draft, etc.

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const res = await fetch("/api/episodes");
        const data = await res.json();
        setEpisodes(data);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEpisodes();
  }, []);

  // Filter episodes based on search and filters
  const filteredEpisodes = useMemo(() => {
    let filtered = [...episodes];

    // Filter by status tab
    if (statusTab === 1) {
      filtered = filtered.filter((ep) => ep.status === "published");
    } else if (statusTab === 2) {
      filtered = filtered.filter((ep) => ep.status === "draft");
    } else if (statusTab === 3) {
      filtered = filtered.filter((ep) => ep.status === "ready-to-record");
    } else if (statusTab === 4) {
      filtered = filtered.filter((ep) => ep.status === "recorded");
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((ep) => ep.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      filtered = filtered.filter((ep) => ep.difficulty === selectedDifficulty);
    }


    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((ep) => {
        const searchableText = [
          ep.title,
          ep.hook,
          ep.problem,
          ep.tip,
          ep.quickWin,
          ep.cta,
          ep.category,
          ep.difficulty,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchableText.includes(query);
      });
    }

    // Sort by episode number (descending for newest first, then by date)
    return filtered.sort((a, b) => {
      if (a.episodeNumber && b.episodeNumber) {
        return b.episodeNumber - a.episodeNumber;
      }
      if (a.episodeNumber) return -1;
      if (b.episodeNumber) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [episodes, searchQuery, selectedCategory, selectedDifficulty, statusTab]);

  // Get unique categories and difficulties from episodes
  const availableCategories = useMemo(() => {
    return [...new Set(episodes.map((ep) => ep.category).filter(Boolean))].sort();
  }, [episodes]);

  const availableDifficulties = useMemo(() => {
    return [...new Set(episodes.map((ep) => ep.difficulty).filter(Boolean))].sort();
  }, [episodes]);

  // Count episodes by status
  const episodeCounts = useMemo(() => {
    return {
      all: episodes.length,
      published: episodes.filter((ep) => ep.status === "published").length,
      draft: episodes.filter((ep) => ep.status === "draft").length,
      "ready-to-record": episodes.filter((ep) => ep.status === "ready-to-record").length,
      recorded: episodes.filter((ep) => ep.status === "recorded").length,
    };
  }, [episodes]);

  const handleStatusTabChange = (event, newValue) => {
    setStatusTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: "#FFFFFF",
          borderRadius: 8,
          p: { xs: 4, md: 5 },
          mb: 4,
          border: "1px solid #E2E8F0",
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.04)",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Chip 
              label={`${episodeCounts.all} Episodes`} 
              size="small"
              sx={{ 
                backgroundColor: "#EDF2F7", 
                color: "#001E2B",
                fontWeight: 500,
                fontSize: "0.75rem",
                height: "24px",
              }} 
            />
            <Chip 
              icon={<PlayArrowIcon sx={{ color: "#00684A !important", fontSize: "16px !important" }} />}
              label="60-Second Tips" 
              size="small"
              sx={{ 
                backgroundColor: "#EDF2F7", 
                color: "#001E2B",
                fontWeight: 500,
                fontSize: "0.75rem",
                height: "24px",
              }} 
            />
          </Stack>
          
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 600, 
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              lineHeight: 1.3,
              color: "#001E2B",
            }}
          >
            Learn MongoDB in 60 Seconds
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 0, 
              fontSize: { xs: "0.9375rem", md: "1rem" },
              fontWeight: 400,
              maxWidth: "600px",
              color: "#5F6C76",
              lineHeight: 1.6,
            }}
          >
            Quick, practical tips on data modeling, indexing, Atlas features, Vector Search, and more. 
            Perfect for developers of all levels who want to master MongoDB efficiently.
          </Typography>
        </Box>
      </Box>

      {/* Search and Filter Section */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 8,
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search episodes by title, content, category, or difficulty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* Status Tabs */}
        <Box sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={statusTab}
            onChange={handleStatusTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={`All (${episodeCounts.all})`} />
            <Tab label={`Published (${episodeCounts.published})`} />
            <Tab label={`Draft (${episodeCounts.draft})`} />
            <Tab label={`Ready (${episodeCounts["ready-to-record"]})`} />
            <Tab label={`Recorded (${episodeCounts.recorded})`} />
          </Tabs>
        </Box>

        {/* Category Filters */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
            Category
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            <Chip
              label="All Categories"
              onClick={() => setSelectedCategory(null)}
              size="small"
              sx={{ 
                fontWeight: selectedCategory === null ? 500 : 400,
                backgroundColor: selectedCategory === null ? "#00684A" : "#EDF2F7",
                color: selectedCategory === null ? "#FFFFFF" : "#001E2B",
                fontSize: "0.75rem",
                height: "24px",
                "&:hover": {
                  backgroundColor: selectedCategory === null ? "#004D37" : "#CBD5E0",
                },
              }}
            />
            {availableCategories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() =>
                  setSelectedCategory(selectedCategory === category ? null : category)
                }
                size="small"
                sx={{ 
                  fontWeight: selectedCategory === category ? 500 : 400,
                  backgroundColor: selectedCategory === category ? "#00684A" : "#EDF2F7",
                  color: selectedCategory === category ? "#FFFFFF" : "#001E2B",
                  fontSize: "0.75rem",
                  height: "24px",
                  "&:hover": {
                    backgroundColor: selectedCategory === category ? "#004D37" : "#CBD5E0",
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Difficulty Filters */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
            Difficulty
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            <Chip
              label="All Levels"
              onClick={() => setSelectedDifficulty(null)}
              size="small"
              sx={{ 
                fontWeight: selectedDifficulty === null ? 500 : 400,
                backgroundColor: selectedDifficulty === null ? "#00684A" : "#EDF2F7",
                color: selectedDifficulty === null ? "#FFFFFF" : "#001E2B",
                fontSize: "0.75rem",
                height: "24px",
                "&:hover": {
                  backgroundColor: selectedDifficulty === null ? "#004D37" : "#CBD5E0",
                },
              }}
            />
            {availableDifficulties.map((difficulty) => (
              <Chip
                key={difficulty}
                label={difficulty}
                onClick={() =>
                  setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)
                }
                size="small"
                sx={{ 
                  fontWeight: selectedDifficulty === difficulty ? 500 : 400,
                  backgroundColor: selectedDifficulty === difficulty ? "#00684A" : "#EDF2F7",
                  color: selectedDifficulty === difficulty ? "#FFFFFF" : "#001E2B",
                  fontSize: "0.75rem",
                  height: "24px",
                  "&:hover": {
                    backgroundColor: selectedDifficulty === difficulty ? "#004D37" : "#CBD5E0",
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
      </Paper>

      {/* Results Section */}
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600, 
            mb: 1,
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            color: "#001E2B",
          }}
        >
          Episodes {filteredEpisodes.length > 0 && `(${filteredEpisodes.length})`}
        </Typography>
        {(searchQuery || selectedCategory || selectedDifficulty || statusTab > 0) && (
          <Typography variant="body2" sx={{ mb: 4, color: "#5F6C76", fontSize: "0.875rem" }}>
            Showing filtered results
          </Typography>
        )}
      </Box>

      {filteredEpisodes.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
            gridAutoRows: "1fr",
          }}
        >
          {filteredEpisodes.map((ep) => (
            <Box key={ep._id}>
              <EpisodeCard episode={ep} />
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
            borderRadius: 3,
            backgroundColor: "background.paper",
            border: "2px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No episodes found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery || selectedCategory || selectedDifficulty
              ? "Try adjusting your search or filters"
              : "Check back soon for new MongoDB tips!"}
          </Typography>
        </Box>
      )}
    </>
  );
}
