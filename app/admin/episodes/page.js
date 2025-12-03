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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminEpisodesPage() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, episode: null });
  const router = useRouter();

  useEffect(() => {
    fetchEpisodes();
  }, []);

  async function fetchEpisodes() {
    const res = await fetch("/api/episodes");
    const data = await res.json();
    setEpisodes(data);
    setLoading(false);
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

      <TableContainer 
        component={Paper}
        sx={{ 
          borderRadius: 3,
          overflow: "hidden",
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
            {episodes.map((episode, index) => (
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
                          backgroundColor: "rgba(16, 168, 79, 0.1)",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Link>
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
    </Box>
  );
}
