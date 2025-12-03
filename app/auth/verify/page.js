"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, CircularProgress, Typography, Container } from "@mui/material";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.push("/login?error=missing-token");
      return;
    }

    // Redirect to the API endpoint for verification
    window.location.href = `/api/auth/verify?token=${token}`;
  }, [searchParams, router]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <CircularProgress
          size={60}
          sx={{
            color: "#00684A",
            mb: 3,
          }}
        />
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
          Verifying your link...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please wait while we sign you in
        </Typography>
      </Box>
    </Container>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ color: "#10A84F" }} />
          </Box>
        </Container>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
