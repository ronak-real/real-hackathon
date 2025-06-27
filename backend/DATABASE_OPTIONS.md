# Database Options for Vercel Deployment

## Current Implementation
Your backend now supports both MongoDB and in-memory storage. If MongoDB is not configured, it automatically falls back to in-memory storage.

## Option 1: MongoDB Atlas (Recommended)
**Pros:**
- Free tier (512MB storage)
- Data persists across deployments
- Professional database features
- Easy to set up

**Setup:** Follow `MONGODB_SETUP.md`

## Option 2: Supabase (PostgreSQL)
**Pros:**
- Free tier with 500MB
- Real-time capabilities
- Built-in authentication

**Cons:**
- Requires code changes for SQL

## Option 3: PlanetScale (MySQL)
**Pros:**
- Serverless MySQL
- Great performance
- Free tier available

**Cons:**
- Requires SQL migration

## Option 4: Redis (Upstash)
**Pros:**
- Fast in-memory with persistence
- Free tier (10,000 requests/day)
- Easy integration

**Cons:**
- Limited query capabilities

## Quick Start with MongoDB Atlas

1. **Sign up at:** https://www.mongodb.com/cloud/atlas/register

2. **Create free cluster** (M0 tier)

3. **Get connection string** from Atlas dashboard

4. **Add to Vercel:**
   ```
   Name: MONGODB_URI
   Value: mongodb+srv://username:password@cluster.mongodb.net/spendwise?retryWrites=true&w=majority
   ```

5. **Test deployment:**
   ```bash
   curl https://real-hackathon-be.vercel.app/api/health
   ```

## Testing Without Database
The app works without any database configuration - it will use in-memory storage. This is perfect for testing but data won't persist.

## Next Steps
1. Choose a database option
2. Follow the setup guide
3. Add environment variable to Vercel
4. Redeploy

Your backend is ready to work with or without a database!