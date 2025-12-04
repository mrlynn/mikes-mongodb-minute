"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { IconButton, Tooltip } from "@mui/material";
import { TourOutlined as TourIcon } from "@mui/icons-material";

export default function AdminTour() {
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
            title: "Welcome to the Admin Dashboard! 🎯",
            description:
              "This is your content management hub. Let's walk through the key features to help you create amazing MongoDB Minute episodes!",
            side: "center",
            align: "center",
          },
        },
        {
          element: '[data-tour="quick-actions"]',
          popover: {
            title: "⚡ Quick Actions",
            description:
              "Start here! Use AI to generate episodes automatically, or create them manually. These buttons give you fast access to the most common tasks.",
            side: "bottom",
          },
        },
        {
          element: '[data-tour="statistics"]',
          popover: {
            title: "📊 Episode Statistics",
            description:
              "Track your content at a glance. See total episodes and breakdown by status: Draft, Ready to Record, Recorded, and Published.",
            side: "bottom",
          },
        },
        {
          element: '[data-tour="workflow-stats"]',
          popover: {
            title: "🔄 Workflow Tracking",
            description:
              "Monitor your content approval process. Episodes move through Draft → Tech Review → Approved stages to ensure quality.",
            side: "bottom",
          },
        },
        {
          element: '[data-tour="review-queue"]',
          popover: {
            title: "✅ Review Queue",
            description:
              "See episodes waiting for technical review. Click on any episode to review it, approve it, or request changes.",
            side: "top",
          },
        },
        {
          element: '[data-tour="help-button"]',
          popover: {
            title: "📚 Documentation",
            description:
              "Need help? Click this button anytime to access the full documentation at docs.mongodbminute.com",
            side: "left",
          },
        },
        {
          element: "body",
          popover: {
            title: "🚀 Ready to Create!",
            description:
              "You're all set! Start by creating your first episode using the 'AI Generate' button or 'Create Manually'. Every episode follows our 60-second format for maximum impact!",
            side: "center",
            align: "center",
          },
        },
      ],
      onDestroyStarted: () => {
        // Mark tour as completed when user closes it
        if (typeof window !== "undefined") {
          localStorage.setItem("mongodb-minute-admin-tour-completed", "true");
        }
        driverInstance.destroy();
      },
    });

    setDriverObj(driverInstance);

    // Check if user has completed the tour
    if (typeof window !== "undefined") {
      const tourCompleted = localStorage.getItem(
        "mongodb-minute-admin-tour-completed"
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
    <Tooltip title="Take Admin Tour">
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
