"use client";

import { createContext, useContext, useState, useRef, useCallback } from "react";

const RecorderContext = createContext(null);

export function useRecorder() {
  const context = useContext(RecorderContext);
  if (!context) {
    throw new Error("useRecorder must be used within RecorderProvider");
  }
  return context;
}

export function RecorderProvider({ children }) {
  // Media Stream State
  const [mediaStream, setMediaStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Recorder State
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Recording Output
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedUrl, setRecordedUrl] = useState(null);

  // Transcript State
  const [transcriptText, setTranscriptText] = useState("");
  const [scrollSpeed, setScrollSpeed] = useState(2); // pixels per second
  const [fontSize, setFontSize] = useState(24);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [opacity, setOpacity] = useState(0.9);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showTeleprompter, setShowTeleprompter] = useState(true);

  // Camera Permissions
  const [cameraPermission, setCameraPermission] = useState("prompt"); // "granted" | "denied" | "prompt"
  const [error, setError] = useState(null);

  // Initialize Camera
  const initializeCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      setMediaStream(stream);
      setCameraPermission("granted");
      return stream;
    } catch (err) {
      console.error("Camera initialization error:", err);
      setError(err.message);
      setCameraPermission("denied");
      throw err;
    }
  }, []);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  }, [mediaStream]);

  // Start Recording
  const startRecording = useCallback(() => {
    if (!mediaStream) {
      setError("No media stream available");
      return;
    }

    try {
      chunksRef.current = [];

      const options = {
        mimeType: "video/webm;codecs=vp9,opus",
        videoBitsPerSecond: 2500000, // 2.5 Mbps
      };

      // Fallback for browsers that don't support vp9
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "video/webm";
      }

      const recorder = new MediaRecorder(mediaStream, options);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedBlob(blob);
        setRecordedUrl(url);
        chunksRef.current = [];
      };

      recorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setError("Recording error occurred");
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000); // Capture in 1 second chunks
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start transcript scrolling
      setIsScrolling(true);
      setScrollPosition(0);

    } catch (err) {
      console.error("Start recording error:", err);
      setError(err.message);
    }
  }, [mediaStream]);

  // Pause Recording
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      setIsScrolling(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, []);

  // Resume Recording
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      setIsScrolling(true);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  }, []);

  // Stop Recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setIsScrolling(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, []);

  // Reset Recording
  const resetRecording = useCallback(() => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedBlob(null);
    setRecordedUrl(null);
    setRecordingTime(0);
    setScrollPosition(0);
    setError(null);
  }, [recordedUrl]);

  // Format time helper
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const value = {
    // Media Stream
    mediaStream,
    initializeCamera,
    stopCamera,
    cameraPermission,

    // Recording State
    isRecording,
    isPaused,
    recordingTime,
    formatTime,

    // Recording Controls
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,

    // Recording Output
    recordedBlob,
    recordedUrl,

    // Transcript State
    transcriptText,
    setTranscriptText,
    scrollSpeed,
    setScrollSpeed,
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    opacity,
    setOpacity,
    isScrolling,
    setIsScrolling,
    scrollPosition,
    setScrollPosition,
    showTeleprompter,
    setShowTeleprompter,

    // Error State
    error,
    setError,
  };

  return (
    <RecorderContext.Provider value={value}>
      {children}
    </RecorderContext.Provider>
  );
}
