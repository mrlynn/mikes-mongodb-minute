# Mike’s MongoDB Minute
## Thumbnail Generation System Rebuild
### Technical Architecture & Implementation Guide (Using @vercel/og)

## 1. Purpose
This document provides all guidance required to rebuild the thumbnail generation system from scratch using **@vercel/og**, replacing the previous Sharp-based dynamic system. The new approach emphasizes deterministic layouts, fixed templates, clean variable injection, and predictable brand‑consistent outputs.

---

## 2. Requirements

### Output
- **1280×720 PNG** (YouTube standard)
- Generated via **@vercel/og** (Satori engine)
- Deterministic layout—not algorithmic or dynamic

### Inputs
- Title text  
- Category  
- Selected face pose (transparent PNG)  
- Selected background template  

### Constraints
- No SVG filters (Satori doesn’t support them)
- All styles inline
- Fonts must be embedded or fetched as ArrayBuffer
- Transparent face PNGs must be pre‑processed before injection

---

## 3. System Architecture

```
/public/thumbnail-templates/
  base-dark.png
  base-tech.png
  base-brutalist.png
  brandmark.png

/src/lib/thumbnail/
  templates/
    BaseDarkTemplate.tsx
    BaseTechTemplate.tsx
    BaseBrutalistTemplate.tsx
  face/
    prepareFace.ts
  text/
    wrapTitle.ts
    detectHighlight.ts
    injectHighlight.ts
  generateThumbnail.ts

/pages/api/thumbnails/[episodeId].ts
```

The system is template-driven. No dynamic positioning or auto-layout is used.

---

## 4. Face Preparation Pipeline

Use Sharp **outside** the @vercel/og renderer:

1. Resize to 480×480  
2. Apply circular mask  
3. Output transparent PNG  
4. Convert to data URL for injection into OG template

### Pseudocode
```
sharp(buffer)
  .resize(480, 480, { fit: "cover" })
  .composite([{ input: circleMask, blend: "dest-in" }])
  .png()
  .toBuffer()
```

---

## 5. Title Preparation

### Rules
- Convert to uppercase  
- Wrap across **2–3 lines**  
- Max ~14 characters per line  
- Highlight exactly one keyword (MongoDB green)

### Highlight Terms
```
embedded, index, indexes, indexing,
schema, search, vector, vectors,
aggregation, mongodb, atlas, data, model
```

### Highlight Application
Replace the keyword with:
```
<span style="color:#00ED64">WORD</span>
```

---

## 6. Template Rendering (Using @vercel/og)

Each template is a React component with:
- Background image (PNG)
- Title block area
- Fixed text coordinates
- Category pill in top-left
- Face image on left
- Branding mark bottom-right

### Example Structure
```
<div style="width:1280px;height:720px;background:url('/thumbnail-templates/base-dark.png');">
  <div style="position:absolute;top:60px;left:60px;">CATEGORY</div>
  <img src={faceImage} style="position:absolute;top:180px;left:120px;border-radius:50%;" />
  <div style="position:absolute;top:180px;left:580px;">
     {titleLines}
  </div>
  <img src="/thumbnail-templates/brandmark.png" style="position:absolute;bottom:40px;right:40px;" />
</div>
```

All coordinates remain fixed for every thumbnail.

---

## 7. API Endpoint

Route:  
`/pages/api/thumbnails/[episodeId].ts`

Responsibilities:
1. Fetch face PNG  
2. Process face with Sharp  
3. Compute wrapped + highlighted title  
4. Render template via `new ImageResponse()`  
5. Return PNG buffer  

---

## 8. CMS Requirements

The UI must:
- Limit title length to **40 characters**
- Provide live preview by calling the OG endpoint
- Allow selection of:
  - template
  - face pose
  - background
- Warn when titles exceed recommended length
- Save both `main` and `small` versions

---

## 9. Asset Requirements (from Mike)

You must provide:

### Face poses
Transparent PNG:
- pointing-left
- shocked
- smiling
- thinking
- neutral/presenting

### Background templates
PNG (1280×720):
- base-dark
- base-tech
- base-brutalist

### Colors
- MongoDB Spring Green `#00ED64`
- Evergreen `#023430`
- Slate `#1C1C1C`

---

## 10. Acceptance Tests

A valid thumbnail must:
- Render without layout drift
- Show crisp, legible title words on the right
- Highlight exactly one technical term
- Place face consistently on the left
- Maintain contrast and readability in mobile view
- Contain the category badge and brandmark
- Match the fixed layout spec exactly

---

## 11. Deliverables

The engineer must produce:
- Complete template components
- Face processing pipeline
- Text wrapping + highlighting utilities
- OG renderer implementation
- API endpoint
- CMS preview integration
- Documentation and test fixtures

---

## End of Document
