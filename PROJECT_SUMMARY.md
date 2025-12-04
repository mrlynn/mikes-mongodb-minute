# Mike's MongoDB Minute - Project Summary

**Status**: Phase 1 Complete + Enhanced Features ✅
**Last Updated**: December 4, 2025
**Environment**: Development server running on port 3001

## Executive Summary

Mike's MongoDB Minute is a full-stack web application for managing and publishing 60-second educational MongoDB video content. The platform provides a complete content management system with admin CRUD operations, workflow/approval tracking, and a public-facing site for browsing episodes.

**Phase 1 Deliverables**: All core features implemented and functional, plus enhanced workflow system for content quality control.

---

## Technical Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | Next.js | 16.0.6 | React framework with App Router |
| UI Library | Material UI | 7.3.6 | Component library and theming |
| Database | MongoDB Atlas | - | Cloud-hosted NoSQL database |
| Driver | MongoDB Native | 7.0.0 | Official Node.js driver |
| Runtime | Node.js | 18+ | JavaScript runtime |
| Deployment | Vercel | - | Hosting platform (configured) |

### Key Dependencies

```json
{
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1",
  "@mui/icons-material": "^7.3.6",
  "@mui/material": "^7.3.6",
  "mongodb": "^7.0.0",
  "next": "16.0.6",
  "react": "19.2.0",
  "react-dom": "19.2.0"
}
```

---

## Architecture Overview

### Application Structure

```
mikes-mongodb-minute/
├── app/                        # Next.js App Router
│   ├── admin/                  # Admin interface (protected)
│   │   ├── page.js            # Dashboard with statistics and review queue
│   │   ├── settings/page.js   # User settings page
│   │   └── episodes/
│   │       ├── page.js        # Episode management table
│   │       ├── new/page.js    # Create episode form
│   │       └── [id]/page.js   # Edit episode form with workflow panel
│   ├── episodes/              # Public interface
│   │   ├── page.js            # Browse all published episodes
│   │   └── [slug]/page.js     # Individual episode detail
│   ├── api/                   # REST API
│   │   ├── episodes/
│   │   │   ├── route.js       # GET (list), POST (create with workflow)
│   │   │   └── [id]/
│   │   │       ├── route.js   # GET, PUT, DELETE by ID
│   │   │       ├── qrcode/route.js         # QR code generation
│   │   │       └── workflow/
│   │   │           ├── submit-review/route.js  # Submit for tech review
│   │   │           ├── review/route.js         # Approve/request changes
│   │   │           └── approve/route.js        # Final approval
│   │   └── user/
│   │       └── settings/route.js  # User settings management
│   ├── layout.js              # Root layout (client component)
│   └── page.js                # Home page (latest episodes)
├── components/
│   ├── EpisodeCard.js         # Reusable episode preview card with workflow badges
│   ├── EpisodeForm.js         # Comprehensive episode form
│   ├── WorkflowStatus.js      # Workflow management component (310+ lines)
│   └── AIGenerateDialog.js    # AI episode generation dialog
├── lib/
│   ├── mongodb.js             # Database connection pooling
│   ├── episodes.js            # Database operations layer (includes workflow functions)
│   ├── auth.js                # JWT authentication utilities
│   └── email.js               # Email service for notifications
├── .env.local                 # Environment variables (not in git)
└── public/                    # Static assets
```

### Design Patterns

- **App Router**: Server-side rendering by default with `force-dynamic` for real-time data
- **Client Components**: Used only where interactivity required (`"use client"` directive)
- **API Layer**: RESTful endpoints following Next.js conventions
- **Data Layer**: Centralized MongoDB operations in `lib/episodes.js`
- **Component Reuse**: Shared EpisodeForm for create/edit operations

---

## Database Schema

### Collection: `episodes`

