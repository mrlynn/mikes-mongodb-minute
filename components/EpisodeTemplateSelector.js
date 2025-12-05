"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Box,
  Paper,
  Chip,
} from "@mui/material";
import {
  School as TutorialIcon,
  Lightbulb as TipIcon,
  CompareArrows as CompareIcon,
  Build as SolutionIcon,
  Star as FeatureIcon,
  Error as MistakeIcon,
  CheckCircle as BestPracticeIcon,
} from "@mui/icons-material";

const TEMPLATES = {
  "how-to": {
    name: "How-To Tutorial",
    icon: <TutorialIcon />,
    description: "Step-by-step guide for accomplishing a specific task",
    category: "Data Modeling",
    difficulty: "Beginner",
    hook: "Want to learn how to [do something] in MongoDB? Here's the fastest way...",
    problem: "Many developers struggle with [specific challenge]. The traditional approach can be [pain point]...",
    tip: "Here's the solution: [Step 1]. Then [Step 2]. Finally, [Step 3]. This approach works because...",
    quickWin: "Using this method, you can [achieve result] in just [time/effort]. I've seen teams reduce [metric] by [percentage]...",
    cta: "Try this today and let me know how it works! Next week, I'll show you [related topic]...",
    visualSuggestion: "Show code example or screen recording demonstrating the steps",
  },
  "quick-tip": {
    name: "Quick Tip",
    icon: <TipIcon />,
    description: "A single, actionable tip that solves a common problem",
    category: "Indexing",
    difficulty: "Beginner",
    hook: "Here's a MongoDB tip that will save you hours...",
    problem: "If you're doing [common mistake], you're probably experiencing [symptom]...",
    tip: "The fix is simple: [specific tip]. Instead of [wrong way], use [right way]. Here's why this works...",
    quickWin: "This one change can improve [metric] by [amount]. I've seen queries go from [slow] to [fast]...",
    cta: "Save this tip for later! What's your favorite MongoDB shortcut? Drop it in the comments...",
    visualSuggestion: "Show before/after comparison or quick code snippet",
  },
  "comparison": {
    name: "Comparison",
    icon: <CompareIcon />,
    description: "Compare two approaches, patterns, or features",
    category: "Data Modeling",
    difficulty: "Intermediate",
    hook: "Should you use [Option A] or [Option B] in MongoDB? Here's when each makes sense...",
    problem: "Developers often debate [topic]. Both approaches have their place, but choosing wrong can lead to [consequence]...",
    tip: "Use [Option A] when [scenario 1]. Use [Option B] when [scenario 2]. The key difference is [main point]...",
    quickWin: "Picking the right approach can mean the difference between [good outcome] and [bad outcome]...",
    cta: "Which approach do you prefer? Let me know in the comments! Next time, I'll dive deeper into [related topic]...",
    visualSuggestion: "Show side-by-side comparison or decision tree diagram",
  },
  "problem-solution": {
    name: "Problem/Solution",
    icon: <SolutionIcon />,
    description: "Address a specific problem with a clear solution",
    category: "Atlas",
    difficulty: "Intermediate",
    hook: "Struggling with [common problem]? You're not alone. Here's the fix...",
    problem: "[Problem description]. This happens because [root cause]. It affects [who/what] by [impact]...",
    tip: "The solution is [solution]. Here's how to implement it: [steps]. The key is [important detail]...",
    quickWin: "After applying this fix, you'll see [improvement]. I've helped teams resolve this in [timeframe]...",
    cta: "Have you faced this issue? Share your experience below! Follow for more MongoDB troubleshooting tips...",
    visualSuggestion: "Show the problem visually, then demonstrate the solution",
  },
  "feature-showcase": {
    name: "Feature Showcase",
    icon: <FeatureIcon />,
    description: "Highlight a specific MongoDB feature or capability",
    category: "New Features",
    difficulty: "Beginner",
    hook: "Did you know MongoDB can [impressive capability]? Most developers don't realize this...",
    problem: "Many developers are still using [old way] when MongoDB has [better feature] built right in...",
    tip: "Here's how [feature] works: [explanation]. You can use it by [how to use]. The best part is [benefit]...",
    quickWin: "This feature can [capability]. I've seen it [real-world example]...",
    cta: "Have you tried [feature] yet? What do you think? Next week, I'll show you [related feature]...",
    visualSuggestion: "Show the feature in action with code or UI demonstration",
  },
  "common-mistake": {
    name: "Common Mistake",
    icon: <MistakeIcon />,
    description: "Highlight a frequent error and how to avoid it",
    category: "Data Modeling",
    difficulty: "Beginner",
    hook: "Stop making this MongoDB mistake! Here's what you're doing wrong...",
    problem: "I see developers doing [mistake] all the time. It seems logical, but it causes [problem]...",
    tip: "Instead of [wrong approach], do [correct approach]. The reason is [explanation]. Here's the right way...",
    quickWin: "Avoiding this mistake will prevent [negative outcome] and help you [positive outcome]...",
    cta: "Have you made this mistake? Share your story! What other MongoDB pitfalls should I cover?",
    visualSuggestion: "Show the mistake visually, then the correct approach",
  },
  "best-practice": {
    name: "Best Practice",
    icon: <BestPracticeIcon />,
    description: "Share a recommended practice or pattern",
    category: "Security",
    difficulty: "Intermediate",
    hook: "Here's the MongoDB best practice that changed how I work...",
    problem: "Many teams skip [practice] because [reason], but this leads to [consequence]...",
    tip: "The best practice is [practice]. Here's how to implement it: [steps]. This matters because [importance]...",
    quickWin: "Following this practice will [benefit]. Teams that adopt this see [improvement]...",
    cta: "Do you follow this practice? What other best practices should developers know? Comment below!",
    visualSuggestion: "Show the practice in action or demonstrate the pattern",
  },
};

