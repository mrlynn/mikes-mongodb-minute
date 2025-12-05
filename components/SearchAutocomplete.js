"use client";

import { useState, useEffect, useRef } from "react";
import {
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Chip,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  History as HistoryIcon,
  Clear as ClearIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

const MAX_RECENT_SEARCHES = 5;
const STORAGE_KEY = "mongodb-minute-recent-searches";

export default function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  suggestions = [],
  episodes = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  }, []);

  // Generate suggestions from episodes
  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setFilteredSuggestions([]);
      return;
    }

    const query = value.toLowerCase().trim();
    const matches = [];

    // Search in titles, categories, and difficulties
    episodes.forEach((ep) => {
      const titleMatch = ep.title?.toLowerCase().includes(query);
      const categoryMatch = ep.category?.toLowerCase().includes(query);
      const difficultyMatch = ep.difficulty?.toLowerCase().includes(query);

      if (titleMatch || categoryMatch || difficultyMatch) {
        matches.push({
          type: titleMatch ? "title" : categoryMatch ? "category" : "difficulty",
          text: titleMatch ? ep.title : categoryMatch ? ep.category : ep.difficulty,
          episode: ep,
        });
      }
    });

    // Remove duplicates and limit to 8
    const unique = Array.from(
      new Map(matches.map((item) => [item.text, item])).values()
    ).slice(0, 8);

    setFilteredSuggestions(unique);
  }, [value, episodes]);

  const handleSelect = (searchText) => {
    onChange(searchText);
    onSelect?.(searchText);
    setIsOpen(false);
    inputRef.current?.blur();

    // Save to recent searches
    if (searchText.trim()) {
      const updated = [
        searchText.trim(),
        ...recentSearches.filter((s) => s !== searchText.trim()),
      ].slice(0, MAX_RECENT_SEARCHES);
      setRecentSearches(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving recent searches:", error);
      }
    }
  };

  const handleClearRecent = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  };

  const handleClearSearch = () => {
    onChange("");
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = isOpen && (filteredSuggestions.length > 0 || recentSearches.length > 0);

  return (
    <Box ref={containerRef} sx={{ position: "relative", width: "100%" }}>
      <TextField
        inputRef={inputRef || undefined}
        fullWidth
        placeholder="Search episodes by title, content, category, or difficulty..."
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
          } else if (e.key === "Enter" && filteredSuggestions.length > 0) {
            handleSelect(filteredSuggestions[0].text);
          }
        }}
        data-tour="search-bar"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClearSearch}
                sx={{ color: "#5F6C76" }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 0,
          "& .MuiOutlinedInput-root": {
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#00684A",
            },
            "&.Mui-focused": {
              borderColor: "#00684A",
            },
          },
        }}
      />

      {showDropdown && (
        <Paper
          elevation={8}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1300,
            mt: 0.5,
            maxHeight: 400,
            overflow: "auto",
            borderRadius: 2,
            border: "1px solid #E2E8F0",
          }}
        >
          {/* Suggestions */}
          {filteredSuggestions.length > 0 && (
            <Box>
              <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #E2E8F0" }}>
                <Typography variant="caption" sx={{ color: "#5F6C76", fontWeight: 600 }}>
                  Suggestions
                </Typography>
              </Box>
              <List dense sx={{ py: 0 }}>
                {filteredSuggestions.map((suggestion, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      onClick={() => handleSelect(suggestion.text)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(0, 104, 74, 0.04)",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <TrendingUpIcon sx={{ fontSize: 18, color: "#00684A" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={suggestion.text}
                        secondary={
                          suggestion.type === "title"
                            ? suggestion.episode.category
                            : `${suggestion.type} match`
                        }
                        primaryTypographyProps={{
                          sx: { fontSize: "0.875rem", fontWeight: 500 },
                        }}
                        secondaryTypographyProps={{
                          sx: { fontSize: "0.75rem", color: "#5F6C76" },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <Box>
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderTop: filteredSuggestions.length > 0 ? "1px solid #E2E8F0" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="caption" sx={{ color: "#5F6C76", fontWeight: 600 }}>
                  Recent Searches
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleClearRecent}
                  sx={{ color: "#5F6C76", p: 0.5 }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Box>
              <List dense sx={{ py: 0 }}>
                {recentSearches.map((search, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      onClick={() => handleSelect(search)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(0, 104, 74, 0.04)",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <HistoryIcon sx={{ fontSize: 18, color: "#5F6C76" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={search}
                        primaryTypographyProps={{
                          sx: { fontSize: "0.875rem" },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}