```javascript
{
  _id: ObjectId,                    // MongoDB-generated ID
  episodeNumber: Number,            // Sequential episode number (optional)
  title: String,                    // Episode title (required)
  slug: String,                     // URL-friendly slug (auto-generated if empty)
  category: String,                 // One of 9 predefined categories (required)
  difficulty: String,               // Beginner | Intermediate | Advanced (required)
  status: String,                   // draft | ready-to-record | recorded | published

  // 60-second script structure
  hook: String,                     // 0-5 seconds: Opening hook (required)
  problem: String,                  // 5-15 seconds: Problem/context (required)
  tip: String,                      // 15-45 seconds: Core solution (required)
  quickWin: String,                 // 45-52 seconds: Result/benefit (required)
  cta: String,                      // 52-60 seconds: Call to action (required)

  visualSuggestion: String,         // Production notes for video
  videoUrl: String,                 // Primary video URL

  socialLinks: {                    // Platform-specific URLs
    youtube: String,
    tiktok: String,
    linkedin: String,
    instagram: String,
    x: String
  },

  // Workflow tracking (NEW)
  workflow: {
    currentStage: String,           // draft | tech-review | approved
    draftedBy: {
      email: String,
      name: String,
      timestamp: Date
    },
    submittedForReview: {
      email: String,
      name: String,
      timestamp: Date
    },
    reviewedBy: {
      email: String,
      name: String,
      timestamp: Date,
      notes: String,
      decision: String              // approved | changes-requested
    },
    approvedBy: {
      email: String,
      name: String,
      timestamp: Date,
      notes: String
    },
    history: [                      // Complete audit trail
      {
        action: String,             // created | submitted-for-review | review-approved |
                                    // changes-requested | approved
        stage: String,              // draft | tech-review | approved
        user: {
          email: String,
          name: String
        },
        timestamp: Date,
        notes: String
      }
    ]
  },

  createdAt: Date,                  // Auto-set on creation
  updatedAt: Date                   // Auto-set on update
}
```

### Collection: `users` (NEW)

```javascript
{
  _id: ObjectId,
  email: String,                    // MongoDB.com email (unique)
  settings: {
    openaiApiKey: String,           // Encrypted API key (optional)
    socialHandles: {                // Social media handles
      youtube: String,
      tiktok: String,
      linkedin: String,
      instagram: String,
      x: String
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Categories (Predefined)

1. Data Modeling
2. Indexing
3. Atlas
4. Vector & AI
5. Atlas Search
6. Aggregation
7. Security
8. Migration
9. New Features

### Recommended Indexes

```javascript
// Unique slug for URL routing
db.episodes.createIndex({ slug: 1 }, { unique: true })

// Query optimization for admin list
db.episodes.createIndex({ status: 1, episodeNumber: 1 })

// Public filtering by category
db.episodes.createIndex({ category: 1 })

// Latest episodes query
db.episodes.createIndex({ status: 1, createdAt: -1 })

// Workflow stage queries (NEW)
db.episodes.createIndex({ "workflow.currentStage": 1 })

// Review queue queries (NEW)
db.episodes.createIndex({ "workflow.currentStage": 1, "workflow.submittedForReview.timestamp": 1 })

// User email lookup (NEW)
db.users.createIndex({ email: 1 }, { unique: true })
```

---

## API Reference

### Base URL
- **Development**: `http://localhost:3001/api`
- **Production**: `https://<your-domain>/api`

### Endpoints

#### `GET /api/episodes`
List all episodes.

**Query Parameters**: None (currently returns all episodes)

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "episodeNumber": 1,
    "title": "Understanding Embedded Documents",
    "slug": "understanding-embedded-documents",
    "category": "Data Modeling",
    "difficulty": "Beginner",
    "status": "published",
    "hook": "Did you know most MongoDB performance issues...",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
]
```

#### `GET /api/episodes/[id]`
Get single episode by MongoDB ObjectId.

**Response**: Single episode object or 404

#### `POST /api/episodes`
Create new episode.

**Request Body**:
```json
{
  "episodeNumber": 1,
  "title": "Understanding Embedded Documents",
  "category": "Data Modeling",
  "difficulty": "Beginner",
  "status": "draft",
  "hook": "...",
  "problem": "...",
  "tip": "...",
  "quickWin": "...",
  "cta": "..."
}
```

**Response**: Created episode with 201 status

#### `PUT /api/episodes/[id]`
Update existing episode.

**Request Body**: Partial or complete episode object

**Response**: Updated episode object

#### `DELETE /api/episodes/[id]`
Delete episode by ID.

**Response**: `{ "ok": true }`

#### `POST /api/episodes/[id]/workflow/submit-review` (NEW)
Submit episode for technical review.

**Authentication**: Required (JWT)

**Response**:
```json
{
  "success": true,
  "episode": { /* updated episode with workflow.currentStage: "tech-review" */ }
}
```

#### `POST /api/episodes/[id]/workflow/review` (NEW)
Perform technical review (approve or request changes).

**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "decision": "approved", // or "changes-requested"
  "notes": "Looks good, minor typo fixed"
}
```