export default function EpisodeTemplateSelector({ open, onClose, onSelectTemplate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  function handleSelect() {
    if (selectedTemplate) {
      onSelectTemplate(TEMPLATES[selectedTemplate]);
      setSelectedTemplate(null);
      onClose();
    }
  }

  function handleClose() {
    setSelectedTemplate(null);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#001E2B" }}>
          Choose a Template
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Start with a pre-filled structure to speed up your episode creation
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {Object.entries(TEMPLATES).map(([key, template]) => (
            <Paper
              key={key}
              onClick={() => setSelectedTemplate(key)}
              sx={{
                p: 2,
                cursor: "pointer",
                border: selectedTemplate === key ? "2px solid #00684A" : "2px solid transparent",
                backgroundColor: selectedTemplate === key ? "#E6F7F0" : "#FFFFFF",
                "&:hover": {
                  backgroundColor: selectedTemplate === key ? "#E6F7F0" : "#F7FAFC",
                  borderColor: selectedTemplate === key ? "#00684A" : "#E2E8F0",
                },
                transition: "all 0.2s",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    color: "#00684A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: selectedTemplate === key ? "#00684A" : "#E6F7F0",
                    color: selectedTemplate === key ? "#FFFFFF" : "#00684A",
                  }}
                >
                  {template.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
                      {template.name}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={template.category}
                        size="small"
                        sx={{ fontSize: "0.7rem", height: "20px" }}
                      />
                      <Chip
                        label={template.difficulty}
                        size="small"
                        sx={{ fontSize: "0.7rem", height: "20px" }}
                      />
                    </Stack>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: "0.875rem" }}>
                    {template.description}
                  </Typography>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      backgroundColor: "#F7FAFC",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#5F6C76", display: "block", mb: 0.5 }}>
                      Hook Preview:
                    </Typography>
                    <Typography variant="caption" sx={{ fontStyle: "italic", color: "#001E2B" }}>
                      "{template.hook}"
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSelect}
          disabled={!selectedTemplate}
          sx={{
            backgroundColor: "#00684A",
            "&:hover": { backgroundColor: "#004D37" },
            fontWeight: 600,
          }}
        >
          Use Template
        </Button>
      </DialogActions>
    </Dialog>
  );
}

