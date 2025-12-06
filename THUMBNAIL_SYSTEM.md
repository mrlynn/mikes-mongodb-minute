# Thumbnail Image Generator – PID

**Project:** Mike’s MongoDB Minute  
**Feature:** Thumbnail Image Generator  
**Owner:** Michael Lynn (Product) / AI Engineer (Implementation)  
**Status:** Draft  
**Last Updated:** 2025-12-05  

> This PID describes the thumbnail generation feature that lives inside the Mike’s MongoDB Minute platform. The goal is to generate consistent, branded thumbnails that feature Mike’s face and a short, high-impact title with minimal effort.

---

## 1. summary

We’re adding a **Thumbnail Image Generator** to the internal Mike’s MongoDB Minute app.

The feature will:

- Let Mike quickly create **branded, consistent, high-CTR thumbnails** for each episode.
- Combine:
  - Mike’s face (from an uploaded headshot or extracted frame)
  - A short, bold title
  - MongoDB-branded backgrounds and badges
- Render a **16:9 thumbnail image** (PNG/WEBP) that’s stored and associated with the episode record and exposed to:
  - The public web front end (episode listing / watch page)
  - Social media publishing flows (OpenGraph / social share)

---

## 2. problem statement

Right now, thumbnails are:

- Manual
- External to the app
- Inconsistent in style and quality

That slows down publishing and weakens brand recognition. We need a **built-in tool** that:

- Keeps the look and feel consistent across the series.
- Reduces the cognitive and time overhead of thumbnail design.
- Can be reused for future series or other video content.

---

## 3. goals & non-goals

### 3.1 goals

1. **Generate a thumbnail in under 30 seconds**
   - From episode editor to “saved thumbnail” should be a small number of clicks.

2. **Strong, consistent branding**
   - Use MongoDB colors and Mike’s series branding.
   - Maintain layout consistency (face + title + badges).

3. **Support basic automation**
   - AI-suggested titles based on episode metadata.
   - Optional AI-selected background from a small, curated prompt set.

4. **Integrate with existing system**
   - Thumbnail metadata and URLs stored in MongoDB alongside the episode.
   - Used in the public UI and in social media publishing.

### 3.2 non-goals

- Full-featured, general-purpose design tool (no Figma/Canva clone).
- Complex multi-layer editing (no manual bezier editing, masking, filters beyond simple presets).
- Video editing or motion graphics (this is **still-image only**).
- A/B testing engine (we can measure click-through, but not building experiment infra in v1).

---

## 4. primary users & use cases

### 4.1 users

1. **Mike (core creator)**
   - Primary user in v1.
   - Needs speed and consistency.

2. **Other MongoDB Developer Advocates (future)**
   - Could reuse the pipeline for their own series.
   - Same generator, different branding presets.

3. **System (background processes)**
   - Auto-generate a default thumbnail when an episode is created or first saved.

### 4.2 core use cases

1. **Create thumbnail during episode creation**
   - While editing an episode, click a “Thumbnail” tab, generate and save.

2. **Regenerate / tweak thumbnail**
   - Re-open an episode, adjust title or layout, re-generate, overwrite existing thumbnail.

3. **Auto-generate default thumbnail**
   - When user doesn’t touch the thumbnail UI, system still generates a basic on-brand thumbnail.

---

## 5. ux overview

### 5.1 entry point

Inside the episode editor:

- Tabs: **Details | Script | Teleprompter | Thumbnail | Publishing**
- Selecting **Thumbnail** shows the generator UI.

### 5.2 thumbnail editor layout

**Left side: Controls**

1. **Face source**
   - Option A: `Upload headshot`
   - Option B: `Pick from video frames` (if raw video is already uploaded)
     - Clicking triggers an API call that extracts 3–5 candidate frames.
     - User picks one.

2. **Title**
   - Text field.
   - Button: `Suggest titles`
     - Calls AI endpoint with current episode title + tags + category.
     - Shows 3–5 suggestions; clicking one fills the field.

3. **Style presets**
   - Layout: `Face left | Face right | Centered face`
   - Theme: `Light | Dark`
   - Category stripe (optional):
     - `Data Modeling`, `Indexing`, `Atlas`, `AI`, `Search`, etc.

4. **Background**
   - `Template` (default; uses pre-defined SVG backgrounds in MongoDB theme)
   - `AI-generated` (optional; background image from model / external service)

5. **Actions**
   - `Generate preview`
   - `Save thumbnail` (writes final to storage + episode doc)
   - `Reset to default`

**Right side: Preview**

