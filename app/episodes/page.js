import { listEpisodes } from "@/lib/episodes";
import EpisodeCard from "@/components/EpisodeCard";
import { Typography, Grid, Box, Chip, Stack } from "@mui/material";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Episodes | Mike's MongoDB Minute",
  description: "Browse all episodes of Mike's MongoDB Minute - 60-second MongoDB tips for developers",
};

export default async function EpisodesPage() {
  const episodes = await listEpisodes({ publishedOnly: true });

  // Group episodes by category
  const categories = [...new Set(episodes.map(ep => ep.category))];
  const episodesByCategory = categories.reduce((acc, category) => {
    acc[category] = episodes.filter(ep => ep.category === category);
    return acc;
  }, {});

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            mb: 1,
            fontSize: { xs: "2rem", md: "2.75rem" },
          }}
        >
          All Episodes
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            fontWeight: 400,
            fontSize: { xs: "1rem", md: "1.1rem" },
          }}
        >
          Browse all {episodes.length} episodes of Mike&apos;s MongoDB Minute
        </Typography>
      </Box>

      {/* Category Filters - Could be enhanced with client-side filtering */}
      <Box
        sx={{
          mb: 5,
          p: 3,
          borderRadius: 3,
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Filter by Category
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          <Chip 
            label={`All (${episodes.length})`} 
            color="primary"
            sx={{ fontWeight: 600 }}
          />
          {categories.map(category => (
            <Chip
              key={category}
              label={`${category} (${episodesByCategory[category].length})`}
              variant="outlined"
              sx={{ 
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Episodes Grid */}
      {episodes.length > 0 ? (
        <Grid container spacing={3}>
          {episodes.map((episode) => (
            <Grid item xs={12} sm={6} md={4} key={episode._id}>
              <EpisodeCard episode={episode} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 12,
            px: 2,
            borderRadius: 3,
            backgroundColor: "background.paper",
            border: "2px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
            No episodes published yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back soon for new MongoDB tips!
          </Typography>
        </Box>
      )}
    </Box>
  );
}
