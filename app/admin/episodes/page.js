"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminEpisodesPage() {
  const [episodes, setEpisodes] = useState([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, episode: null });
  const [duplicateDialog, setDuplicateDialog] = useState({ open: false, episode: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    fetchEpisodes();
  }, []);

  async function fetchEpisodes() {
    const res = await fetch("/api/episodes");
    const data = await res.json();
    setEpisodes(data);
    setFilteredEpisodes(data);
    setLoading(false);
  }

  // Filter episodes based on search and filters
  useEffect(() => {
    let filtered = [...episodes];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ep) =>
          ep.title?.toLowerCase().includes(query) ||
          ep.hook?.toLowerCase().includes(query) ||
          ep.category?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((ep) => ep.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((ep) => ep.category === categoryFilter);
    }

    setFilteredEpisodes(filtered);
  }, [episodes, searchQuery, statusFilter, categoryFilter]);

  async function handleDuplicate(episode) {
    try {
      const res = await fetch("/api/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...episode,
          title: `${episode.title} (Copy)`,
          episodeNumber: null, // Let them set a new number
          status: "draft",
          slug: "", // Auto-generate new slug
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDuplicateDialog({ open: false, episode: null });
        fetchEpisodes();
        router.push(`/admin/episodes/${data._id}`);
      }
    } catch (error) {
      console.error("Error duplicating episode:", error);
    }
  }

  function handleDeleteClick(episode) {
    setDeleteDialog({ open: true, episode });
  }

  function handleDeleteClose() {
    setDeleteDialog({ open: false, episode: null });
  }

  async function handleDeleteConfirm() {
    if (!deleteDialog.episode) return;

    await fetch(`/api/episodes/${deleteDialog.episode._id}`, {
      method: "DELETE",
    });

    setDeleteDialog({ open: false, episode: null });
    fetchEpisodes();
  }

  function getStatusColor(status) {
    const colors = {
      draft: "warning",
      "ready-to-record": "info",
      recorded: "secondary",
      published: "success",
    };
    return colors[status] || "default";
  }

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between", 
          alignItems: { xs: "flex-start", sm: "center" }, 
          mb: 4,
          gap: 2,
        }}
      >
        <Box>
          <Typography 
            variant="h3"
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.75rem" },
              mb: 0.5,
            }}
          >
            All Episodes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and edit your episodes
          </Typography>
        </Box>
        <Link href="/admin/episodes/new" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
            sx={{ fontWeight: 600, px: 4 }}
          >
            Create New
          </Button>
        </Link>
      </Box>

      {/* Filters and Search */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: "1px solid #E2E8F0",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search episodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 2 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="ready-to-record">Ready to Record</MenuItem>
              <MenuItem value="recorded">Recorded</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {Array.from(new Set(episodes.map((e) => e.category))).map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Results Count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredEpisodes.length} of {episodes.length} episodes
      </Typography>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {filteredEpisodes.map((episode) => (
          <Paper
            key={episode._id}
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 3,
              border: "1px solid #E2E8F0",
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: "1.125rem" }}>
                {episode.title}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {episode.episodeNumber && (
                  <Chip
                    label={`#${episode.episodeNumber}`}
                    size="small"
                    sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                  />
                )}
                <Chip
                  label={episode.category}
                  size="small"
                  sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                />
                <Chip
                  label={episode.difficulty}
                  size="small"
                  sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                />
                <Chip
                  label={episode.status}
                  size="small"
                  color={getStatusColor(episode.status)}
                  sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Link href={`/admin/episodes/${episode._id}`} style={{ textDecoration: 'none', flex: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  fullWidth
                  sx={{ fontWeight: 500 }}
                >
                  Edit
                </Button>
              </Link>
              <Button
                variant="outlined"
                startIcon={<DuplicateIcon />}
                onClick={() => setDuplicateDialog({ open: true, episode })}
                sx={{ fontWeight: 500 }}
              >
                Duplicate
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteClick(episode)}
                sx={{ fontWeight: 500 }}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Desktop Table View */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          display: { xs: "none", md: "block" },
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Difficulty</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEpisodes.map((episode, index) => (
              <TableRow
                key={episode._id}
                hover
                sx={{
                  "&:nth-of-type(even)": {
                    backgroundColor: "grey.50",
                  },
                }}
              >
                <TableCell>{episode.episodeNumber || "-"}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {episode.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={episode.category}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{episode.difficulty}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={episode.status}
                    size="small"
                    color={getStatusColor(episode.status)}
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Link href={`/admin/episodes/${episode._id}`} style={{ textDecoration: 'none' }}>
                    <IconButton
                      size="small"
                      color="primary"
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(0, 104, 74, 0.1)",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <IconButton
                    onClick={() => setDuplicateDialog({ open: true, episode })}
                    size="small"
                    color="primary"
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0, 104, 74, 0.1)",
                      },
                    }}
                  >
                    <DuplicateIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(episode)}
                    size="small"
                    color="error"
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(211, 47, 47, 0.1)",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleDeleteClose}>
        <DialogTitle>Delete Episode?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{deleteDialog.episode?.title}&quot;? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Duplicate Confirmation Dialog */}
      <Dialog open={duplicateDialog.open} onClose={() => setDuplicateDialog({ open: false, episode: null })}>
        <DialogTitle>Duplicate Episode?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a copy of &quot;{duplicateDialog.episode?.title}&quot;? The new episode will be created as a draft with &quot;(Copy)&quot; appended to the title.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDuplicateDialog({ open: false, episode: null })}>Cancel</Button>
          <Button onClick={() => handleDuplicate(duplicateDialog.episode)} variant="contained">
            Duplicate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
