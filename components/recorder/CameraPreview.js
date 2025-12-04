"use client";

import { useEffect, useRef } from "react";
import { Box, Alert, Button, CircularProgress, Typography, Stack } from "@mui/material";
import { Videocam as VideocamIcon, VideocamOff as VideocamOffIcon } from "@mui/icons-material";
import { useRecorder } from "@/contexts/RecorderContext";

export default function CameraPreview() {
  const videoRef = useRef(null);
  const {
    mediaStream,
    initializeCamera,
    stopCamera,
    cameraPermission,
    error,
    isRecording,
  } = useRecorder();

  // Attach media stream to video element
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }

    // Cleanup
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [mediaStream]);

  // Request camera on mount
  useEffect(() => {
    if (cameraPermission === "prompt") {
      initializeCamera().catch(console.error);
    }
  }, [cameraPermission, initializeCamera]);

  if (error) {
    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingBottom: "56.25%", // 16:9 aspect ratio
          backgroundColor: "#000",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            startIcon={<VideocamIcon />}
            onClick={initializeCamera}
          >
            Retry Camera Access
          </Button>
        </Box>
      </Box>
    );
  }

  if (!mediaStream) {
    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingBottom: "56.25%", // 16:9 aspect ratio
          backgroundColor: "#000",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: "#00ED64" }} />
          <Typography variant="body2" sx={{ color: "#fff" }}>
            Initializing camera...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%", // 16:9 aspect ratio
        backgroundColor: "#000",
        overflow: "hidden",
        border: isRecording ? "3px solid #E63946" : "none",
        boxShadow: isRecording
          ? "0 0 20px rgba(230, 57, 70, 0.5)"
          : "none",
        transition: "all 0.3s ease",
      }}
    >
      {/* Recording Indicator */}
      {isRecording && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: "rgba(230, 57, 70, 0.9)",
            px: 2,
            py: 1,
            borderRadius: 2,
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%, 100%": {
                opacity: 1,
              },
              "50%": {
                opacity: 0.7,
              },
            },
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#fff",
              animation: "blink 1s infinite",
              "@keyframes blink": {
                "0%, 100%": {
                  opacity: 1,
                },
                "50%": {
                  opacity: 0.3,
                },
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{ color: "#fff", fontWeight: 700, fontSize: "0.875rem" }}
          >
            REC
          </Typography>
        </Box>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Camera Controls Overlay */}
      {!isRecording && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<VideocamOffIcon />}
            onClick={stopCamera}
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.9)",
              },
            }}
          >
            Stop Camera
          </Button>
        </Box>
      )}
    </Box>
  );
}
