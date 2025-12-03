# Deployment Guide - Mike's MongoDB Minute

This guide covers deploying the Mike's MongoDB Minute platform to Vercel.

## Prerequisites

1. **MongoDB Atlas Cluster**
   - Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a database user with read/write permissions
   - Whitelist Vercel IP addresses (or use 0.0.0.0/0 for development)
   - Get your connection string

2. **Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Install Vercel CLI (optional): `npm i -g vercel`

## Environment Variables

Create the following environment variables in Vercel:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=mikes_mongodb_minute
```

### Getting Your MongoDB Connection String

1. Go to your Atlas cluster
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `mikes_mongodb_minute` (or your preferred database name)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or your project root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add environment variables (see above)
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts and add environment variables when asked

## Post-Deployment

### 1. Protect the Admin Interface

**⚠️ IMPORTANT**: Phase 1 has no authentication. Protect the admin interface using one of these methods:

#### Option A: Vercel Password Protection (Recommended for Pro plans)
1. Go to your project settings in Vercel
2. Navigate to "Deployment Protection"
3. Enable "Password Protection"

#### Option B: IP Whitelisting
1. Configure Vercel Edge Config or Middleware
2. Restrict `/admin/*` routes to specific IP addresses

#### Option C: Add Authentication (Phase 2)
See the PID.md file for Phase 2 plans to add NextAuth authentication.

### 2. Verify Deployment

Visit these URLs to verify everything works:

- **Home**: `https://your-domain.vercel.app/`
- **Episodes**: `https://your-domain.vercel.app/episodes`
- **Admin Dashboard**: `https://your-domain.vercel.app/admin`
- **API**: `https://your-domain.vercel.app/api/episodes`

### 3. Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Environment-Specific Configurations

### Development
```bash
npm run dev
```
Runs on `http://localhost:3000`

### Production Build (Local Testing)
```bash
npm run build
npm start
```

## Database Setup

### Creating Indexes (Recommended)

Connect to your MongoDB Atlas cluster and run:

```javascript
// In MongoDB Shell or Compass
use mikes_mongodb_minute

// Create indexes for better performance
db.episodes.createIndex({ slug: 1 }, { unique: true })
db.episodes.createIndex({ status: 1, episodeNumber: 1 })
db.episodes.createIndex({ category: 1 })
db.episodes.createIndex({ status: 1, createdAt: -1 })
```

### Seeding Initial Data

You can seed episodes via:
1. The admin UI at `/admin/episodes/new`
2. Directly via the API using POST requests
3. MongoDB Compass or Shell with bulk inserts

## Monitoring and Maintenance

### Check Logs
- View deployment logs in Vercel dashboard
- Check function logs for API routes
- Monitor MongoDB Atlas metrics

### Performance Tips
1. Enable Vercel Analytics (optional)
2. Monitor MongoDB Atlas performance
3. Consider adding Edge caching for published episodes
4. Use `force-dynamic` export for real-time updates or `revalidate` for static generation

## Troubleshooting

### "MongoDB connection failed"
- Verify `MONGODB_URI` is correct in Vercel environment variables
- Check network access in Atlas (whitelist Vercel IPs or 0.0.0.0/0)
- Verify database user credentials

### "Cannot find module" errors
- Ensure all dependencies are in `package.json`
- Run `npm install` and redeploy

### Admin routes not working
- Check environment variables are set
- Verify deployment completed successfully
- Check function logs in Vercel dashboard

## Security Checklist

- [ ] MongoDB connection string stored as environment variable (never in code)
- [ ] Admin interface protected (password, IP restriction, or auth)
- [ ] MongoDB user has minimum required permissions
- [ ] Atlas network access properly configured
- [ ] HTTPS enabled (automatic with Vercel)

## Next Steps (Phase 2+)

See PID.md for planned enhancements:
- Authentication with NextAuth
- AI script generation
- Video embed components
- Analytics dashboard
- Dark mode
- RSS feed

## Support

For issues specific to:
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