- Live preview at 16:9.
- On Generate, show rendered image (or near-final representation).

---

## 6. functional requirements

### 6.1 core

1. **Face selection**
   - Support manual image upload (JPEG/PNG).
   - Optionally support video-frame extraction for episodes that have an attached video file.
   - Auto-crop to a circle or soft-rect with configurable mask.

2. **Title overlay**
   - Max ~40 characters, 1–2 lines.
   - Auto-fit text to avoid overflowing canvas.
   - High-contrast color (white or green) chosen based on background.

3. **Series branding**
   - Place logo (e.g., Mike’s MongoDB Minute stopwatch/clapperboard) in one corner.
   - MongoDB leaf used subtly.
   - Add optional category stripe.

4. **Backgrounds**
   - Provide a set of template backgrounds (SVG/PNG) stored locally.
   - Support AI-generated abstract backgrounds via an image generation API (optional in v1, but design the interface so it’s pluggable).

5. **Image generation**
   - Render final image server-side at:
     - 1280×720 (16:9, HD) primary.
     - 640×360 derived version (for smaller surfaces).
   - Export PNG (primary) and WEBP (optional, for performance).

6. **Storage & linking**
   - Store the thumbnail files in the current file storage strategy (e.g., S3/Cloud/Atlas bucket).
   - Store URLs + metadata in the episode document.

7. **Publishing integration**
   - The public episode listing and detail pages read the thumbnail URL from the episode record.
   - OG tags / social share metadata use this thumbnail by default.

### 6.2 AI-specific requirements

1. **Title suggestion**
   - API endpoint that:
     - Takes episode title, description, tags, and category.
     - Returns 3–5 short, clicky options.
   - Model should avoid:
     - Overly long titles.
     - Clickbait that misrepresents content.

2. **Background suggestion (optional)**
   - Given category + tone, choose:
     - Either a template background.
     - Or an AI prompt to generate an abstract background.
   - Result should remain on-brand: MongoDB greens + tech aesthetic.

---

## 7. non-functional requirements

- **Performance**
  - Initial thumbnail preview generation < 2 seconds for template-based.
  - AI background generation can take longer; show loader and keep it optional.

- **Reliability**
  - If AI services fail, still allow template-based generation.
  - If video frame extraction fails, fallback to upload-only.

- **Security**
  - Uploaded images must be scanned / validated.
  - Limit file size and type.
  - Access to thumbnail generator restricted to authenticated creators.

- **Maintainability**
  - Background templates and layouts should be configurable without code changes where possible (JSON or config file).

---

## 8. architecture overview

### 8.1 frontend (Next.js + MUI)

- **ThumbnailEditor.tsx** (or .jsx)
  - Handles:
    - Upload control, frame picker, title input.
    - Layout/background selectors.
    - Preview render (shows either:
      - A server-rendered image.
      - Or a React mock-up that approximates output).
  - Calls backend via:
    - `/api/thumbnail/preview`
    - `/api/thumbnail/save`
    - `/api/thumbnail/title-suggestions`
    - `/api/thumbnail/extract-frames` (if used).

### 8.2 backend (Node/Express or Next.js API routes)

1. **Image composition**
   - Use **node-canvas**, **sharp**, or **@vercel/og**:
     - Layer background, face, title, logos, category bar.
   - Produce final PNG/WEBP.

2. **AI integration**
   - Title suggestion:
     - Calls LLM provider with strict prompt to enforce short, high-impact titles.
   - Background generation:
     - Optional integration with an image generation provider.
     - Cache results to avoid re-generation for the same config.

3. **Storage**
   - Use existing storage mechanism (e.g., S3-like bucket).
   - After `save`, write resulting URLs to episode doc in MongoDB.

---

## 9. data model changes

Assuming an `episodes` collection, add a `thumbnail` sub-document.