**Response**:
```json
{
  "success": true,
  "episode": { /* updated episode */ }
}
```

#### `POST /api/episodes/[id]/workflow/approve` (NEW)
Final approval for recording.

**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "notes": "Ready for recording"
}
```

**Response**:
```json
{
  "success": true,
  "episode": { /* updated episode with workflow.currentStage: "approved" */ }
}
```

#### `GET /api/episodes/[id]/qrcode` (NEW)
Generate QR code for episode detail page.

**Query Parameters**:
- `size` (number, optional): QR code size in pixels (default: 256)

**Response**: QR code as SVG image

#### `GET /api/user/settings` (NEW)
Get current user settings.

**Authentication**: Required (JWT)

**Response**:
```json
{
  "email": "user@mongodb.com",
  "settings": {
    "openaiApiKey": "sk-...",
    "socialHandles": { /* social media handles */ }
  }
}
```

#### `PUT /api/user/settings` (NEW)
Update user settings.

**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "openaiApiKey": "sk-...",
  "socialHandles": {
    "youtube": "@username",
    "tiktok": "@username"
  }
}
```

**Response**: Updated user settings object

---

## Component Reference

### `<EpisodeCard episode={episode} />`
**Location**: `components/EpisodeCard.js`

Displays episode preview with:
- Episode number badge
- Category badge
- Workflow status badge (Draft/In Review/Approved)
- Title
- Hook preview (truncated)
- Social media link buttons
- "View script" link

**Props**:
- `episode` (object): Episode data from database

**Usage**: Home page, episodes listing page, admin dashboard

---

### `<EpisodeForm initialData={episode} onSubmit={handleSubmit} submitLabel="Save" />`
**Location**: `components/EpisodeForm.js`

Comprehensive form for creating/editing episodes.

**Features**:
- Basic info: Episode #, title, slug, category, difficulty, status
- Script sections: Hook, Problem, Tip, Quick Win, CTA (with time markers)
- Visual suggestions
- Video URL
- Social media links (5 platforms)
- Auto-slug generation from title
- Form validation (required fields)

**Props**:
- `initialData` (object, optional): Pre-populate form for editing
- `onSubmit` (function): Callback with form data
- `submitLabel` (string): Button text (default: "Save")

**Usage**: `/admin/episodes/new`, `/admin/episodes/[id]`

---

### `<WorkflowStatus episode={episode} onWorkflowUpdate={callback} />` (NEW)
**Location**: `components/WorkflowStatus.js`

Complete workflow management interface for episode approval process.

**Features**:
- Visual progress stepper showing current workflow stage
- Stage-specific action buttons:
  - Draft stage: "Submit for Review" button
  - Tech Review stage: "Approve" and "Request Changes" buttons
  - Approved stage: Completion indicator
- Complete workflow history timeline with:
  - Action types (created, submitted, approved, changes requested)
  - User attribution (name and email)
  - Timestamps
  - Review notes
