PID.md

Mike’s MongoDB Minute Platform

Project Title
Mike’s MongoDB Minute (MMM)

Project Summary
Mike’s MongoDB Minute is a 60-second educational video series published to TikTok, YouTube Shorts, LinkedIn, X, and Instagram.
This project creates a dedicated web application using Next.js, MongoDB Atlas, and Material UI.
The app will provide an admin interface for creating and managing episodes, and a public interface for browsing and reading them.

Objectives
	1.	Allow Mike to create, edit, organize, and publish episodes through a simple admin UI.
	2.	Store structured metadata and the full script of each episode in MongoDB.
	3.	Provide a public-facing site where users can browse and read every episode.
	4.	Offer searchability, shareability, and an SEO surface for the series.
	5.	Build a scalable foundation for future expansion (AI generation, analytics, etc.).

Success Metrics
	•	All episode content is stored and editable through the admin UI.
	•	Episodes appear instantly on the public site when marked published.
	•	Workflow states are tracked (draft, ready-to-record, recorded, published).
	•	The codebase is clean, simple, and easy for an AI or human engineer to extend.

Scope (In Scope)
	•	Next.js 14+ App Router application
	•	Material UI interface
	•	CRUD operations for episodes
	•	Admin dashboard for content management
	•	Public browsing and episode detail pages
	•	MongoDB Atlas integration using native driver
	•	Basic SEO
	•	Episode status workflow
	•	Social links and video URL fields
	•	Clean, extensible file structure
	•	API routes for Episodes

Scope (Out of Scope for Phase 1)
	•	Authentication
	•	Automated posting to social media
	•	Analytics dashboards
	•	AI script generation inside the UI
	•	Comments or ratings
	•	Dark mode
	•	RSS feed

Technical Architecture
	•	Next.js 14 (App Router)
	•	Material UI (no Tailwind)
	•	MongoDB Atlas
	•	Native MongoDB Node.js driver
	•	API Routes under /app/api
	•	Deployment target: Vercel
	•	.env.local for MongoDB credentials

Data Model (Episode)
Collection name: episodes

Fields:
_id (ObjectId)
episodeNumber (number)
title (string)
slug (string)
category (string)
difficulty (string)
hook (string)
problem (string)
tip (string)
quickWin (string)
cta (string)
visualSuggestion (string)
status (draft, ready-to-record, recorded, published)
videoUrl (string)
socialLinks (object with links for youtube, tiktok, linkedin, instagram, x)
createdAt (date)
updatedAt (date)

Categories
Data Modeling
Indexing
Atlas
Vector & AI
Atlas Search
Aggregation
Security
Migration
New Features

Difficulty Levels
Beginner
Intermediate
Advanced

API Endpoints

Public:
GET /api/episodes
GET /api/episodes/[id]
GET /episodes/[slug] (page)

Admin:
POST /api/episodes
PUT /api/episodes/[id]
DELETE /api/episodes/[id]

Public UI Pages
/ (home page, latest episodes)
/episodes (all episodes)
/episodes/[slug] (full script view)

Admin Pages
/admin (dashboard)
/admin/episodes (list)
/admin/episodes/new (create)
/admin/episodes/[id] (edit)

Non-Functional Requirements
	•	Fast load times
	•	Code must be easily editable by AI agents
	•	No dependency bloat
	•	Clear component boundaries
	•	All content-querying operations must use MongoDB driver directly

Risks
	•	Admin has no authentication in Phase 1; must be protected via Vercel password or IP restriction
	•	Future growth may require pagination
	•	Slug conflicts must be handled on input

Dependencies
	•	MongoDB Atlas cluster
	•	Vercel deployment
	•	Next.js build system
	•	Mike’s 50 episodes for seeding

Phase Plan

Phase 1 (this project)
	•	Scaffold Next.js app
	•	Implement episode data model
	•	Build API endpoints
	•	Build admin CRUD UI
	•	Build public browsing pages
	•	Deploy to Vercel

Phase 2
	•	Add admin authentication (NextAuth with Google)
	•	Add AI draft-generation button
	•	Add video embed components
	•	Add basic search/filter features

Phase 3
	•	Add analytics
	•	Add social publishing workflow
	•	Add dark mode
	•	Add syndication tools

Deliverables
	•	Fully functional Next.js app
	•	MongoDB integration
	•	Admin and public UI
	•	Initial seed script (optional next step)
	•	Vercel deployment instructions