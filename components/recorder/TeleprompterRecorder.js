"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Grid, Typography, TextField, Button, Paper, Alert, Stack, IconButton, Tooltip } from "@mui/material";
import {
  Save as SaveIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  FiberManualRecord,
  Pause,
  PlayArrow,
  Stop,
} from "@mui/icons-material";
import { RecorderProvider, useRecorder } from "@/contexts/RecorderContext";
import CameraPreview from "./CameraPreview";
import TranscriptScroller from "./TranscriptScroller";
import RecorderController from "./RecorderController";
import OverlayControls from "./OverlayControls";

function TeleprompterRecorderContent({ initialScript = "", episodeId = null }) {
  const {
    transcriptText,
    setTranscriptText,
    recordedBlob,
    recordedUrl,
    isRecording,
    showTeleprompter,
    scrollSpeed,
    setScrollSpeed,
    fontSize,
    setFontSize,
    scrollPosition,
    setScrollPosition,
    isScrolling,
    setIsScrolling,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    isPaused,
    recordingTime,
    formatTime,
  } = useRecorder();
  const [saveStatus, setSaveStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef(null);

  // Load initial script when component mounts
  useEffect(() => {
    if (initialScript && !isInitialized) {
      setTranscriptText(initialScript);
      setIsInitialized(true);
    }
  }, [initialScript, isInitialized, setTranscriptText]);

  // Fullscreen toggle function
  const toggleFullscreen = async () => {
    if (!fullscreenRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await fullscreenRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  // Listen for fullscreen changes (in case user exits with ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input field
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") {
        return;
      }

      // Space: Toggle scrolling (when recording)
      if (e.code === "Space") {
        e.preventDefault();
        if (isRecording) {
          if (isPaused) {
            resumeRecording();
          } else {
            pauseRecording();
          }
        }
      }
      // Arrow Up: Increase speed
      if (e.code === "ArrowUp") {
        e.preventDefault();
        setScrollSpeed((prev) => Math.min(prev + 0.5, 10.0));
      }
      // Arrow Down: Decrease speed
      if (e.code === "ArrowDown") {
        e.preventDefault();
        setScrollSpeed((prev) => Math.max(prev - 0.5, 0.5));
      }
      // Plus/Equals: Increase font size
      if (e.code === "Equal" || e.code === "NumpadAdd") {
        e.preventDefault();
        setFontSize((prev) => Math.min(prev + 2, 48));
      }
      // Minus: Decrease font size
      if (e.code === "Minus" || e.code === "NumpadSubtract") {
        e.preventDefault();
        setFontSize((prev) => Math.max(prev - 2, 16));
      }
      // R: Restart/Reset scroll position
      if (e.code === "KeyR") {
        e.preventDefault();
        setScrollPosition(0);
        setIsScrolling(false);
      }
      // S: Start recording (if not already recording)
      if (e.code === "KeyS" && !isRecording && !recordedBlob) {
        e.preventDefault();
        startRecording();
      }
      // F: Toggle fullscreen
      if (e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    isRecording,
    isPaused,
    recordedBlob,
    pauseRecording,
    resumeRecording,
    startRecording,
    setScrollSpeed,
    setFontSize,
    setScrollPosition,
    setIsScrolling,
    toggleFullscreen,
  ]);

  const handleTranscriptChange = (event) => {
    if (!isRecording) {
      setTranscriptText(event.target.value);
    }
  };

  const handleDownload = () => {
    if (recordedUrl) {
      const a = document.createElement("a");
      a.href = recordedUrl;
      a.download = `recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleSave = async () => {
    if (!recordedBlob) return;

    try {
      setIsSaving(true);
      setSaveStatus(null);

      const formData = new FormData();
      formData.append("video", recordedBlob, `recording-${Date.now()}.webm`);
      formData.append("transcript", transcriptText);

      const response = await fetch("/api/recordings/save", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save recording");
      }

      const result = await response.json();
      setSaveStatus({ type: "success", message: "Recording saved successfully!" });
      return result;
    } catch (error) {
      console.error("Save error:", error);
      setSaveStatus({ type: "error", message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#F1F5F9", pb: 4 }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto", px: { xs: 2, md: 3 }, pt: 3 }}>
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            pb: 3,
            borderBottom: "2px solid #E2E8F0",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#00684A",
              mb: 1,
            }}
          >
            Teleprompter Recorder
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748B",
            }}
          >
            Record your video with a scrolling teleprompter to help you stay on script
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          {/* Left Column: Video & Controls */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 65%" }, minWidth: 0 }}>
            <Stack spacing={3}>
              {/* Camera Preview with Teleprompter Overlay */}
              <Box
                ref={fullscreenRef}
                sx={{
                  position: "relative",
                  width: "100%",
                  borderRadius: isFullscreen ? 0 : 3,
                  overflow: "hidden",
                  boxShadow: isFullscreen ? "none" : "0 4px 20px rgba(0, 0, 0, 0.15)",
                  backgroundColor: "#000",
                  ...(isFullscreen && {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                  }),
                }}
              >
                <CameraPreview />

                {/* Teleprompter Overlay */}
                {showTeleprompter && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      pointerEvents: "none",
                      zIndex: 10,
                    }}
                  >
                    <TranscriptScroller />
                  </Box>
                )}

                {/* Fullscreen Button */}
                <Tooltip title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}>
                  <IconButton
                    onClick={toggleFullscreen}
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      zIndex: 20,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      color: "#FFF",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                      },
                    }}
                  >
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                  </IconButton>
                </Tooltip>

                {/* Fullscreen Controls Overlay */}
                {isFullscreen && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      zIndex: 20,
                      background: "linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 100%)",
                      p: 3,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      {/* Timer */}
                      <Box
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          px: 3,
                          py: 1.5,
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: isRecording ? "#E63946" : "#FFF",
                          }}
                        >
                          {formatTime(recordingTime)}
                        </Typography>
                      </Box>

                      {/* Recording Controls */}
                      {!isRecording && !recordedBlob && (
                        <Button
                          variant="contained"
                          size="large"
                          onClick={startRecording}
                          startIcon={<FiberManualRecord />}
                          sx={{
                            backgroundColor: "#E63946",
                            color: "#FFF",
                            fontWeight: 700,
                            px: 4,
                            py: 1.5,
                            fontSize: "1.1rem",
                            "&:hover": {
                              backgroundColor: "#D62828",
                            },
                          }}
                        >
                          Start Recording
                        </Button>
                      )}

                      {isRecording && !isPaused && (
                        <IconButton
                          onClick={pauseRecording}
                          sx={{
                            backgroundColor: "#FFA500",
                            color: "#FFF",
                            width: 64,
                            height: 64,
                            "&:hover": {
                              backgroundColor: "#FF8C00",
                            },
                          }}
                        >
                          <Pause sx={{ fontSize: 32 }} />
                        </IconButton>
                      )}

                      {isRecording && isPaused && (
                        <IconButton
                          onClick={resumeRecording}
                          sx={{
                            backgroundColor: "#00ED64",
                            color: "#000",
                            width: 64,
                            height: 64,
                            "&:hover": {
                              backgroundColor: "#00C853",
                            },
                          }}
                        >
                          <PlayArrow sx={{ fontSize: 32 }} />
                        </IconButton>
                      )}

                      {isRecording && (
                        <IconButton
                          onClick={stopRecording}
                          sx={{
                            backgroundColor: "#64748B",
                            color: "#FFF",
                            width: 64,
                            height: 64,
                            "&:hover": {
                              backgroundColor: "#475569",
                            },
                          }}
                        >
                          <Stop sx={{ fontSize: 32 }} />
                        </IconButton>
                      )}
                    </Stack>
                  </Box>
                )}
              </Box>

              {/* Recording Controller */}
              <RecorderController />

              {/* Recorded Video Preview */}
              {recordedUrl && (
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: "#00684A",
                    }}
                  >
                    Recording Preview
                  </Typography>
                  <video
                    src={recordedUrl}
                    controls
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      backgroundColor: "#000",
                    }}
                  />
                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownload}
                      fullWidth
                      sx={{
                        borderColor: "#00684A",
                        color: "#00684A",
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: "#004D37",
                          backgroundColor: "rgba(0, 104, 74, 0.04)",
                        },
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={isSaving}
                      fullWidth
                      sx={{
                        backgroundColor: "#00ED64",
                        color: "#000",
                        fontWeight: 700,
                        "&:hover": {
                          backgroundColor: "#00C853",
                        },
                      }}
                    >
                      {isSaving ? "Saving..." : "Save to Library"}
                    </Button>
                  </Stack>
                  {saveStatus && (
                    <Alert severity={saveStatus.type} sx={{ mt: 2 }}>
                      {saveStatus.message}
                    </Alert>
                  )}
                </Paper>
              )}
            </Stack>
          </Box>

          {/* Right Column: Controls & Script */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 35%" }, minWidth: 0 }}>
            <Stack spacing={3}>
              {/* Overlay Controls */}
              <OverlayControls />

              {/* Script Editor */}
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 3,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#00684A",
                    }}
                  >
                    Script Editor
                  </Typography>
                  {isRecording && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#E63946",
                        fontWeight: 600,
                        backgroundColor: "rgba(230, 57, 70, 0.1)",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      🔒 Locked
                    </Typography>
                  )}
                </Stack>
                <TextField
                  multiline
                  rows={10}
                  fullWidth
                  value={transcriptText}
                  onChange={handleTranscriptChange}
                  disabled={isRecording}
                  placeholder="Enter your script here. It will appear in the teleprompter when you start recording..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                      backgroundColor: isRecording ? "#F8F9FA" : "#FFFFFF",
                    },
                  }}
                />
              </Paper>

              {/* Instructions */}
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  backgroundColor: "#F8FAFC",
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1.5,
                    fontWeight: 700,
                    color: "#00684A",
                    fontSize: "0.9rem",
                  }}
                >
                  📋 Quick Start
                </Typography>
                <Stack spacing={1}>
                  {[
                    "Enter your script above",
                    "Adjust speed & font size",
                    "Position yourself in camera",
                    "Click 'Start Recording'",
                    "Read from teleprompter",
                    "Stop when finished",
                  ].map((step, index) => (
                    <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
                      <Box
                        sx={{
                          minWidth: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: "#00ED64",
                          color: "#000",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#475569",
                          lineHeight: 1.4,
                          fontSize: "0.8rem",
                        }}
                      >
                        {step}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>

              {/* Keyboard Shortcuts */}
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  backgroundColor: "#F8FAFC",
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1.5,
                    fontWeight: 700,
                    color: "#00684A",
                    fontSize: "0.9rem",
                  }}
                >
                  ⌨️ Keyboard Shortcuts
                </Typography>
                <Stack spacing={0.75}>
                  {[
                    { keys: "SPACE", action: "Pause/Resume recording" },
                    { keys: "S", action: "Start recording" },
                    { keys: "F", action: "Toggle fullscreen" },
                    { keys: "↑ / ↓", action: "Adjust scroll speed" },
                    { keys: "+ / -", action: "Adjust font size" },
                    { keys: "R", action: "Reset scroll position" },
                  ].map((shortcut, index) => (
                    <Stack key={index} direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          px: 1,
                          py: 0.25,
                          backgroundColor: "#E2E8F0",
                          borderRadius: 1,
                          border: "1px solid #CBD5E1",
                          minWidth: 60,
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#475569",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            fontFamily: "monospace",
                          }}
                        >
                          {shortcut.keys}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748B",
                          fontSize: "0.75rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {shortcut.action}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function TeleprompterRecorder({ initialScript = "", episodeId = null }) {
  return (
    <RecorderProvider>
      <TeleprompterRecorderContent initialScript={initialScript} episodeId={episodeId} />
    </RecorderProvider>
  );
}
