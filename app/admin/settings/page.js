"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const [settings, setSettings] = useState({
    openaiApiKey: "",
    socialHandles: {
      youtube: "",
      tiktok: "",
      linkedin: "",
      instagram: "",
      x: "",
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/user/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setMessage({ type: "error", text: "Failed to load settings" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to save settings" });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ type: "error", text: "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  }

  function handleSocialHandleChange(platform, value) {
    setSettings({
      ...settings,
      socialHandles: {
        ...settings.socialHandles,
        [platform]: value,
      },
    });
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "2rem", md: "2.75rem" },
            mb: 0.5,
          }}
        >
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure your API keys and social media handles
        </Typography>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      {/* API Configuration Section */}
      <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          AI Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Add your OpenAI API key to enable AI-powered episode generation. Your key is stored securely and never shared.
        </Typography>

        <TextField
          fullWidth
          label="OpenAI API Key"
          type={showApiKey ? "text" : "password"}
          value={settings.openaiApiKey}
          onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
          placeholder="sk-proj-..."
          helperText="Your OpenAI API key will be used for generating episode content"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle api key visibility"
                  onClick={() => setShowApiKey(!showApiKey)}
                  edge="end"
                >
                  {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Social Media Handles Section */}
      <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Social Media Handles
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure your social media handles for episode sharing
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="YouTube Channel"
              value={settings.socialHandles.youtube}
              onChange={(e) => handleSocialHandleChange("youtube", e.target.value)}
              placeholder="@YourChannel"
              helperText="Your YouTube channel handle"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="TikTok"
              value={settings.socialHandles.tiktok}
              onChange={(e) => handleSocialHandleChange("tiktok", e.target.value)}
              placeholder="@yourtiktok"
              helperText="Your TikTok username"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="LinkedIn"
              value={settings.socialHandles.linkedin}
              onChange={(e) => handleSocialHandleChange("linkedin", e.target.value)}
              placeholder="linkedin.com/in/yourprofile"
              helperText="Your LinkedIn profile URL"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Instagram"
              value={settings.socialHandles.instagram}
              onChange={(e) => handleSocialHandleChange("instagram", e.target.value)}
              placeholder="@yourinstagram"
              helperText="Your Instagram handle"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="X (Twitter)"
              value={settings.socialHandles.x}
              onChange={(e) => handleSocialHandleChange("x", e.target.value)}
              placeholder="@yourtwitter"
              helperText="Your X/Twitter handle"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Save Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          size="large"
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{ px: 4, fontWeight: 600 }}
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </Box>
    </Box>
  );
}