```js
// episodes document (partial) – /db/episodes
{
  _id: ObjectId("..."),
  title: "Stop abusing your indexes",
  slug: "stop-abusing-your-indexes",
  // ...
  thumbnail: {
    status: "ready" | "pending" | "error",
    mainUrl: "https://cdn.example.com/thumbnails/episode-32-main.png",
    smallUrl: "https://cdn.example.com/thumbnails/episode-32-small.png",
    layout: "face-right",
    theme: "dark",
    backgroundType: "template" | "ai",
    backgroundId: "atlas-grid-01",   // template name OR AI job id
    faceSource: "upload" | "frame",
    faceAssetUrl: "https://cdn.example.com/assets/faces/mike-default.png",
    titleText: "Why the bucket pattern still wins",
    generatedAt: ISODate("..."),
    lastUpdatedAt: ISODate("...")
  }
}

10. api design (v1)

10.1 POST /api/thumbnail/title-suggestions

Input:
{
  "episodeId": "string",
  "title": "string",
  "description": "string",
  "tags": ["string"],
  "category": "data-modeling | indexing | atlas | ai | search | other"
}

Output:

{
  "suggestions": [
    "Why the bucket pattern still wins",
    "Faster writes with one pattern",
    "Fixing noisy IoT data"
  ]
}

10.2 POST /api/thumbnail/preview

Generates a temporary thumbnail (not permanently stored) and returns a URL.

Input:

{
  "episodeId": "string",
  "layout": "face-left",
  "theme": "light",
  "backgroundType": "template",
  "backgroundId": "atlas-grid-01",
  "faceAssetUrl": "https://cdn.example.com/assets/faces/mike.png",
  "titleText": "Stop abusing your indexes",
  "category": "indexing"
}

Output:

{
  "previewUrl": "https://cdn.example.com/tmp/thumbnail-episode-32-preview.png"
}
10.3 POST /api/thumbnail/save

Renders the final version, stores it, and updates the episode doc.

Input: same payload as preview, with maybe an explicit commit: true.

Output:

{
  "mainUrl": "https://cdn.example.com/thumbnails/episode-32-main.png",
  "smallUrl": "https://cdn.example.com/thumbnails/episode-32-small.png",
  "thumbnail": {
    "...": "full thumbnail sub-document"
  }
}

10.4 POST /api/thumbnail/extract-frames (optional)

If episode has a video file, return candidate frame URLs.

Input:
{
  "episodeId": "string",
  "count": 5
}
Output:
{
  "frames": [
    { "timecode": 3.2, "url": "..." },
    { "timecode": 8.7, "url": "..." }
  ]
}
11. analytics & metrics
	•	Track thumbnail generation usage:
	•	Number of thumbnails generated per episode.
	•	Use of AI vs template backgrounds.
	•	Use of AI title suggestions.
	•	Track engagement downstream:
	•	CTR per episode when promoted via social / web listing (if we integrate with publishing metrics).
	•	Compare episodes with custom thumbnails vs default ones.

Even basic logging will help refine layouts and presets later.

⸻

12. dependencies
	•	Existing:
	•	MongoDB Atlas for episodes and assets metadata.
	•	Current storage/CDN for assets.
	•	Next.js / Node runtime.
	•	New:
	•	Image composition library (node-canvas, sharp, or @vercel/og).
	•	Optional video frame extraction library (FFmpeg).
	•	LLM provider for title suggestions.
	•	Optional image generation provider for AI backgrounds.

⸻

13. risks & mitigations
	1.	AI-generated backgrounds off-brand
	•	Mitigation: keep AI background optional and provide curated, MongoDB-branded template backgrounds as the default.
	2.	Complexity creep toward “mini-Canva”
	•	Mitigation: strict scope; only three editable dimensions:
	•	Face
	•	Title
	•	Style preset
	3.	Slow rendering
	•	Mitigation: template-based composition first; AI used for text only in v1 if necessary.
	•	Use caching for repeated previews with same parameters.
	4.	Title suggestions that misrepresent content
	•	Mitigation: conservative prompt + human-in-the-loop (user always chooses final title).

⸻

14. open questions
	1.	Where is video stored and how accessible is it for frame extraction?
	•	If this is non-trivial, we can ship v1 with upload-only face selection.
	2.	Which exact stack for image composition?
	•	@vercel/og vs sharp vs node-canvas.
	•	Decision can be implementation detail, but we should choose one that plays well with our deployment target (Vercel?).
	3.	Do we want multi-variant thumbnails per episode?
	•	v1: one official thumbnail per episode.
	•	Future: support A/B variants.
	4.	Do we want a global “Mike default headshot” asset?
	•	Likely yes. That enables a one-click “use my default face” path for episodes before video is recorded.

⸻

15. implementation notes (for the AI engineer)
	•	Start with template-based generation only:
	•	Hard-code 2–4 layout presets.
	•	Hard-code 3–5 backgrounds using MongoDB colors.
	•	Implement:
	1.	POST /api/thumbnail/preview
	2.	POST /api/thumbnail/save
	3.	Episode schema extension for thumbnail.
	•	Then add:
	•	POST /api/thumbnail/title-suggestions via LLM.
	•	Frame extraction if/when video storage story is clear.

The priority is fast, reliable, repeatable thumbnails that make the series look polished every single time.