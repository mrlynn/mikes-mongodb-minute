# MongoDB Minute App - Capabilities Summary

## Overview
A Next.js application for creating, managing, and displaying 60-second MongoDB educational video content with a focus on clean UX and content management.

## Public-Facing Features

### Home Page (`/`)
- **Episode Grid Display**: Responsive CSS Grid layout showing all episodes as uniform-height cards
- **Search Functionality**: Full-text search across episode titles, descriptions, categories, and difficulty levels
- **Category Filtering**: Filter episodes by category (Data Modeling, Indexing, Atlas, Vector & AI, Atlas Search, Aggregation, Security, Migration)
- **Difficulty Filtering**: Filter by Beginner, Intermediate, or Advanced levels
- **Episode Cards**:
  - Fixed height (380px) for consistent alignment
  - Episode number, category, and difficulty badges
  - Title (2-line truncation)
  - Hook/description (3-line truncation)
  - "View Details" button
  - Text wrapping to prevent layout breaks
  - Color-coded category accent bars

### Episode Detail Page (`/episodes/[slug]`)
- **Embedded Video Player**: Responsive 16:9 YouTube video embed
- **Episode Information**:
  - Episode number, category, and difficulty badges
  - Title and hook/description
- **Learning Content Section**:
  - "The Challenge" - Problem statement
  - "The Solution" - Detailed tip/solution
  - "Key Takeaway" - Highlighted quick win
- **Social Media Links**: Buttons for YouTube, TikTok, LinkedIn, Instagram, and X (Twitter)
- **Navigation**: Back to home page button

### Navigation
- **Header**:
  - Logo (stopwatch with MongoDB leaf)
  - "MongoDB Minute" branding
  - Admin link
  - Mobile-responsive menu

## Admin Features (Authentication Required)

### Authentication System
- **Magic Link Login**: Email-based passwordless authentication
- **Email Restrictions**: MongoDB.com email addresses only
- **JWT Tokens**:
  - 15-minute magic link expiration
  - 7-day session tokens
  - Clock skew tolerance (60 seconds)
- **Middleware Protection**: Routes protected with Node.js runtime middleware
- **Email Service**: Nodemailer with Gmail SMTP

### Admin Dashboard (`/admin/episodes`)
- **Episode Table** (Desktop view):
  - Sortable columns: Episode #, Title, Category, Difficulty, Status
  - Edit and Delete actions
  - Status color coding (Draft, Ready to Record, Recorded, Published)
  - Hover effects
- **Card View** (Mobile view):
  - Responsive card layout for screens < 900px
  - Full episode information
  - Edit and Delete buttons
- **Create New Episode**: Button to add new episodes
- **Delete Confirmation**: Dialog to prevent accidental deletions

### Episode Editor (`/admin/episodes/[id]`)
- **60-Second Script Structure**:
  - Hook (0-5s)
  - Problem/Context (5-15s)
  - Tip/Solution (15-45s)
  - Quick Win/Proof (45-52s)
  - CTA + Tease (52-60s)
- **Metadata Fields**:
  - Episode number
  - Title and slug (auto-generated)
  - Category dropdown
  - Difficulty level
  - Status (Draft, Ready to Record, Recorded, Published)
  - Video URL
  - Visual suggestions
- **Social Media Links**: YouTube, TikTok, LinkedIn, Instagram, X
- **Auto-save**: Form persistence
- **Validation**: Required field checks

### Teleprompter View (`/admin/teleprompter/[id]`)
- **Recording Interface**: Full-screen script display for video recording
- **Script Sections**: All 5 sections of the 60-second format
- **Clean Layout**: Optimized for reading while recording

### Episode Creation (`/admin/episodes/new`)
- **New Episode Form**: Same structure as editor
- **Auto-slug Generation**: Creates URL-friendly slug from title
- **Default Values**: Pre-set status and metadata

## Technical Features

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Breakpoints**:
  - xs: < 600px (mobile)
  - sm: 600-900px (tablet)
  - md: 900px+ (desktop)
- **CSS Grid**: Equal-height cards with `gridAutoRows: "1fr"`
- **Text Wrapping**: Word-break handling for long content

### Database & API
- **MongoDB**: Document storage with Mongoose ODM
- **API Routes**:
  - `GET /api/episodes` - List all episodes
  - `GET /api/episodes/[id]` - Get single episode
  - `POST /api/episodes` - Create episode
  - `PUT /api/episodes/[id]` - Update episode
  - `DELETE /api/episodes/[id]` - Delete episode
  - `POST /api/auth/request-link` - Request magic link
  - `GET /api/auth/verify` - Verify magic link token
  - `POST /api/auth/logout` - Logout user

