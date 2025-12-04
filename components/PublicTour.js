"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { IconButton, Tooltip } from "@mui/material";
import { TourOutlined as TourIcon } from "@mui/icons-material";

export default function PublicTour() {
  const [driverObj, setDriverObj] = useState(null);

  useEffect(() => {
    // Initialize driver
    const driverInstance = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      steps: [
        {
          element: "body",
          popover: {
            title: "Welcome to MongoDB Minute! 🎉",
            description:
              "Learn MongoDB in bite-sized 60-second videos. Let's take a quick tour to show you around!",
            side: "center",
            align: "center",
          },
        },
        {
          element: '[data-tour="search-bar"]',
          popover: {
            title: "🔍 Search Episodes",
            description:
              "Search across all episodes by title, topic, or keywords to find exactly what you need.",
            side: "bottom",
          },
        },
        {
          element: '[data-tour="category-filters"]',
          popover: {
            title: "📚 Filter by Category",
            description:
              "Browse episodes by category like Data Modeling, Indexing, Atlas, Vector & AI, and more.",
            side: "bottom",
          },
        },
        {
          element: '[data-tour="difficulty-filters"]',
          popover: {
            title: "📊 Filter by Difficulty",
            description:
              "Choose episodes based on your skill level: Beginner, Intermediate, or Advanced.",
            side: "bottom",
          },
        },
        {
          element: '[data-tour="episode-card"]',
          popover: {
            title: "📺 Episode Cards",
            description:
              "Each card shows the episode number, category, title, and a preview. Click 'View Details' to see the full episode!",
            side: "top",
          },
        },
        {
          element: "body",
          popover: {
            title: "🎓 You're All Set!",
            description:
              "Start exploring episodes and level up your MongoDB skills. Each episode is just 60 seconds - perfect for learning on the go!",
            side: "center",
            align: "center",
          },
        },
      ],
      onDestroyStarted: () => {
        // Mark tour as completed when user closes it
        if (typeof window !== "undefined") {
          localStorage.setItem("mongodb-minute-public-tour-completed", "true");
        }
        driverInstance.destroy();
      },
    });

    setDriverObj(driverInstance);

    // Check if user has completed the tour
    if (typeof window !== "undefined") {
      const tourCompleted = localStorage.getItem(
        "mongodb-minute-public-tour-completed"
      );
      if (!tourCompleted) {
        // Start tour automatically on first visit
        setTimeout(() => {
          driverInstance.drive();
        }, 500);
      }
    }

    return () => {
      if (driverInstance) {
        driverInstance.destroy();
      }
    };
  }, []);

  const startTour = () => {
    if (driverObj) {
      driverObj.drive();
    }
  };

  return (
    <Tooltip title="Take a Tour">
      <IconButton
        onClick={startTour}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          backgroundColor: "#00684A",
          color: "#FFFFFF",
          width: 56,
          height: 56,
          boxShadow: "0 4px 12px rgba(0, 104, 74, 0.3)",
          "&:hover": {
            backgroundColor: "#004D37",
            boxShadow: "0 6px 16px rgba(0, 104, 74, 0.4)",
          },
          zIndex: 1000,
        }}
      >
        <TourIcon />
      </IconButton>
    </Tooltip>
  );
}
