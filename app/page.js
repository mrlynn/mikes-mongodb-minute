"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import EpisodeCard from "@/components/EpisodeCard";
import EpisodeCardSkeleton from "@/components/EpisodeCardSkeleton";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import PublicTour from "@/components/PublicTour";
import HomepageFeedbackWidget from "@/components/HomepageFeedbackWidget";
import { toast } from "@/components/Toast";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Typography,
  Box,
  Button,
  Stack,
  Chip,
  Paper,
  CircularProgress,
  Fade,
  Zoom,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";

export default function HomePage() {
  const { darkMode } = useTheme();
  const [episodes, setEpisodes] = useState([]);
  const [allEpisodes, setAllEpisodes] = useState([]); // For infinite scroll
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [showAllEpisodes, setShowAllEpisodes] = useState(false); // Toggle to show unpublished episodes
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const observerTarget = useRef(null);
  const searchInputRef = useRef(null);

  // Initial load - fetch episodes (published only or all based on filter)
  useEffect(() => {
    async function fetchAllEpisodes() {
      try {
        setLoading(true);
        const publishedOnly = !showAllEpisodes; // If showAllEpisodes is true, don't filter by published
        const res = await fetch(`/api/episodes?publishedOnly=${publishedOnly}`);
        const data = await res.json();

        // Handle both old format (array) and new format (object with pagination)
        const episodesList = Array.isArray(data) ? data : data.episodes || [];
        console.log("📊 API Response:", {
          isArray: Array.isArray(data),
          episodesCount: episodesList.length,
          firstEpisode: episodesList[0] ? {
            title: episodesList[0].title,
            status: episodesList[0].status,
            episodeNumber: episodesList[0].episodeNumber
          } : null
        });
        setAllEpisodes(episodesList);
        // Initial load - show first pageSize episodes
        const initialEpisodes = episodesList.slice(0, pageSize);
        const hasMoreEpisodes = episodesList.length > initialEpisodes.length;
        console.log("📊 Initial Load:", {
          showing: initialEpisodes.length,
          total: episodesList.length,
          hasMore: hasMoreEpisodes,
          pageSize
        });
        setEpisodes(initialEpisodes);
        setHasMore(hasMoreEpisodes);
        setPage(1);
      } catch (error) {
        console.error("Error fetching episodes:", error);
        toast.error("Failed to load episodes. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchAllEpisodes();
  }, [pageSize, showAllEpisodes]);

  // Get filtered episodes list (for infinite scroll calculation)
  const allFilteredEpisodes = useMemo(() => {
    let filtered = [...allEpisodes];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((ep) => ep.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      filtered = filtered.filter((ep) => ep.difficulty === selectedDifficulty);
    }

    // Search filter
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
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
  }, [allEpisodes, debouncedSearchQuery, selectedCategory, selectedDifficulty]);

  // Infinite scroll - load more episodes from filtered list
  const loadMoreEpisodes = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    // Use requestAnimationFrame for smoother loading
    requestAnimationFrame(() => {
      const nextPage = page + 1;
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      const newEpisodes = allFilteredEpisodes.slice(startIndex, endIndex);

      if (newEpisodes.length > 0) {
        setEpisodes((prev) => [...prev, ...newEpisodes]);
        setPage(nextPage);
        const remaining = allFilteredEpisodes.length - endIndex;
        setHasMore(remaining > 0);
      } else {
        setHasMore(false);
      }
      setLoadingMore(false);
    });
  }, [page, pageSize, allFilteredEpisodes, loadingMore, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    // Only set up observer if we have more episodes to load
    const hasMoreToLoad = hasMore && allFilteredEpisodes.length > episodes.length;
    
    console.log("Intersection Observer setup check:", {
      hasMore,
      allFilteredEpisodesLength: allFilteredEpisodes.length,
      episodesLength: episodes.length,
      hasMoreToLoad,
      page,
      pageSize
    });
    
    if (!hasMoreToLoad) {
      console.log("Not setting up observer - no more episodes to load");
      return;
    }

    console.log("Setting up intersection observer");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          console.log("Intersection observer triggered - loading more!");
          loadMoreEpisodes();
        }
      },
      { threshold: 0.1, rootMargin: "200px" } // Trigger 200px before reaching the element for smoother loading
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
      console.log("Observer attached to element");
    } else {
      console.log("Observer target not found - trigger element may not be rendered!");
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadMoreEpisodes, allFilteredEpisodes.length, episodes.length, page, pageSize]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Track if initial load has completed
  const initialLoadComplete = useRef(false);
  
  // Reset episodes when filters change (for infinite scroll)
  useEffect(() => {
    // Skip if allEpisodes is empty (initial load hasn't completed)
    if (allEpisodes.length === 0) return;
    
    // Skip if initial load hasn't completed yet
    if (!initialLoadComplete.current) {
      initialLoadComplete.current = true;
      return;
    }
    
    console.log("Filters changed - resetting episodes", {
      allFilteredEpisodes: allFilteredEpisodes.length,
      currentEpisodes: episodes.length,
      searchQuery: debouncedSearchQuery,
      category: selectedCategory,
      difficulty: selectedDifficulty
    });
    
    setPage(1);
    const initialEpisodes = allFilteredEpisodes.slice(0, pageSize);
    setEpisodes(initialEpisodes);
    setHasMore(allFilteredEpisodes.length > initialEpisodes.length);
    // Reset loading state when filters change
    setLoadingMore(false);
  }, [debouncedSearchQuery, selectedCategory, selectedDifficulty, allFilteredEpisodes.length, pageSize, allEpisodes.length]);

  // Displayed episodes (already filtered and sorted by allFilteredEpisodes, just use what's loaded)
  const filteredEpisodes = episodes;

  // Get unique categories and difficulties from all episodes (not just loaded ones)
  const availableCategories = useMemo(() => {
    return [...new Set(allEpisodes.map((ep) => ep.category).filter(Boolean))].sort();
  }, [allEpisodes]);

  const availableDifficulties = useMemo(() => {
    return [...new Set(allEpisodes.map((ep) => ep.difficulty).filter(Boolean))].sort();
  }, [allEpisodes]);


  // Show skeleton loaders while loading
  const renderSkeletons = () => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: 3,
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Fade in={true} key={index} timeout={300 + index * 50}>
          <Box>
            <EpisodeCardSkeleton />
          </Box>
        </Fade>
      ))}
    </Box>
  );

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          background: darkMode
            ? "linear-gradient(135deg, #13181D 0%, #1A2F2A 50%, #1A2733 100%)"
            : "linear-gradient(135deg, #FFFFFF 0%, #F0FFF4 50%, #E6FFFA 100%)",
          borderRadius: 8,
          p: { xs: 4, md: 5 },
          mb: 4,
          border: darkMode ? "1px solid #2D4A3F" : "1px solid #C6F6D5",
          boxShadow: darkMode
            ? "0px 4px 20px rgba(0, 237, 100, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.2)"
            : "0px 4px 20px rgba(0, 104, 74, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.04)",
          overflow: "hidden",
        }}
      >
        {/* Brand Shape Decorations */}
        <Box
          component="img"
          src="/assets/shapes/shape-1.png"
          alt=""
          sx={{
            position: "absolute",
            top: -30,
            right: -30,
            width: { xs: "120px", md: "180px" },
            height: { xs: "120px", md: "180px" },
            opacity: darkMode ? 0.12 : 0.06,
            pointerEvents: "none",
            transform: "rotate(25deg)",
            filter: darkMode ? "brightness(1.2)" : "none",
          }}
        />
        <Box
          component="img"
          src="/assets/shapes/shape-15.png"
          alt=""
          sx={{
            position: "absolute",
            bottom: -20,
            left: -40,
            width: { xs: "100px", md: "150px" },
            height: { xs: "100px", md: "150px" },
            opacity: darkMode ? 0.1 : 0.05,
            pointerEvents: "none",
            transform: "rotate(-15deg)",
            filter: darkMode ? "brightness(1.2)" : "none",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Chip
              label={`${episodes.length} Episodes`}
              size="small"
              sx={{
                backgroundColor: "#00ED64",
                color: "#001E2B",
                fontWeight: 600,
                fontSize: "0.75rem",
                height: "24px",
                boxShadow: darkMode
                  ? "0px 2px 8px rgba(0, 237, 100, 0.3)"
                  : "0px 2px 4px rgba(0, 237, 100, 0.2)",
              }}
            />
            <Chip
              icon={<PlayArrowIcon sx={{ color: darkMode ? "#00ED64 !important" : "#001E2B !important", fontSize: "16px !important" }} />}
              label="60-Second Tips"
              size="small"
              sx={{
                backgroundColor: darkMode ? "#1A3A2F" : "#C6F6D5",
                color: darkMode ? "#00ED64" : "#00684A",
                fontWeight: 600,
                fontSize: "0.75rem",
                height: "24px",
                border: darkMode ? "1px solid #00ED6440" : "none",
              }}
            />
          </Stack>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              lineHeight: 1.2,
              color: darkMode ? "#E2E8F0" : "#001E2B",
              background: darkMode
                ? "linear-gradient(135deg, #E2E8F0 0%, #00ED64 100%)"
                : "linear-gradient(135deg, #001E2B 0%, #00684A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Learn MongoDB 60 Seconds at a Time
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 0,
              fontSize: { xs: "0.9375rem", md: "1.0625rem" },
              fontWeight: 400,
              maxWidth: "640px",
              color: darkMode ? "#CBD5E0" : "#2D3748",
              lineHeight: 1.7,
            }}
          >
            Quick, practical tips on data modeling, indexing, Atlas features, Vector Search, and more.
            Perfect for developers of all levels who want to master MongoDB efficiently.
          </Typography>
        </Box>
      </Box>

      {/* Search and Filter Section - Minimized */}
      <Paper
        sx={{
          position: "relative",
          p: 2,
          mb: 3,
          borderRadius: 2,
          backgroundColor: darkMode ? "#13181D" : "#FFFFFF",
          border: darkMode ? "1px solid #2D4A3F" : "1px solid #E2F8F0",
          boxShadow: darkMode
            ? "0px 2px 8px rgba(0, 237, 100, 0.08)"
            : "0px 2px 8px rgba(0, 104, 74, 0.04)",
          overflow: "hidden",
        }}
      >
        {/* Subtle Brand Shape */}
        <Box
          component="img"
          src="/assets/shapes/shape-20.png"
          alt=""
          sx={{
            position: "absolute",
            bottom: -25,
            right: -25,
            width: "100px",
            height: "100px",
            opacity: darkMode ? 0.08 : 0.03,
            pointerEvents: "none",
            transform: "rotate(45deg)",
            filter: darkMode ? "brightness(1.3)" : "none",
          }}
        />

        {/* Enhanced Search with Autocomplete */}
        <Box ref={searchInputRef} data-tour="search-bar" sx={{ mb: 2 }}>
          <SearchAutocomplete
            value={searchQuery}
            onChange={setSearchQuery}
            onSelect={(value) => {
              setSearchQuery(value);
              toast.info(`Searching for "${value}"`);
            }}
            episodes={allEpisodes}
          />
        </Box>

        {/* Show All Episodes Toggle */}
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1.5, borderBottom: "1px solid #E2E8F0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <input
              type="checkbox"
              id="showAllEpisodes"
              checked={showAllEpisodes}
              onChange={(e) => {
                setShowAllEpisodes(e.target.checked);
                setSelectedCategory(null);
                setSelectedDifficulty(null);
                setSearchQuery("");
                toast.info(e.target.checked ? "Showing all episodes" : "Showing published episodes only");
              }}
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
                accentColor: "#00684A",
              }}
            />
            <label
              htmlFor="showAllEpisodes"
              style={{
                fontSize: "0.875rem",
                color: "#001E2B",
                cursor: "pointer",
                fontWeight: 500,
                userSelect: "none",
              }}
            >
              Show all episodes (including unpublished)
            </label>
          </Box>
          {showAllEpisodes && (
            <Chip
              label="All Episodes"
              size="small"
              sx={{
                backgroundColor: "#00ED64",
                color: "#001E2B",
                fontSize: "0.7rem",
                height: "22px",
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {/* Category and Difficulty Filters - Inline */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 0 }}>
          {/* Category Filters */}
          <Box sx={{ flex: 1 }} data-tour="category-filters">
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: "block", fontSize: "0.7rem", color: "#5F6C76" }}>
              Category
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
              <Chip
                label="All"
                onClick={() => setSelectedCategory(null)}
                size="small"
                sx={{ 
                  fontWeight: selectedCategory === null ? 500 : 400,
                  backgroundColor: selectedCategory === null ? "#00684A" : "#EDF2F7",
                  color: selectedCategory === null ? "#FFFFFF" : "#001E2B",
                  fontSize: "0.7rem",
                  height: "22px",
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
                    fontSize: "0.7rem",
                    height: "22px",
                    "&:hover": {
                      backgroundColor: selectedCategory === category ? "#004D37" : "#CBD5E0",
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Difficulty Filters */}
          <Box sx={{ flex: 1 }} data-tour="difficulty-filters">
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: "block", fontSize: "0.7rem", color: "#5F6C76" }}>
              Difficulty
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
              <Chip
                label="All"
                onClick={() => setSelectedDifficulty(null)}
                size="small"
                sx={{ 
                  fontWeight: selectedDifficulty === null ? 500 : 400,
                  backgroundColor: selectedDifficulty === null ? "#00684A" : "#EDF2F7",
                  color: selectedDifficulty === null ? "#FFFFFF" : "#001E2B",
                  fontSize: "0.7rem",
                  height: "22px",
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
                    fontSize: "0.7rem",
                    height: "22px",
                    "&:hover": {
                      backgroundColor: selectedDifficulty === difficulty ? "#004D37" : "#CBD5E0",
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
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
          Episodes {filteredEpisodes.length > 0 && `(${filteredEpisodes.length}${allFilteredEpisodes.length > filteredEpisodes.length ? ` of ${allFilteredEpisodes.length}` : ''})`}
        </Typography>
        {allEpisodes.length > 0 && allFilteredEpisodes.length === filteredEpisodes.length && allFilteredEpisodes.length < 10 && (
          <Typography variant="caption" sx={{ color: "#5F6C76", fontSize: "0.75rem", display: "block", mb: 1 }}>
            Showing all published episodes. {allEpisodes.length < 10 ? "Publish more episodes to see infinite scroll in action!" : ""}
          </Typography>
        )}
        {(debouncedSearchQuery || selectedCategory || selectedDifficulty) && (
          <Typography variant="body2" sx={{ mb: 4, color: "#5F6C76", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 1 }}>
            Showing filtered results
            {searchQuery && searchQuery !== debouncedSearchQuery && (
              <CircularProgress size={12} sx={{ color: "#00684A" }} />
            )}
          </Typography>
        )}
      </Box>

      {loading ? (
        renderSkeletons()
      ) : filteredEpisodes.length > 0 ? (
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
          {filteredEpisodes.map((ep, index) => (
            <Zoom
              in={true}
              key={ep._id}
              timeout={300 + index * 50}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <Box
                {...(index === 0 ? { "data-tour": "episode-card" } : {})}
                sx={{
                  opacity: 0,
                  animation: "fadeIn 0.3s ease-in forwards",
                  "@keyframes fadeIn": {
                    to: { opacity: 1 },
                  },
                }}
              >
                <EpisodeCard episode={ep} searchQuery={debouncedSearchQuery} />
              </Box>
            </Zoom>
          ))}

          {/* Infinite Scroll Trigger */}
          {(() => {
            const shouldShow = hasMore && allFilteredEpisodes.length > episodes.length;
            console.log("Render trigger check:", {
              shouldShow,
              hasMore,
              allFilteredEpisodesLength: allFilteredEpisodes.length,
              episodesLength: episodes.length
            });
            
            if (!shouldShow) {
              // Show debug info even when trigger shouldn't show
              if (allFilteredEpisodes.length > 0) {
                return (
                  <Box
                    sx={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      py: 2,
                      color: "#5F6C76",
                      fontSize: "0.875rem",
                    }}
                  >
                    Showing all {allFilteredEpisodes.length} episodes
                  </Box>
                );
              }
              return null;
            }
            
            return (
              <Box
                ref={observerTarget}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 4,
                  gridColumn: "1 / -1",
                  minHeight: "100px",
                  backgroundColor: "rgba(0, 104, 74, 0.02)",
                  borderRadius: 2,
                  border: "1px dashed rgba(0, 104, 74, 0.2)",
                }}
              >
                {loadingMore ? (
                  <CircularProgress size={32} sx={{ color: "#00684A" }} />
                ) : (
                  <Typography variant="body2" sx={{ color: "#5F6C76", fontWeight: 500 }}>
                    Scroll for more episodes... ({episodes.length} of {allFilteredEpisodes.length})
                  </Typography>
                )}
              </Box>
            );
          })()}

          {/* End of Results */}
          {!hasMore && filteredEpisodes.length > pageSize && (
            <Box
              sx={{
                gridColumn: "1 / -1",
                textAlign: "center",
                py: 4,
              }}
            >
              <Typography variant="body2" sx={{ color: "#5F6C76" }}>
                You've reached the end! Showing all {filteredEpisodes.length} episodes.
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Fade in={true} timeout={500}>
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 2,
              borderRadius: 8,
              backgroundColor: "#FFFFFF",
              border: "2px dashed #CBD5E0",
            }}
          >
            <Box
              sx={{
                fontSize: 64,
                mb: 2,
                opacity: 0.3,
              }}
            >
              🔍
            </Box>
            <Typography variant="h6" sx={{ color: "#001E2B", fontWeight: 600, mb: 1 }}>
              No episodes found
            </Typography>
            <Typography variant="body2" sx={{ color: "#5F6C76", maxWidth: 400, mx: "auto" }}>
              {debouncedSearchQuery || selectedCategory || selectedDifficulty ? (
                <>
                  Try adjusting your search or filters to find what you're looking for.
                  <br />
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                      setSelectedDifficulty(null);
                    }}
                    sx={{
                      mt: 2,
                      color: "#00684A",
                      fontWeight: 500,
                    }}
                  >
                    Clear all filters
                  </Button>
                </>
              ) : (
                "Check back soon for new MongoDB tips!"
              )}
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Onboarding Tour */}
      <PublicTour />

      {/* Homepage Feedback Widget */}
      <HomepageFeedbackWidget />
    </>
  );
}
