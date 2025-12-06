"use client";

import { useEffect } from "react";
import { trackEvent } from "./EpisodeAnalytics";

export default function EpisodeAnalyticsWrapper({ episodeId }) {
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

  return null;
}

