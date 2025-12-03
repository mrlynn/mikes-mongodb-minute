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
          background: "linear-gradient(135deg, #10A84F 0%, #0A7A3A 100%)",
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          mb: 6,
          color: "white",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Chip 
              label={`${episodeCounts.all} Episodes`} 
              sx={{ 
                backgroundColor: "rgba(255,255,255,0.2)", 
                color: "white",
                fontWeight: 600,
              }} 
            />
            <Chip 
              icon={<PlayArrowIcon sx={{ color: "white !important" }} />}
              label="60-Second Tips" 
              sx={{ 
                backgroundColor: "rgba(255,255,255,0.2)", 
                color: "white",
                fontWeight: 600,
              }} 
            />
          </Stack>
          
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
              lineHeight: 1.2,
            }}
          >
            Learn MongoDB in 60 Seconds
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              opacity: 0.95,
              fontSize: { xs: "1rem", md: "1.25rem" },
              fontWeight: 400,
              maxWidth: "600px",
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
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
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
              color={selectedCategory === null ? "primary" : "default"}
              sx={{ fontWeight: selectedCategory === null ? 600 : 400 }}
            />
            {availableCategories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() =>
                  setSelectedCategory(selectedCategory === category ? null : category)
                }
                color={selectedCategory === category ? "primary" : "default"}
                sx={{ fontWeight: selectedCategory === category ? 600 : 400 }}
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
              color={selectedDifficulty === null ? "primary" : "default"}
              sx={{ fontWeight: selectedDifficulty === null ? 600 : 400 }}
            />
            {availableDifficulties.map((difficulty) => (
              <Chip
                key={difficulty}
                label={difficulty}
                onClick={() =>
                  setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)
                }
                color={selectedDifficulty === difficulty ? "primary" : "default"}
                sx={{ fontWeight: selectedDifficulty === difficulty ? 600 : 400 }}
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
            fontWeight: 700, 
            mb: 1,
            fontSize: { xs: "1.75rem", md: "2.125rem" },
          }}
        >
          Episodes {filteredEpisodes.length > 0 && `(${filteredEpisodes.length})`}
        </Typography>
        {(searchQuery || selectedCategory || selectedDifficulty || statusTab > 0) && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Showing filtered results
          </Typography>
        )}
      </Box>

      {filteredEpisodes.length > 0 ? (
        <Grid container spacing={3}>
          {filteredEpisodes.map((ep) => (
            <Grid item xs={12} sm={6} md={4} key={ep._id}>
              <EpisodeCard episode={ep} />
            </Grid>
          ))}
        </Grid>
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
