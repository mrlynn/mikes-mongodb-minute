# Episode Detail Page & Resource Architecture

This document summarizes the implementation plan for the **Mike’s MongoDB Minute** episode detail pages and supporting resources.

## Core Goals
- Provide meaningful, expanded content beyond the short-form video.
- Include runnable examples and code snippets hosted in dedicated GitHub repos.
- Capture developer intent and measure real engagement.
- Enable smooth cross-linking between episodes, tools, and sample apps.
- Maintain a consistent, reusable structure for all episodes.

## 1. Hero Section
A simple header including:
- Embedded video
- Title
- Category badge
- Difficulty level
- One-sentence summary

## 2. Deep-Dive Write-Up
Includes:
- Technical walkthrough
- Key concept callout boxes
- Step-by-step breakdown
- Optional diagrams or JSON samples

## 3. GitHub Integration & Code Snippets
Each episode has its own GitHub repo:

Repo structure example:
```
/README.md
/examples
/snippets
/datasets
/assets
```

Episode page includes:
- Copy-to-clipboard code blocks
- Jump-to-GitHub buttons
- Version notes

## 4. Optional Schema Explorer
- JSON viewer
- Index examples
- Schema variations

## 5. Downloadable Resources
- ZIP example bundle
- PDF reference
- JSON seed data
- Markdown quick guides

## 6. Cross-Linking & Learning Paths
- Related episodes
- Long-form articles
- Docs links
- Sample apps

## 7. Notes From Mike (Optional)
- Why the episode exists
- Real-world stories
- FAQs

## 8. MongoDB Schema for Episode Metadata
Suggested structure:
```json
{
  "episodeId": 42,
  "title": "Why Compound Index Order Matters",
  "category": "Query Performance & Indexing",
  "difficulty": "Intermediate",
  "githubRepo": "https://github.com/mrlynn/mongodb-minute-42",
  "resources": [
    {
      "type": "code",
      "title": "Aggregation pipeline example",
      "path": "examples/pipeline.js"
    }
  ],
  "transcript": "...",
  "deepDive": "...",
  "tags": ["indexing", "performance"]
}
```

## 9. Developer Intent & Analytics
Track events:
- Code snippet copies
- GitHub outbound clicks
- Transcript views
- Deep-dive dwell time
- Searches
- Feedback helpfulness

## 10. Optional “Try It Yourself” Integrations
- Launch Codespaces button
- MongoDB sandbox
- StackBlitz/CodeSandbox REPL
- Atlas starter link

## Summary
The episode detail page becomes a self-contained developer learning module with deep dives, repos, analytics, and hands-on pathways.
