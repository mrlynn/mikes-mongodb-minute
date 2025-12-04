"use client";

import { useEffect, useRef } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useRecorder } from "@/contexts/RecorderContext";

export default function TranscriptScroller() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimestampRef = useRef(null);

  const {
    transcriptText,
    fontSize,
    lineHeight,
    opacity,
    scrollSpeed,
    isScrolling,
    scrollPosition,
    setScrollPosition,
  } = useRecorder();

  // Auto-scroll animation
  useEffect(() => {
    if (!isScrolling || !containerRef.current || !contentRef.current) {
      lastTimestampRef.current = null;
      return;
    }

    const animate = (timestamp) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = (timestamp - lastTimestampRef.current) / 1000; // Convert to seconds
      lastTimestampRef.current = timestamp;

      // Calculate new scroll position
      const newPosition = scrollPosition + (scrollSpeed * deltaTime * 60); // scrollSpeed is pixels per second

      const maxScroll = contentRef.current.scrollHeight - containerRef.current.clientHeight;

      if (newPosition >= maxScroll) {
        // Reached the end
        setScrollPosition(maxScroll);
        return;
      }

      setScrollPosition(newPosition);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isScrolling, scrollSpeed, scrollPosition, setScrollPosition]);

  // Apply scroll position
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  // Reset scroll when transcript changes and not recording
  useEffect(() => {
    if (!isScrolling) {
      setScrollPosition(0);
    }
  }, [transcriptText, isScrolling, setScrollPosition]);

  if (!transcriptText || transcriptText.trim() === "") {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
            px: 3,
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.9)",
          }}
        >
          No transcript loaded.
          <br />
          The script will appear here when you start recording.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        position: "relative",
        backgroundColor: "transparent",
        overflow: "hidden",
      }}
    >
      {/* Top Fade Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, transparent 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Center Reading Line */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: "#00ED64",
          transform: "translateY(-50%)",
          zIndex: 2,
          pointerEvents: "none",
          boxShadow: "0 0 10px rgba(0, 237, 100, 0.5)",
        }}
      />

      {/* Scrollable Content */}
      <Box
        ref={containerRef}
        sx={{
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          scrollBehavior: "auto",
          px: 4,
          py: 3,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Top Padding to center first line */}
        <Box sx={{ height: "calc(50% - 40px)" }} />

        {/* Transcript Content */}
        <Box ref={contentRef}>
          <Typography
            component="div"
            sx={{
              color: "#FFFFFF",
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              opacity: opacity,
              fontWeight: 600,
              textAlign: "center",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              textShadow: "0 0 20px rgba(0, 0, 0, 1), 0 0 40px rgba(0, 0, 0, 0.8), 2px 2px 8px rgba(0, 0, 0, 0.9)",
              transition: "font-size 0.2s ease, line-height 0.2s ease, opacity 0.2s ease",
              WebkitTextStroke: "0.5px rgba(0, 0, 0, 0.5)",
            }}
          >
            {transcriptText}
          </Typography>
        </Box>

        {/* Bottom Padding */}
        <Box sx={{ height: "calc(50% - 40px)" }} />
      </Box>

      {/* Bottom Fade Overlay */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Scroll Indicator */}
      {isScrolling && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            backgroundColor: "rgba(0, 237, 100, 0.2)",
            border: "1px solid #00ED64",
            borderRadius: 1,
            px: 2,
            py: 0.5,
            zIndex: 3,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#00ED64",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          >
            SCROLLING
          </Typography>
        </Box>
      )}
    </Box>
  );
}
