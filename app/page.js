import { listEpisodes } from "@/lib/episodes";
import EpisodeCard from "@/components/EpisodeCard";
import { Typography, Grid, Box, Button, Container, Stack, Chip } from "@mui/material";
import { PlayArrow as PlayArrowIcon, TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mike's MongoDB Minute | 60-Second MongoDB Tips",
  description: "Learn MongoDB in 60 seconds! Quick, practical tips on data modeling, indexing, Atlas features, Vector Search, and more. Perfect for developers of all levels.",
  keywords: "MongoDB, Database, NoSQL, Atlas, Vector Search, Aggregation, Indexing, Data Modeling",
};

export default async function HomePage() {
  const episodes = await listEpisodes({ publishedOnly: true });
  const latest = episodes.slice(-6).reverse();

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
              label={`${episodes.length}+ Episodes`} 
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
          
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Link href="/episodes" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<PlayArrowIcon />}
                sx={{
                  backgroundColor: "white",
                  color: "#10A84F",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.9)",
                    transform: "translateY(-2px)",
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Browse Episodes
              </Button>
            </Link>
            <Link href="/episodes" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                size="large"
                endIcon={<TrendingUpIcon />}
                sx={{
                  borderColor: "white",
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.9)",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Popular Topics
              </Button>
            </Link>
          </Stack>
        </Box>
      </Box>

      {/* Latest Episodes Section */}
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            mb: 1,
            fontSize: { xs: "1.75rem", md: "2.125rem" },
          }}
        >
          Latest Episodes
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Start your MongoDB journey with these recent tips
        </Typography>
      </Box>

      {latest.length > 0 ? (
        <Grid container spacing={3}>
          {latest.map((ep) => (
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
            No episodes published yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back soon for new MongoDB tips!
          </Typography>
        </Box>
      )}
    </>
  );
}
