"use client";

import { useEffect } from "react";

// Map analytics events to feedback behavior actions
const BEHAVIOR_EVENT_MAP = {
  code_snippet_copy: "copiedCodeSnippet",
  github_repo_click: "clickedGithubRepo",
  transcript_opened: "openedTranscript",
  schema_explorer_opened: "openedSchemaExplorer",
  resource_downloaded: "downloadedResource",
  related_episode_click: "relatedEpisodeClick",
  video_completed: "videoCompleted",
  video_rewatch: "videoRewatch",
};

export function trackEvent(eventType, data = {}) {
  // Track analytics events
  if (typeof window !== "undefined") {
    // Send to analytics endpoint
    fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventType,
        data,
        timestamp: new Date().toISOString(),
        url: window.location.pathname,
      }),
    }).catch((err) => {
      console.error("Analytics tracking error:", err);
    });

    // Also send behavior feedback if this is a trackable behavior
    const behaviorAction = BEHAVIOR_EVENT_MAP[eventType];
    if (behaviorAction && data.episodeId) {
      fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          episodeId: data.episodeId,
          page: window.location.pathname.startsWith("/episodes/") ? "episode" : "home",
          type: "behavior",
          action: behaviorAction,
          // Include additional context
          ...(data.searchQuery && { searchQuery: data.searchQuery }),
          ...(data.relatedEpisodeId && { relatedEpisodeId: data.relatedEpisodeId }),
        }),
      }).catch((err) => {
        console.error("Feedback tracking error:", err);
      });
    }
  }
}

export function useEpisodeAnalytics(episodeId) {
  useEffect(() => {
    if (!episodeId) return;

    // Track page view
    trackEvent("episode_view", { episodeId });

    // Track time on page
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 5) {
        // Only track if user spent more than 5 seconds
        trackEvent("episode_dwell_time", {
          episodeId,
          timeSpent,
        });
      }
    };
  }, [episodeId]);
}

