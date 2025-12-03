# Mike's MongoDB Minute

A Next.js web application for managing and publishing 60-second educational MongoDB video scripts. Built for content creators who want to organize their MongoDB educational content across TikTok, YouTube Shorts, LinkedIn, Instagram, and X.

## Features

### Admin Interface
- **Dashboard**: Overview of all episodes with status tracking
- **Episode Management**: Full CRUD operations for episodes
- **Workflow States**: Track episodes through draft → ready-to-record → recorded → published
- **60-Second Structure**: Organized script template (Hook, Problem, Tip, Quick Win, CTA)
- **Social Links**: Manage video URLs across all platforms

### Public Interface
- **Home Page**: Latest published episodes
- **Episodes Browser**: Browse all published episodes by category
- **Episode Detail Pages**: Full script view with social media links
- **SEO Optimized**: Proper meta tags and descriptions

### Technical Stack
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: Material UI
- **Database**: MongoDB Atlas
- **Driver**: Native MongoDB Node.js driver
- **Deployment**: Optimized for Vercel

## Project Structure

```
mikes-mongodb-minute/
├── app/
│   ├── admin/                 # Admin interface
│   │   ├── page.js           # Dashboard with statistics
│   │   └── episodes/
│   │       ├── page.js       # Episode list
│   │       ├── new/page.js   # Create episode
│   │       └── [id]/page.js  # Edit episode
│   ├── episodes/             # Public interface
│   │   ├── page.js           # All episodes
│   │   └── [slug]/page.js    # Episode detail
│   ├── api/episodes/         # REST API
│   ├── layout.js             # Root layout
│   └── page.js               # Home page
├── components/
│   ├── EpisodeCard.js        # Episode preview card
│   └── EpisodeForm.js        # Episode create/edit form
├── lib/
│   ├── mongodb.js            # Database connection
│   └── episodes.js           # Database operations
└── public/                   # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mikes-mongodb-minute
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=mikes_mongodb_minute
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Admin Workflow

1. **Access Admin Dashboard**: Navigate to `/admin`
2. **Create Episode**: Click "Create New Episode" or go to `/admin/episodes/new`
3. **Fill in Details**:
   - Episode number, title, category, difficulty
   - Five script sections (Hook, Problem, Tip, Quick Win, CTA)
   - Visual suggestions
   - Status (draft, ready-to-record, recorded, published)
4. **Add Social Links**: Once recorded, add video URLs
5. **Publish**: Change status to "published" to make visible on public site

### Episode Data Model

```javascript
{
  episodeNumber: Number,
  title: String,
  slug: String,              // Auto-generated from title
  category: String,          // Data Modeling, Indexing, Atlas, etc.
  difficulty: String,        // Beginner, Intermediate, Advanced
  status: String,            // draft, ready-to-record, recorded, published
  hook: String,              // 0-5 seconds
  problem: String,           // 5-15 seconds
  tip: String,               // 15-45 seconds
  quickWin: String,          // 45-52 seconds
  cta: String,               // 52-60 seconds
  visualSuggestion: String,
  videoUrl: String,
  socialLinks: {
    youtube: String,
    tiktok: String,
    linkedin: String,
    instagram: String,
    x: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Categories

- Data Modeling
- Indexing
- Atlas
- Vector & AI
- Atlas Search
- Aggregation
- Security
- Migration
- New Features

## API Endpoints

### Public
- `GET /api/episodes` - List all episodes (with optional `publishedOnly` filter)
- `GET /api/episodes/[id]` - Get single episode by ID

### Admin
- `POST /api/episodes` - Create new episode
- `PUT /api/episodes/[id]` - Update episode
- `DELETE /api/episodes/[id]` - Delete episode

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

Quick steps:
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

**⚠️ Important**: Protect the admin interface using Vercel password protection or add authentication (Phase 2).

## Development

### Project Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Recommended MongoDB Indexes

```javascript
db.episodes.createIndex({ slug: 1 }, { unique: true })
db.episodes.createIndex({ status: 1, episodeNumber: 1 })
db.episodes.createIndex({ category: 1 })
db.episodes.createIndex({ status: 1, createdAt: -1 })
```

## Roadmap

### Phase 1 (Current) ✅
- Complete CRUD interface
- Public browsing
- Episode workflow management
- Basic SEO

### Phase 2
- NextAuth authentication
- AI script generation button
- Video embed components
- Search and filter features

### Phase 3
- Analytics dashboard
- Social media publishing automation
- Dark mode
- RSS feed

## Contributing

This project is designed to be easily editable by AI agents and human developers. The codebase follows clear patterns and minimal dependencies.

## Documentation

- [PID.md](./PID.md) - Project requirements and architecture
- [instructions.md](./instructions.md) - Content strategy and video structure
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

## License

[Your License Here]

## Support

For questions or issues:
- Check the documentation
- Review the [Next.js docs](https://nextjs.org/docs)
- Check [MongoDB Atlas docs](https://docs.atlas.mongodb.com)
# mikes-mongodb-minute
