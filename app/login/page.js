"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";
import { Email as EmailIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { useTheme } from "@/contexts/ThemeContext";

function LoginForm() {
  const { darkMode } = useTheme();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const errorParam = searchParams.get("error");

  const errorMessages = {
    "missing-token": "Invalid link. Please request a new sign-in link.",
    expired: "This link has expired. Please request a new sign-in link.",
    "invalid-token": "Invalid link. Please request a new sign-in link.",
    unauthorized: "Unauthorized access. Only @mongodb.com addresses are allowed.",
    "server-error": "An error occurred. Please try again.",
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred");
        setLoading(false);
        return;
      }

      setSent(true);
      setLoading(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: darkMode
              ? "linear-gradient(180deg, #0A0F14 0%, #13181D 100%)"
              : "linear-gradient(180deg, #F7FAFC 0%, #FFFFFF 100%)",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3,
              maxWidth: 500,
              backgroundColor: darkMode ? "#13181D" : "#FFFFFF",
              border: darkMode ? "1px solid #2D3748" : "none",
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                color: darkMode ? "#00ED64" : "#00684A",
                mb: 2,
              }}
            />
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2, 
                fontWeight: 700,
                color: darkMode ? "#E2E8F0" : "inherit",
              }}
            >
              Check your email
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                color: darkMode ? "#A0AEC0" : "text.secondary",
              }}
            >
              We've sent a magic link to <strong style={{ color: darkMode ? "#E2E8F0" : "inherit" }}>{email}</strong>
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: darkMode ? "#A0AEC0" : "text.secondary",
              }}
            >
              Click the link in the email to sign in. The link will expire in 15 minutes.
            </Typography>
            <Button
              variant="text"
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              sx={{ 
                mt: 3,
                color: darkMode ? "#00ED64" : "#00684A",
                "&:hover": {
                  backgroundColor: darkMode ? "rgba(0, 237, 100, 0.1)" : "rgba(0, 104, 74, 0.1)",
                },
              }}
            >
              Use a different email
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  const getTextFieldSx = () => ({
    "& .MuiOutlinedInput-root": {
      color: darkMode ? "#E2E8F0" : "inherit",
      "& fieldset": {
        borderColor: darkMode ? "#2D3748" : "rgba(0, 0, 0, 0.23)",
      },
      "&:hover fieldset": {
        borderColor: darkMode ? "#00ED64" : "rgba(0, 0, 0, 0.87)",
      },
      "&.Mui-focused fieldset": {
        borderColor: darkMode ? "#00ED64" : "#00684A",
      },
      backgroundColor: darkMode ? "#0F1419" : "transparent",
    },
    "& .MuiInputLabel-root": {
      color: darkMode ? "#A0AEC0" : "rgba(0, 0, 0, 0.6)",
      "&.Mui-focused": {
        color: darkMode ? "#00ED64" : "#00684A",
      },
    },
    "& .MuiInputBase-input": {
      color: darkMode ? "#E2E8F0" : "inherit",
    },
  });

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: darkMode
            ? "linear-gradient(180deg, #0A0F14 0%, #13181D 100%)"
            : "linear-gradient(180deg, #F7FAFC 0%, #FFFFFF 100%)",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 3,
            width: "100%",
            maxWidth: 500,
            backgroundColor: darkMode ? "#13181D" : "#FFFFFF",
            border: darkMode ? "1px solid #2D3748" : "none",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: darkMode
                  ? "linear-gradient(135deg, #00ED64 0%, #00684A 100%)"
                  : "linear-gradient(135deg, #00684A 0%, #00ED64 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              🎬 MongoDB Minute
            </Typography>
            <Typography 
              variant="h5" 
              sx={{
                color: darkMode ? "#A0AEC0" : "text.secondary",
              }}
            >
              Sign In
            </Typography>
          </Box>

          {errorParam && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessages[errorParam] || "An error occurred"}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                textAlign: "center",
                color: darkMode ? "#A0AEC0" : "inherit",
              }}
            >
              Enter your <strong style={{ color: darkMode ? "#E2E8F0" : "inherit" }}>@mongodb.com</strong> email address and we'll send you a magic
              link to sign in.
            </Typography>

            <TextField
              fullWidth
              type="email"
              label="MongoDB Email"
              placeholder="your.name@mongodb.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <EmailIcon sx={{ 
                    mr: 1, 
                    color: darkMode ? "#A0AEC0" : "text.secondary",
                  }} />
                ),
              }}
              sx={{ mb: 3, ...getTextFieldSx() }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !email}
              sx={{
                py: 1.5,
                fontWeight: 600,
                background: darkMode
                  ? "linear-gradient(135deg, #00ED64 0%, #00684A 100%)"
                  : "linear-gradient(135deg, #00684A 0%, #004D37 100%)",
                "&:hover": {
                  background: darkMode
                    ? "linear-gradient(135deg, #00684A 0%, #00ED64 100%)"
                    : "linear-gradient(135deg, #00ED64 0%, #00684A 100%)",
                },
                "&:disabled": {
                  background: darkMode ? "#2D3748" : "#E2E8F0",
                  color: darkMode ? "#718096" : "#A0AEC0",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Send Magic Link"
              )}
            </Button>

            <Typography
              variant="caption"
              sx={{ 
                display: "block", 
                textAlign: "center", 
                mt: 3,
                color: darkMode ? "#A0AEC0" : "text.secondary",
              }}
            >
              Only @mongodb.com email addresses are allowed
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default function LoginPage() {
  const { darkMode } = useTheme();
  
  return (
    <Suspense fallback={
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: darkMode
              ? "linear-gradient(180deg, #0A0F14 0%, #13181D 100%)"
              : "linear-gradient(180deg, #F7FAFC 0%, #FFFFFF 100%)",
          }}
        >
          <CircularProgress sx={{ color: darkMode ? "#00ED64" : "#00684A" }} />
        </Box>
      </Container>
    }>
      <LoginForm />
    </Suspense>
  );
}
