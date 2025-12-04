"use client";

import { Box, Button, IconButton, Typography, Stack, Chip, Paper } from "@mui/material";
import {
  FiberManualRecord as RecordIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Replay as ReplayIcon,
} from "@mui/icons-material";
import { useRecorder } from "@/contexts/RecorderContext";

export default function RecorderController() {
  const {
    isRecording,
    isPaused,
    recordingTime,
    formatTime,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
    recordedBlob,
    mediaStream,
    error,
  } = useRecorder();

  const canStartRecording = mediaStream && !isRecording && !recordedBlob;
  const canPauseRecording = isRecording && !isPaused;
  const canResumeRecording = isRecording && isPaused;
  const canStopRecording = isRecording;

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 4,
        backgroundColor: "#FFFFFF",
        borderRadius: 3,
      }}
    >
      {/* Recording Timer */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {isRecording && (
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#E63946",
              animation: isPaused ? "none" : "blink 1s infinite",
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
        )}
        <Typography
          variant="h4"
          sx={{
            fontFamily: "monospace",
            fontWeight: 700,
            color: isRecording ? "#E63946" : "#64748B",
            minWidth: 120,
            textAlign: "center",
          }}
        >
          {formatTime(recordingTime)}
        </Typography>
        {isPaused && (
          <Chip
            label="PAUSED"
            size="small"
            sx={{
              backgroundColor: "#FFA500",
              color: "#FFF",
              fontWeight: 700,
            }}
          />
        )}
      </Box>

      {/* Recording Controls */}
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
        {!isRecording && !recordedBlob && (
          <Button
            variant="contained"
            size="large"
            startIcon={<RecordIcon />}
            onClick={startRecording}
            disabled={!canStartRecording || !!error}
            sx={{
              backgroundColor: "#E63946",
              color: "#FFF",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              "&:hover": {
                backgroundColor: "#D62828",
              },
              "&:disabled": {
                backgroundColor: "#E2E8F0",
                color: "#94A3B8",
              },
            }}
          >
            Start Recording
          </Button>
        )}

        {isRecording && !isPaused && (
          <IconButton
            onClick={pauseRecording}
            disabled={!canPauseRecording}
            sx={{
              backgroundColor: "#FFA500",
              color: "#FFF",
              width: 56,
              height: 56,
              "&:hover": {
                backgroundColor: "#FF8C00",
              },
              "&:disabled": {
                backgroundColor: "#E2E8F0",
                color: "#94A3B8",
              },
            }}
          >
            <PauseIcon sx={{ fontSize: 32 }} />
          </IconButton>
        )}

        {isRecording && isPaused && (
          <IconButton
            onClick={resumeRecording}
            disabled={!canResumeRecording}
            sx={{
              backgroundColor: "#00ED64",
              color: "#000",
              width: 56,
              height: 56,
              "&:hover": {
                backgroundColor: "#00C853",
              },
              "&:disabled": {
                backgroundColor: "#E2E8F0",
                color: "#94A3B8",
              },
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 32 }} />
          </IconButton>
        )}

        {isRecording && (
          <IconButton
            onClick={stopRecording}
            disabled={!canStopRecording}
            sx={{
              backgroundColor: "#64748B",
              color: "#FFF",
              width: 56,
              height: 56,
              "&:hover": {
                backgroundColor: "#475569",
              },
              "&:disabled": {
                backgroundColor: "#E2E8F0",
                color: "#94A3B8",
              },
            }}
          >
            <StopIcon sx={{ fontSize: 32 }} />
          </IconButton>
        )}

        {recordedBlob && (
          <Button
            variant="outlined"
            size="large"
            startIcon={<ReplayIcon />}
            onClick={resetRecording}
            sx={{
              borderColor: "#00684A",
              color: "#00684A",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              "&:hover": {
                borderColor: "#004D37",
                backgroundColor: "rgba(0, 104, 74, 0.04)",
              },
            }}
          >
            New Recording
          </Button>
        )}
      </Stack>

      {/* Status Messages */}
      {error && (
        <Box
          sx={{
            p: 2,
            backgroundColor: "rgba(230, 57, 70, 0.1)",
            borderRadius: 2,
            border: "1px solid rgba(230, 57, 70, 0.3)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#E63946",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {error}
          </Typography>
        </Box>
      )}

      {!mediaStream && !error && (
        <Box
          sx={{
            p: 2,
            backgroundColor: "#F8FAFC",
            borderRadius: 2,
            border: "1px solid #E2E8F0",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#64748B",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            Waiting for camera access...
          </Typography>
        </Box>
      )}

      {recordedBlob && (
        <Box
          sx={{
            p: 2,
            backgroundColor: "rgba(0, 237, 100, 0.1)",
            borderRadius: 2,
            border: "1px solid rgba(0, 237, 100, 0.3)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#00684A",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            ✅ Recording complete! Click "New Recording" to record again.
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
