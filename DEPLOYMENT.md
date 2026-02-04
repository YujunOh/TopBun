# TopBun Deployment Guide

This guide walks you through deploying TopBun to production using Vercel and Neon PostgreSQL.

## Prerequisites

- GitHub account (for OAuth and Vercel deployment)
- Google Cloud account (optional, for Google OAuth)
- Node.js 18+ installed locally

---

## Step 1: Create Neon PostgreSQL Database

**Why Neon?** TopBun uses PostgreSQL in production. Neon offers a generous free tier with serverless PostgreSQL perfect for Next.js apps.

1. **Sign up** at [https://neon.tech](https://neon.tech)
2. **Create a new project**:
   - Project name: `topbun-production`
   - Region: Choose closest to your users (e.g., US East, EU West)
   - PostgreSQL version: 15 or later
3. **Copy the connection string**:
   - Go to Dashboard → Connection Details
   - Copy the connection string (starts with `postgresql://`)
   - Example: `postgresql://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb`
4. **Save it** for Step 3

---

## Step 2: Set Up Vercel Project

1. **Push your code** to GitHub (if not already done)
2. **Go to** [https://vercel.com](https://vercel.com)
3. **Import your repository**:
   - Click "Add New Project"
   - Select your TopBun repository from GitHub
4. **Configure build settings** (Vercel auto-detects Next.js, but verify):
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

---

## Step 3: Set Environment Variables in Vercel

**CRITICAL:** Before deploying, configure all environment variables in Vercel dashboard.

1. In your Vercel project dashboard, go to **Settings → Environment Variables**
2. Add the following variables (use values from `.env.example` as reference):

### Database
```
DATABASE_URL = postgresql://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb
```
*(Use the connection string from Neon)*

### NextAuth Configuration
```
NEXTAUTH_URL = https://your-app-name.vercel.app
```
*(Vercel will provide this URL after first deploy - you can update it later)*

```
NEXTAUTH_SECRET = <generate new with: openssl rand -base64 32>
```
**IMPORTANT:** Generate a NEW secret, don't reuse the development one!

### GitHub OAuth
```
GITHUB_ID = <your GitHub OAuth App ID>
GITHUB_SECRET = <your GitHub OAuth App Secret>
```

**How to get GitHub OAuth credentials:**
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Application name: `TopBun Production`
4. Homepage URL: `https://your-app-name.vercel.app`
5. Authorization callback URL: `https://your-app-name.vercel.app/api/auth/callback/github`
6. Click "Register application"
7. Copy "Client ID" → use as `GITHUB_ID`
8. Generate new client secret → use as `GITHUB_SECRET`

### Google OAuth (Optional)
```
GOOGLE_CLIENT_ID = <your Google OAuth Client ID>
GOOGLE_CLIENT_SECRET = <your Google OAuth Client Secret>
```

**How to get Google OAuth credentials:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new OAuth 2.0 Client ID
3. Application type: Web application
4. Authorized redirect URIs: `https://your-app-name.vercel.app/api/auth/callback/google`
5. Copy Client ID and Client Secret

### AI API Keys (Optional)
```
OPENAI_API_KEY = <your OpenAI API key>
GEMINI_API_KEY = <your Gemini API key>
```
Only set these if you plan to use AI features.

---

## Step 4: Run Database Migrations

After setting environment variables but BEFORE deploying:

1. **Locally**, update your `.env` with the production DATABASE_URL from Neon
2. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   ```
   This creates all tables in your Neon database.

3. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **(Optional) Seed the database** with initial burger data:
   ```bash
   npm run db:seed
   ```

---

## Step 5: Deploy to Vercel

1. **In Vercel dashboard**, click "Deploy"
2. **Wait for build** (typically 2-3 minutes)
3. **Deployment complete!** Vercel provides your production URL: `https://your-app-name.vercel.app`

---

## Step 6: Post-Deployment Verification

**Test the following:**

1. ✅ **Homepage loads** with stats and feature cards
2. ✅ **Reviews page** shows burger list (or empty state if no data)
3. ✅ **OAuth login works**:
   - Click login button
   - Try GitHub OAuth
   - Try Google OAuth (if configured)
   - Verify user name appears in navbar after login
4. ✅ **Database operations work**:
   - Create a burger review
   - Create a community post
   - Play World Cup game (votes save to database)
5. ✅ **SEO works**:
   - Visit `/sitemap.xml` - should list all pages
   - Visit `/robots.txt` - should allow all
   - Share a burger link - preview card should appear

---

## Step 7: Update OAuth Redirect URLs

After first deployment, you'll know your final Vercel URL. Update:

1. **GitHub OAuth App**:
   - Homepage URL: `https://your-actual-url.vercel.app`
   - Callback URL: `https://your-actual-url.vercel.app/api/auth/callback/github`

2. **Google OAuth App**:
   - Authorized redirect URI: `https://your-actual-url.vercel.app/api/auth/callback/google`

3. **Vercel Environment Variable**:
   - Update `NEXTAUTH_URL` to `https://your-actual-url.vercel.app`
   - Redeploy after updating

---

## Troubleshooting

### Build fails with "Database connection error"
- Verify DATABASE_URL is correctly set in Vercel environment variables
- Check Neon database is active (free tier may sleep after inactivity)
- Run `npx prisma migrate deploy` locally with production DATABASE_URL

### OAuth login fails
- Verify callback URLs match exactly (including https://)
- Check NEXTAUTH_URL matches your Vercel deployment URL
- Verify NEXTAUTH_SECRET is set

### "Cannot find module" errors
- Ensure all dependencies are in `dependencies` (not `devDependencies`)
- Prisma should be in `dependencies` for build to succeed
- Run `npm install` locally and commit updated `package.json`

### Images not loading
- Verify image URLs are absolute or in `/public` folder
- Check `next.config.ts` allows the image domain
- User-uploaded images need separate storage (Vercel has no persistent filesystem)

---

## Monitoring & Maintenance

### Vercel Dashboard
- Monitor deployment logs
- View real-time function logs
- Check analytics (page views, performance)

### Neon Dashboard
- Monitor database size (free tier: 3 GB)
- View active connections
- Manage backups

### Regular Tasks
- Rotate API keys every 90 days (see SECURITY_NOTES.md)
- Monitor error logs in Vercel
- Update dependencies monthly: `npm outdated`

---

## Free Tier Limits

**Vercel Hobby (Free):**
- 100 GB bandwidth/month
- 100 GB-hours serverless function execution
- Unlimited static requests
- 1 concurrent build

**Neon Free Tier:**
- 3 GB storage
- 1 project
- No connection limits

**What happens when limits exceeded?**
- Vercel: Deployments pause until next month
- Neon: Database becomes read-only

For a community burger app, these limits should be sufficient for 1000s of users.

---

## Production Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Database migrations run successfully
- [ ] OAuth apps configured with production URLs
- [ ] NEXTAUTH_SECRET generated fresh (not from development)
- [ ] Test login flow works
- [ ] Test creating/viewing burgers
- [ ] Test World Cup game saves votes
- [ ] SEO: sitemap.xml and robots.txt accessible
- [ ] Security: No secrets in git history (see SECURITY_NOTES.md)
- [ ] Performance: Lighthouse score > 90

---

## Support & Resources

- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Vercel Documentation**: https://vercel.com/docs
- **Neon Documentation**: https://neon.tech/docs
- **Prisma with PostgreSQL**: https://pris.ly/d/postgres-connector

---

**Ready to deploy!** 🚀

If you encounter issues not covered here, check the GitHub repository issues or create a new one.