- Review and approval dialogs with notes fields
- Real-time UI updates without page reload
- MongoDB brand colors for each stage:
  - Draft: Grey (#5F6C76)
  - Tech Review: Blue (#0077B5)
  - Approved: Green (#00684A)
- QR code display and download for episode link

**Props**:
- `episode` (object, required): Episode data with workflow field
- `onWorkflowUpdate` (function, required): Callback with updated episode data

**Usage**: `/admin/episodes/[id]` (edit page)

**Workflow Stages**:
1. **Draft**: Initial creation state
2. **Tech Review**: Submitted for technical accuracy review
3. **Approved**: Final approval, ready for recording

**Actions**:
- `submitForReview()`: Moves from draft to tech-review
- `reviewEpisode(decision, notes)`: Approve or request changes
- `approveEpisode(notes)`: Final approval

**Component Size**: 310+ lines with complete state management

---

## Key Implementation Details

### Database Connection (lib/mongodb.js)

**Pattern**: Singleton with connection pooling

```javascript
// Global caching in development to prevent connection exhaustion
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}

// Export helper function
export async function getDb() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "mikes_mongodb_minute");
}
```

**Why**: Prevents connection pool exhaustion during Next.js hot reloading in development.

---

### Data Layer (lib/episodes.js)

**Core Functions**:

```javascript
listEpisodes({ publishedOnly = false })  // Query all or published only
getEpisodeById(id)                       // Fetch by ObjectId
getEpisodeBySlug(slug)                   // Fetch by slug (for URLs)
createEpisode(data)                      // Insert with timestamps
updateEpisode(id, data)                  // Update with timestamp
deleteEpisode(id)                        // Remove by ObjectId
slugify(str)                             // Convert title to slug
```

**Workflow Functions (NEW)**:

```javascript
initializeWorkflow(episodeId, user)     // Set up workflow on episode creation
                                        // - Sets currentStage to "draft"
                                        // - Records draftedBy user info
                                        // - Creates initial history entry

submitForReview(episodeId, user)        // Submit episode for technical review
                                        // - Moves to "tech-review" stage
                                        // - Records submittedForReview user info
                                        // - Adds "submitted-for-review" history entry

reviewEpisode(id, user, decision, notes) // Perform technical review
                                         // - decision: "approved" or "changes-requested"
                                         // - If changes requested, moves back to "draft"
                                         // - Records reviewedBy user info with notes
                                         // - Adds history entry with decision

approveEpisode(episodeId, user, notes)  // Final approval for recording
                                        // - Moves to "approved" stage
                                        // - Records approvedBy user info with notes
                                        // - Adds "approved" history entry
```

**Auth & User Functions**:

```javascript
getUserByEmail(email)                   // Fetch user settings by email
updateUserSettings(email, settings)     // Update user preferences and API keys
```

**Note**: All functions are async and return promises. Workflow functions require authenticated user object with `email` and `name` fields.

---

### Client vs Server Components

**Server Components** (default):
- `app/page.js` - Home page with metadata
- `app/episodes/page.js` - Episodes list
- `app/episodes/[slug]/page.js` - Episode detail

**Client Components** (`"use client"`):
- `app/layout.js` - Uses Material UI ThemeProvider
- `app/admin/page.js` - Dashboard with statistics and review queue
- `app/admin/episodes/page.js` - Interactive table with delete dialog
- `app/admin/episodes/new/page.js` - Form with router navigation
- `app/admin/episodes/[id]/page.js` - Form with data fetching and workflow panel
- `app/admin/settings/page.js` - User settings form
- `components/EpisodeCard.js` - Uses Link component with workflow badges
- `components/EpisodeForm.js` - Complex form state
- `components/WorkflowStatus.js` - Workflow management with dialogs (NEW)
- `components/AIGenerateDialog.js` - AI generation dialog

---

## Material UI Theme Configuration

**Primary Color**: `#10A84F` (MongoDB Green)
**Secondary Color**: `#25313C` (Dark Gray)

**Applied via**:
```javascript
const theme = createTheme({
  palette: {
    primary: { main: "#10A84F" },
    secondary: { main: "#25313C" },
  },
});
```

**Status Colors**:
- Draft: `warning` (orange)
- Ready-to-record: `info` (blue)
- Recorded: `secondary` (gray)
- Published: `success` (green)

---

## Environment Variables

Required in `.env.local` (development) and Vercel (production):

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Database Name (optional, defaults to "mikes_mongodb_minute")
MONGODB_DB=mikes_mongodb_minute
```

**Security Note**: `.env.local` is gitignored. Never commit credentials.

---

## Current Limitations & Known Issues

### Phase 1 Limitations (By Design)

1. **Authentication**: JWT-based with MongoDB.com email restriction ✅
   - **Implemented**: Magic link authentication
   - **Restriction**: MongoDB.com email addresses only
   - **Note**: Workflow system requires authentication for all actions

2. **No Pagination**: All episodes loaded at once
   - **Acceptable for**: <100 episodes
   - **Roadmap**: Add pagination in Phase 2 when needed

3. **No Search/Filter**: Category chips are display-only
   - **Roadmap**: Client-side filtering in Phase 2

4. **No Image Uploads**: Video URLs only (external hosting)
   - **Acceptable**: Videos hosted on social platforms
   - **Roadmap**: Consider Cloudinary integration in Phase 3

### Technical Considerations

1. **Slug Conflicts**: Auto-generated slugs may collide
   - **Current**: Manual override available in form
   - **Future**: Add uniqueness validation feedback

2. **Turbopack Warning**: Multiple lockfiles detected
   - **Impact**: None (cosmetic warning)
   - **Fix**: Clean up parent directory lockfiles if needed

3. **Port Collision**: Dev server uses next available port
   - **Impact**: May run on 3001+ if 3000 in use
   - **Fix**: Stop conflicting process or update URLs

---

## Testing Checklist

### Admin Interface
- [ ] Dashboard loads with correct statistics
- [ ] Create new episode with all fields
- [ ] Edit existing episode
- [ ] Delete episode with confirmation
- [ ] Status workflow (draft → ready → recorded → published)
- [ ] Auto-slug generation from title
- [ ] Form validation on required fields

### Public Interface
- [ ] Home page shows latest 6 published episodes only
- [ ] Episodes page lists all published episodes
- [ ] Episode detail page displays full script structure
- [ ] Social media links open in new tabs
- [ ] Category chips display correctly
- [ ] Navigation between pages works

### API
- [ ] GET /api/episodes returns all episodes
- [ ] GET /api/episodes/[id] returns single episode
- [ ] POST /api/episodes creates with timestamps
- [ ] PUT /api/episodes/[id] updates with new timestamp
- [ ] DELETE /api/episodes/[id] removes episode

### Database
- [ ] MongoDB connection established
- [ ] Episodes collection created
- [ ] Indexes created (recommended)
- [ ] Slugs are unique
- [ ] Timestamps auto-populate

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables documented
- [ ] MongoDB indexes created
- [ ] .gitignore includes .env.local
- [ ] Production build succeeds (`npm run build`)

### Vercel Setup
- [ ] Repository connected
- [ ] Environment variables added
- [ ] Build settings configured
- [ ] Custom domain (optional)
- [ ] Admin protection enabled

### Post-Deployment
- [ ] All routes accessible
- [ ] Database connection working
- [ ] Admin interface protected
- [ ] SEO metadata verified
- [ ] Mobile responsive check

---

## Performance Considerations

### Current Implementation
- **Rendering**: Server-side with `force-dynamic` for fresh data
- **Database**: Single query per page load
- **Caching**: None (intentional for admin workflow)

### Optimization Opportunities (Phase 2+)
1. **Static Generation**: Use `revalidate` for published episodes
2. **ISR**: Incremental Static Regeneration for public pages
3. **Edge Caching**: Cache published episodes at CDN
4. **Pagination**: Reduce payload for large datasets
5. **Indexes**: MongoDB query optimization with compound indexes

---

## Code Quality & Standards

### File Naming
- **Pages**: `page.js` (Next.js convention)
- **Components**: PascalCase (e.g., `EpisodeCard.js`)
- **Utilities**: camelCase (e.g., `mongodb.js`, `episodes.js`)

### Code Style
- ES6+ syntax (async/await, arrow functions, destructuring)
- Functional components with hooks
- No PropTypes (consider TypeScript in Phase 3)
- Comments for complex logic only

### Git Workflow
- `.gitignore` configured for Next.js, Node, and environment files
- Initial commit completed
- Feature branches recommended for Phase 2+

---

## Troubleshooting Guide

### "MongoDB connection failed"
**Symptoms**: API errors, pages fail to load
**Solutions**:
1. Verify `MONGODB_URI` in `.env.local`
2. Check network access in Atlas (whitelist IPs)
3. Test connection string in MongoDB Compass
4. Ensure database user has correct permissions

### "Cannot find module" errors
**Symptoms**: Build or runtime errors
**Solutions**:
1. Run `npm install`
2. Delete `node_modules` and reinstall
3. Clear Next.js cache: `rm -rf .next`

### Admin routes showing client/server errors
**Symptoms**: Functions cannot be passed to client components
**Solutions**:
1. Ensure `"use client"` directive on interactive pages
2. Don't pass Link component directly to Material UI
3. Fetch data client-side for interactive pages

### Slugs not generating
**Symptoms**: Empty slug field after creating episode
**Solutions**:
1. Check `slugify()` function in `lib/episodes.js`
2. Ensure title is provided
3. Manually specify slug in form if auto-generation fails

---

## Completed Features ✅

### Phase 1 Enhanced Features (Completed)
- ✅ **Authentication**: JWT-based magic link authentication with MongoDB.com email restriction
- ✅ **Workflow System**: 3-stage approval process (Draft → Tech Review → Approved)
- ✅ **Review Queue**: Admin dashboard with pending reviews and notification badges
- ✅ **User Attribution**: Complete audit trail tracking who did what and when
- ✅ **QR Code Generation**: Automatic QR codes for episode detail pages
- ✅ **User Settings**: API key management and social media handle configuration
- ✅ **AI Integration**: OpenAI script generation with configurable API keys
- ✅ **Social Media Links**: Platform-specific buttons and icons on episode cards
- ✅ **Sequential Navigation**: Breadcrumbs and prev/next episode navigation

## Future Roadmap

### Phase 2 (Planned)
- **Enhanced Analytics**: View counts, workflow completion time metrics
- **Video Embeds**: Iframe/player components for each platform
- **Search & Filter**: Client-side filtering by category, difficulty, workflow status
- **Pagination**: Load episodes in batches for better performance
- **Email Notifications**: Alert users when episodes need review
- **Slack Integration**: Post workflow updates to Slack channels

### Phase 3 (Planned)
- **Advanced Analytics**: Engagement metrics, user activity tracking
- **Automation**: Social media posting via APIs
- **Dark Mode**: Theme toggle with persistent preference
- **RSS Feed**: Syndication for subscribers
- **TypeScript**: Gradual migration for type safety
- **Role-Based Permissions**: Separate reviewer and approver roles
- **Batch Operations**: Bulk episode status updates

---

## Contact & Support

### Documentation
- **README.md**: Usage guide and quick start
- **DEPLOYMENT.md**: Vercel deployment instructions
- **PID.md**: Original project requirements
- **instructions.md**: Content strategy and structure

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI Components](https://mui.com/material-ui/getting-started/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Vercel Deployment](https://vercel.com/docs)

### Project Status
- **Current Version**: 0.1.0 (Phase 1 Complete)
- **Repository**: [Your GitHub URL]
- **Live Demo**: [Your Vercel URL]
- **Development Server**: `http://localhost:3001` (running)

---

## Quick Reference

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Access Points
- Home: `http://localhost:3001/`
- Admin: `http://localhost:3001/admin`
- API: `http://localhost:3001/api/episodes`

### Key Files for Engineers
| File | Purpose | Type |
|------|---------|------|
| `lib/mongodb.js` | Database connection | Utility |
| `lib/episodes.js` | CRUD operations | Data layer |
| `app/api/episodes/route.js` | List & create API | API route |
| `components/EpisodeForm.js` | Main form component | Component |
| `app/admin/page.js` | Dashboard | Page |

---

**Document Version**: 1.1
**Generated**: December 4, 2025
**Maintained By**: Development Team
**Changes in v1.1**: Added workflow/approval system, review queue, QR codes, user settings, and enhanced navigation features
