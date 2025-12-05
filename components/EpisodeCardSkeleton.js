"use client";

import { Card, CardContent, CardActions, Box, Skeleton } from "@mui/material";

export default function EpisodeCardSkeleton() {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Category accent bar skeleton */}
      <Box
        sx={{
          height: 4,
          background: "linear-gradient(90deg, #E2E8F0 0%, #CBD5E0 100%)",
          width: "100%",
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Tags skeleton */}
        <Box sx={{ mb: 2, display: "flex", gap: 0.75 }}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={100} height={24} />
        </Box>

        {/* Accent line skeleton */}
        <Skeleton variant="rounded" width={40} height={3} sx={{ mb: 2 }} />

        {/* Title skeleton */}
        <Box sx={{ mb: 1.5, height: "56px" }}>
          <Skeleton variant="text" width="100%" height={28} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" height={28} />
        </Box>

        {/* Description skeleton */}
        <Box sx={{ mb: 2, height: "63px" }}>
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>

        {/* Difficulty and indicator skeleton */}
        <Box sx={{ mt: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Skeleton variant="rounded" width={90} height={24} />
          <Skeleton variant="circular" width={40} height={20} />
        </Box>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0 }}>
        <Skeleton variant="rounded" width="100%" height={40} />
      </CardActions>
    </Card>
  );
}

