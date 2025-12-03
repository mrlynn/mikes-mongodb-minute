"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Slider,
  Typography,
  Paper,
  Stack,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Fab,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Replay as ReplayIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Add as ZoomInIcon,
  Remove as ZoomOutIcon,
  Flip as MirrorIcon,
  Speed as SpeedIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

export default function Teleprompter({ episode, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [fontSize, setFontSize] = useState(48);
  const [isMirrored, setIsMirrored] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  const hideControlsTimeoutRef = useRef(null);

  // Build full script from episode sections
  const fullScript = [
    { section: "Hook (0-5s)", text: episode.hook },
    { section: "Problem (5-15s)", text: episode.problem },
    { section: "Tip (15-45s)", text: episode.tip },
    { section: "Quick Win (45-52s)", text: episode.quickWin },
    { section: "CTA (52-60s)", text: episode.cta },
  ];

  // Auto-scroll animation
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      const now = Date.now();
      const delta = now - lastUpdateRef.current;
      lastUpdateRef.current = now;

      setScrollPosition((prev) => {
        const newPos = prev + (speed * delta * 0.05);
        const maxScroll = scrollRef.current?.scrollHeight - scrollRef.current?.clientHeight || 0;

        if (newPos >= maxScroll) {
          setIsPlaying(false);
          return maxScroll;
        }

        return newPos;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed]);

  // Sync scroll position
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Space: Play/Pause
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
      // Arrow Up: Increase speed
      if (e.code === "ArrowUp") {
        e.preventDefault();
        setSpeed((prev) => Math.min(prev + 0.1, 3.0));
      }
      // Arrow Down: Decrease speed
      if (e.code === "ArrowDown") {
        e.preventDefault();
        setSpeed((prev) => Math.max(prev - 0.1, 0.1));
      }
      // Plus/Equals: Increase font size
      if (e.code === "Equal" || e.code === "NumpadAdd") {
        e.preventDefault();
        setFontSize((prev) => Math.min(prev + 4, 96));
      }
      // Minus: Decrease font size
      if (e.code === "Minus" || e.code === "NumpadSubtract") {
        e.preventDefault();
        setFontSize((prev) => Math.max(prev - 4, 24));
      }
      // R: Restart
      if (e.code === "KeyR") {
        e.preventDefault();
        setScrollPosition(0);
        setIsPlaying(false);
      }
      // F: Toggle fullscreen
      if (e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      }
      // M: Toggle mirror
      if (e.code === "KeyM") {
        e.preventDefault();
        setIsMirrored((prev) => !prev);
      }
      // Escape: Show controls
      if (e.code === "Escape") {
        setShowControls(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleRestart = () => {
    setScrollPosition(0);
    setIsPlaying(false);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#000",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
      }}
      onMouseMove={() => setShowControls(true)}
    >
      {/* Top Bar - Episode Info */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          p: 2,
          background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
          opacity: showControls ? 1 : 0,
          transition: "opacity 0.3s",
          zIndex: 10,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
            Episode {episode.episodeNumber}: {episode.title}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Teleprompter Content */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
          transform: isMirrored ? "scaleX(-1)" : "none",
        }}
      >
        {/* Highlight line in center */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #00ED64, transparent)",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            zIndex: 5,
          }}
        />

        {/* Vignette effect */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Script content */}
        <Box
          sx={{
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: "50vh",
            px: 8,
          }}
        >
          {fullScript.map((section, index) => (
            <Box key={index} sx={{ mb: 6, width: "100%", maxWidth: "1200px" }}>
              <Typography
                sx={{
                  color: "#00ED64",
                  fontSize: fontSize * 0.5,
                  fontWeight: 600,
                  mb: 2,
                  textAlign: "center",
                  opacity: 0.7,
                }}
              >
                {section.section}
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: fontSize,
                  lineHeight: 1.8,
                  fontWeight: 500,
                  textAlign: "center",
                  textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                }}
              >
                {section.text}
              </Typography>
            </Box>
          ))}
          <Box sx={{ height: "50vh" }} />
        </Box>
      </Box>

      {/* Bottom Controls */}
      <Paper
        elevation={8}
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          background: "linear-gradient(0deg, rgba(0,0,0,0.95) 0%, transparent 100%)",
          opacity: showControls ? 1 : 0,
          transition: "opacity 0.3s",
          zIndex: 10,
        }}
      >
        <Stack spacing={3}>
          {/* Playback Controls */}
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            <Tooltip title="Restart (R)">
              <IconButton onClick={handleRestart} sx={{ color: "#fff" }}>
                <ReplayIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Play/Pause (Space)">
              <Fab
                color="primary"
                onClick={() => setIsPlaying(!isPlaying)}
                sx={{ width: 72, height: 72 }}
              >
                {isPlaying ? <PauseIcon fontSize="large" /> : <PlayIcon fontSize="large" />}
              </Fab>
            </Tooltip>

            <Tooltip title="Fullscreen (F)">
              <IconButton onClick={toggleFullscreen} sx={{ color: "#fff" }}>
                {isFullscreen ? <FullscreenExitIcon fontSize="large" /> : <FullscreenIcon fontSize="large" />}
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Settings Row */}
          <Stack direction="row" spacing={4} alignItems="center" justifyContent="center">
            {/* Speed Control */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 250 }}>
              <SpeedIcon sx={{ color: "#fff" }} />
              <Typography sx={{ color: "#fff", minWidth: 60 }}>
                Speed: {speed.toFixed(1)}x
              </Typography>
              <Slider
                value={speed}
                onChange={(e, value) => setSpeed(value)}
                min={0.1}
                max={3.0}
                step={0.1}
                sx={{ flex: 1 }}
              />
            </Stack>

            {/* Font Size Control */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Decrease font (-)">
                <IconButton
                  onClick={() => setFontSize((prev) => Math.max(prev - 4, 24))}
                  sx={{ color: "#fff" }}
                >
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
              <Typography sx={{ color: "#fff", minWidth: 80, textAlign: "center" }}>
                {fontSize}px
              </Typography>
              <Tooltip title="Increase font (+)">
                <IconButton
                  onClick={() => setFontSize((prev) => Math.min(prev + 4, 96))}
                  sx={{ color: "#fff" }}
                >
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
            </Stack>

            {/* Mirror Toggle */}
            <Tooltip title="Mirror mode (M)">
              <ToggleButton
                value="mirror"
                selected={isMirrored}
                onChange={() => setIsMirrored(!isMirrored)}
                sx={{ color: "#fff" }}
              >
                <MirrorIcon />
              </ToggleButton>
            </Tooltip>
          </Stack>

          {/* Keyboard Shortcuts Help */}
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              fontSize: "0.75rem"
            }}
          >
            Shortcuts: SPACE (play/pause) | ↑↓ (speed) | +/- (font) | R (restart) | F (fullscreen) | M (mirror) | ESC (show controls)
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
