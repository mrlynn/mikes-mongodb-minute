"use client";

import { Box, Typography, Slider, Stack, Paper, Divider, Switch, FormControlLabel } from "@mui/material";
import {
  Speed as SpeedIcon,
  TextFields as TextFieldsIcon,
  LineWeight as LineWeightIcon,
  Opacity as OpacityIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useRecorder } from "@/contexts/RecorderContext";

export default function OverlayControls() {
  const {
    scrollSpeed,
    setScrollSpeed,
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    opacity,
    setOpacity,
    isRecording,
    showTeleprompter,
    setShowTeleprompter,
  } = useRecorder();

  const handleScrollSpeedChange = (event, newValue) => {
    setScrollSpeed(newValue);
  };

  const handleFontSizeChange = (event, newValue) => {
    setFontSize(newValue);
  };

  const handleLineHeightChange = (event, newValue) => {
    setLineHeight(newValue);
  };

  const handleOpacityChange = (event, newValue) => {
    setOpacity(newValue);
  };

  return (
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
          mb: 3,
          fontWeight: 700,
          color: "#00684A",
        }}
      >
        Teleprompter Settings
      </Typography>

      <Stack spacing={3}>
        {/* Show/Hide Teleprompter */}
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={showTeleprompter}
                onChange={(e) => setShowTeleprompter(e.target.checked)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#00ED64",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#00ED64",
                  },
                }}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <VisibilityIcon sx={{ color: "#00684A", fontSize: 20 }} />
                <Typography variant="body2" fontWeight={600} color="#475569">
                  Show Teleprompter Overlay
                </Typography>
              </Stack>
            }
          />
        </Box>

        <Divider />

        {/* Scroll Speed */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <SpeedIcon sx={{ color: "#00684A", fontSize: 20 }} />
            <Typography variant="body2" fontWeight={600} color="#475569">
              Scroll Speed
            </Typography>
            <Typography
              variant="body2"
              sx={{
                ml: "auto",
                fontFamily: "monospace",
                color: "#00684A",
                fontWeight: 700,
              }}
            >
              {scrollSpeed.toFixed(1)} px/s
            </Typography>
          </Stack>
          <Slider
            value={scrollSpeed}
            onChange={handleScrollSpeedChange}
            min={0.5}
            max={10}
            step={0.5}
            disabled={isRecording}
            sx={{
              color: "#00684A",
              "& .MuiSlider-thumb": {
                width: 16,
                height: 16,
              },
              "& .MuiSlider-track": {
                height: 4,
              },
              "& .MuiSlider-rail": {
                height: 4,
                backgroundColor: "#E2E8F0",
              },
            }}
          />
        </Box>

        <Divider />

        {/* Font Size */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <TextFieldsIcon sx={{ color: "#00684A", fontSize: 20 }} />
            <Typography variant="body2" fontWeight={600} color="#475569">
              Font Size
            </Typography>
            <Typography
              variant="body2"
              sx={{
                ml: "auto",
                fontFamily: "monospace",
                color: "#00684A",
                fontWeight: 700,
              }}
            >
              {fontSize}px
            </Typography>
          </Stack>
          <Slider
            value={fontSize}
            onChange={handleFontSizeChange}
            min={16}
            max={48}
            step={2}
            disabled={isRecording}
            sx={{
              color: "#00684A",
              "& .MuiSlider-thumb": {
                width: 16,
                height: 16,
              },
              "& .MuiSlider-track": {
                height: 4,
              },
              "& .MuiSlider-rail": {
                height: 4,
                backgroundColor: "#E2E8F0",
              },
            }}
          />
        </Box>

        <Divider />

        {/* Line Height */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <LineWeightIcon sx={{ color: "#00684A", fontSize: 20 }} />
            <Typography variant="body2" fontWeight={600} color="#475569">
              Line Height
            </Typography>
            <Typography
              variant="body2"
              sx={{
                ml: "auto",
                fontFamily: "monospace",
                color: "#00684A",
                fontWeight: 700,
              }}
            >
              {lineHeight.toFixed(1)}
            </Typography>
          </Stack>
          <Slider
            value={lineHeight}
            onChange={handleLineHeightChange}
            min={1.2}
            max={2.5}
            step={0.1}
            disabled={isRecording}
            sx={{
              color: "#00684A",
              "& .MuiSlider-thumb": {
                width: 16,
                height: 16,
              },
              "& .MuiSlider-track": {
                height: 4,
              },
              "& .MuiSlider-rail": {
                height: 4,
                backgroundColor: "#E2E8F0",
              },
            }}
          />
        </Box>

        <Divider />

        {/* Opacity */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <OpacityIcon sx={{ color: "#00684A", fontSize: 20 }} />
            <Typography variant="body2" fontWeight={600} color="#475569">
              Opacity
            </Typography>
            <Typography
              variant="body2"
              sx={{
                ml: "auto",
                fontFamily: "monospace",
                color: "#00684A",
                fontWeight: 700,
              }}
            >
              {Math.round(opacity * 100)}%
            </Typography>
          </Stack>
          <Slider
            value={opacity}
            onChange={handleOpacityChange}
            min={0.3}
            max={1.0}
            step={0.05}
            disabled={isRecording}
            sx={{
              color: "#00684A",
              "& .MuiSlider-thumb": {
                width: 16,
                height: 16,
              },
              "& .MuiSlider-track": {
                height: 4,
              },
              "& .MuiSlider-rail": {
                height: 4,
                backgroundColor: "#E2E8F0",
              },
            }}
          />
        </Box>
      </Stack>

      {isRecording && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: "rgba(255, 165, 0, 0.1)",
            borderRadius: 2,
            border: "1px solid rgba(255, 165, 0, 0.3)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#C77700",
              fontWeight: 600,
              display: "block",
              textAlign: "center",
            }}
          >
            🔒 Settings locked during recording
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