### Styling & UI
- **Material-UI (MUI)**: Component library
- **Custom Theme**: MongoDB brand colors
  - Primary Green: `#00684A`
  - Accent Green: `#00ED64`
  - Dark Text: `#001E2B`
  - Gray Text: `#5F6C76`
  - Light Backgrounds: `#EDF2F7`, `#E2E8F0`
- **Typography**: System font stack for performance
- **Consistent Spacing**: 8px grid system

### Performance & SEO
- **Next.js 16**: App Router with Turbopack
- **Dynamic Routes**: Server-side rendering
- **Image Optimization**: Next.js Image component
- **Metadata**: SEO-friendly titles and descriptions

### Data Structure
```javascript
Episode Schema:
- episodeNumber: Number
- title: String (required)
- slug: String (unique, indexed)
- category: String (required)
- difficulty: String (required)
- status: String (default: "draft")
- hook: String
- problem: String
- tip: String
- quickWin: String
- cta: String
- visualSuggestion: String
- videoUrl: String
- socialLinks: Object (youtube, tiktok, linkedin, instagram, x)
- createdAt: Date
- updatedAt: Date
```

### Environment Configuration
- Dynamic base URLs (handles multiple dev ports)
- JWT secret management
- Email credentials (Gmail SMTP)
- MongoDB connection string
- Timezone configuration

## Key Workflows

### Content Creator Workflow
1. Login with magic link (MongoDB email)
2. Create new episode in admin panel
3. Fill out 60-second script structure
4. Add metadata and links
5. Set status to "Ready to Record"
6. Use teleprompter for recording
7. Upload video and add URL
8. Set status to "Published"

### Visitor Workflow
1. Browse episodes on home page
2. Filter by category or difficulty
3. Search for specific topics
4. Click to view episode details
5. Watch embedded video
6. Read learning content
7. Access social media links

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive from 320px to 4K displays

## Security Features
- Email domain validation
- JWT token expiration
- HTTP-only cookies
- Secure flag in production
- Middleware route protection
- MongoDB.com email restriction

## Directory Structure
```
mikes-mongodb-minute/
├── app/
│   ├── page.js                    # Home page with episode grid
│   ├── layout.js                  # Root layout with navigation
│   ├── episodes/
│   │   └── [slug]/page.js         # Episode detail view
│   ├── admin/
│   │   ├── layout.js              # Admin layout
│   │   ├── page.js                # Admin dashboard
│   │   ├── episodes/
│   │   │   ├── page.js            # Episode list/table
│   │   │   ├── new/page.js        # Create episode
│   │   │   └── [id]/page.js       # Edit episode
│   │   └── teleprompter/
│   │       └── [id]/page.js       # Recording view
│   ├── login/page.js              # Magic link login
│   ├── auth/
│   │   └── verify/page.js         # Magic link verification
│   └── api/
│       ├── episodes/
│       │   ├── route.js           # GET/POST episodes
│       │   └── [id]/route.js      # GET/PUT/DELETE episode
│       └── auth/
│           ├── request-link/      # Request magic link
│           ├── verify/            # Verify token
│           └── logout/            # Logout
├── components/
│   └── EpisodeCard.js             # Reusable episode card
├── lib/
│   ├── mongodb.js                 # MongoDB connection
│   ├── episodes.js                # Episode data access
│   ├── auth.js                    # Auth utilities
│   └── email.js                   # Email sending
├── models/
│   └── Episode.js                 # Mongoose schema
├── middleware.js                  # Auth middleware
└── public/
    └── logo.png                   # App logo
```

## Recent Improvements
- Fixed card alignment with CSS Grid (`gridAutoRows: "1fr"`)
- Added logo to navigation header
- Made admin episodes table mobile responsive
- Redesigned episode detail page for user-focused content
- Consolidated `/episodes` page into home page
- Fixed magic link authentication with clock skew tolerance
- Fixed middleware to use Node.js runtime instead of Edge

---

**Technology Stack**:
- Next.js 16.0.6 (App Router + Turbopack)
- React 19
- Material-UI (MUI) 6
- MongoDB + Mongoose
- JWT for authentication
- Nodemailer for email

**Version**: 1.0
**Last Updated**: December 2025
