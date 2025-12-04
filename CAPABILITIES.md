# MongoDB Minute App - Capabilities Summary

## Overview
A Next.js application for creating, managing, and displaying 60-second MongoDB educational video content with a focus on clean UX, content management, and workflow-based quality control.

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

### Admin Dashboard (`/admin`)
- **Statistics Cards**:
  - Total episodes count
  - Episodes by status (Draft, Ready to Record, Recorded, Published)
  - Episodes by workflow stage (Draft, In Review, Approved)
- **Workflow Statistics**:
  - Visual cards showing workflow stage counts
  - Pulsing notification indicator when reviews are pending
  - Border highlight on "In Review" card when items need attention
- **Review Queue** (NEW):
  - Table showing episodes pending technical review
  - Episode title, category, submitter, and submission date
  - One-click access to review episodes
  - Shows top 5 episodes with indicator if more exist
  - Notification badge on "Review Queue" button with count
- **Quick Actions**:
  - AI Generate Episode button
  - Review Queue button (with notification badge)
  - Create Manually button
  - View All Episodes button

### Episode Management (`/admin/episodes`)
- **Episode Table** (Desktop view):
  - Sortable columns: Episode #, Title, Category, Difficulty, Status, Workflow Stage
  - Edit and Delete actions
  - Status color coding (Draft, Ready to Record, Recorded, Published)
  - Workflow status badges
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
- **Workflow Management Panel** (NEW):
  - Visual progress stepper (Draft → Tech Review → Approved)
  - Stage-specific action buttons:
    - **Draft**: "Submit for Review" button
    - **Tech Review**: "Approve" and "Request Changes" buttons
    - **Approved**: Completion indicator
  - Complete workflow history timeline:
    - All actions with timestamps
    - User attribution (who performed each action)
    - Review notes and feedback
  - Review and approval dialogs with notes fields
  - QR code display and download functionality
  - Color-coded stages:
    - Draft: Grey (#5F6C76)
    - Tech Review: Blue (#0077B5)
    - Approved: Green (#00684A)
- **Teleprompter Mode**: Button to launch recording view
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
- **Workflow Initialization**: Automatically creates workflow tracking on save

### User Settings (`/admin/settings`) (NEW)
- **OpenAI API Key Management**:
  - Secure storage of personal API key
  - Show/hide password toggle
  - Encrypted in database
  - 3-tier priority: request → user → system
- **Social Media Handles**:
  - Configure handles for YouTube, TikTok, LinkedIn, Instagram, X
  - Used in AI generation and social features
- **Save Confirmation**: Success message on update

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
  - `POST /api/episodes` - Create episode (with workflow initialization)
  - `PUT /api/episodes/[id]` - Update episode
  - `DELETE /api/episodes/[id]` - Delete episode
  - `POST /api/episodes/[id]/workflow/submit-review` - Submit for technical review (NEW)
  - `POST /api/episodes/[id]/workflow/review` - Approve or request changes (NEW)
  - `POST /api/episodes/[id]/workflow/approve` - Final approval (NEW)
  - `GET /api/episodes/[id]/qrcode` - Generate QR code (NEW)
  - `GET /api/user/settings` - Get user settings (NEW)
  - `PUT /api/user/settings` - Update user settings (NEW)
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
- workflow: Object (NEW)
  - currentStage: String (draft | tech-review | approved)
  - draftedBy: Object (email, name, timestamp)
  - submittedForReview: Object (email, name, timestamp)
  - reviewedBy: Object (email, name, timestamp, notes, decision)
  - approvedBy: Object (email, name, timestamp, notes)
  - history: Array of Objects (action, stage, user, timestamp, notes)
- createdAt: Date
- updatedAt: Date

User Schema (NEW):
- email: String (unique, MongoDB.com only)
- settings: Object
  - openaiApiKey: String (encrypted)
  - socialHandles: Object (youtube, tiktok, linkedin, instagram, x)
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

### Content Creator Workflow (Enhanced with Approval Process)
1. **Login**: Use magic link authentication (MongoDB.com email)
2. **Create Episode**: Create new episode in admin panel or use AI generation
3. **Draft Script**: Fill out 60-second script structure with all sections
4. **Add Metadata**: Configure episode number, category, difficulty, social links
5. **Submit for Review**: Click "Submit for Review" in workflow panel
   - Episode moves to "Tech Review" stage
   - Reviewer receives notification in review queue
6. **Technical Review**: Reviewer evaluates episode for accuracy
   - **Option A**: Approve → Episode moves to "Approved" stage
   - **Option B**: Request Changes → Episode returns to "Draft" with notes
7. **Iterate** (if changes requested): Content creator updates and resubmits
8. **Final Approval**: Click "Approve" when ready for recording
   - Episode moves to "Approved" stage
   - Ready for video production
9. **Recording**: Use teleprompter mode for video recording
10. **Publish**: Upload video, add URL, and set status to "Published"
11. **Distribution**: Share on social media using provided links and QR code

### Workflow Stages Explained
- **Draft**: Initial creation and editing phase
  - Available actions: Edit content, Submit for Review
- **Tech Review**: Awaiting technical accuracy review
  - Available actions: Approve, Request Changes
- **Approved**: Ready for video recording
  - Episode is locked for quality, ready for production

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
│   │   ├── page.js                # Admin dashboard with review queue
│   │   ├── settings/page.js       # User settings (NEW)
│   │   ├── episodes/
│   │   │   ├── page.js            # Episode list/table
│   │   │   ├── new/page.js        # Create episode
│   │   │   └── [id]/page.js       # Edit episode with workflow panel
│   │   └── teleprompter/
│   │       └── [id]/page.js       # Recording view
│   ├── login/page.js              # Magic link login
│   ├── auth/
│   │   └── verify/page.js         # Magic link verification
│   └── api/
│       ├── episodes/
│       │   ├── route.js           # GET/POST episodes (with workflow init)
│       │   └── [id]/
│       │       ├── route.js       # GET/PUT/DELETE episode
│       │       ├── qrcode/route.js            # QR code generation (NEW)
│       │       └── workflow/
│       │           ├── submit-review/route.js # Submit for review (NEW)
│       │           ├── review/route.js        # Approve/request changes (NEW)
│       │           └── approve/route.js       # Final approval (NEW)
│       ├── user/
│       │   └── settings/route.js  # User settings API (NEW)
│       └── auth/
│           ├── request-link/      # Request magic link
│           ├── verify/            # Verify token
│           └── logout/            # Logout
├── components/
│   ├── EpisodeCard.js             # Reusable episode card with workflow badges
│   ├── EpisodeForm.js             # Episode form component
│   ├── WorkflowStatus.js          # Workflow management panel (NEW)
│   └── AIGenerateDialog.js        # AI generation dialog
├── lib/
│   ├── mongodb.js                 # MongoDB connection
│   ├── episodes.js                # Episode data access (with workflow functions)
│   ├── auth.js                    # Auth utilities
│   └── email.js                   # Email sending
├── models/
│   └── Episode.js                 # Mongoose schema
├── middleware.js                  # Auth middleware
└── public/
    └── logo.png                   # App logo
```

## Recent Improvements

### Phase 1 Enhanced Features (December 2025)
- ✅ **Workflow & Approval System**: Complete 3-stage workflow (Draft → Tech Review → Approved)
  - Visual progress stepper with color-coded stages
  - Stage-specific action buttons
  - Complete audit trail with user attribution
  - Workflow history timeline
  - Review and approval dialogs with notes
- ✅ **Review Queue**: Admin dashboard integration
  - Pending review episodes table
  - Notification badges with counts
  - Pulsing indicators for urgent items
  - One-click access to reviews
- ✅ **QR Code Generation**: Automatic QR codes for episodes
  - MongoDB brand colors
  - Download functionality
  - Integrated in episode editor
- ✅ **User Settings**: Personal configuration page
  - OpenAI API key management (encrypted)
  - Social media handle configuration
  - 3-tier API key priority system
- ✅ **Enhanced Navigation**: Sequential episode browsing
  - Breadcrumb navigation
  - Previous/Next episode buttons
  - Episode number-based traversal
- ✅ **Social Media Integration**: Platform-specific buttons
  - YouTube, LinkedIn, X, TikTok, Instagram support
  - Hover animations
  - Opens in new tabs
- ✅ **Visual Enhancements**: MongoDB brand styling
  - Category-specific gradients and icons
  - Workflow status badges on cards
  - 60-second indicator with pulse animation
  - Improved episode detail pages

### Previous Improvements
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

**Version**: 1.1
**Last Updated**: December 4, 2025
**Changes in v1.1**: Added workflow/approval system, review queue, QR codes, user settings, and enhanced navigation
