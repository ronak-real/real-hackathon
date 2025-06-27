# SpendWise Backend - Vercel Deployment Guide

## Prerequisites
- Vercel account (https://vercel.com)
- Vercel CLI installed (optional): `npm i -g vercel`

## Method 1: Deploy with Vercel CLI

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Login to Vercel (if not logged in)
   - Select scope
   - Link to existing project or create new
   - Confirm directory
   - Override settings if needed

## Method 2: Deploy with Git

1. **Push code to GitHub/GitLab/Bitbucket**

2. **Import to Vercel**:
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your Git repository
   - Select the `backend` folder as root directory

3. **Configure Build Settings**:
   - Framework Preset: `Other`
   - Build Command: (leave empty or `npm install`)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

4. **Deploy**

## Method 3: Direct Upload

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Click "Add New Project"
   - Select "Upload Folder"

2. **Upload the backend folder**

3. **Configure and Deploy**

## Environment Variables

After deployment, add any required environment variables:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add:
   ```
   NODE_ENV=production
   PORT=5000
   ```

## Post-Deployment

### Test Your API:
```bash
# Replace with your Vercel URL
curl https://your-app.vercel.app/api/health
```

### Update Frontend:
Update the API URL in your frontend `.env` file:
```
VITE_API_URL=https://your-app.vercel.app/api
```

## Important Notes

1. **Data Persistence**: 
   - This backend uses in-memory storage
   - Data will be lost between deployments and function invocations
   - For production, consider using a database like MongoDB Atlas or PostgreSQL

2. **Serverless Limitations**:
   - Each API call runs in isolation
   - No persistent connections
   - 10-second timeout for free tier

3. **CORS Configuration**:
   - Currently allows all origins
   - Update CORS settings for production:
   ```javascript
   app.use(cors({
     origin: 'https://your-frontend-url.vercel.app'
   }));
   ```

## Troubleshooting

### "404 Not Found" errors:
- Check vercel.json routes configuration
- Ensure all routes start with `/api`

### "Cannot find module" errors:
- Ensure all dependencies are in package.json
- Run `npm install` locally and commit package-lock.json

### CORS errors:
- Update CORS configuration in server.js
- Add your frontend URL to allowed origins

## Example Test Commands

Once deployed, test with:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "demo", "password": "demo123"}'

# Get dashboard (with auth)
curl https://your-app.vercel.app/api/dashboard \
  -H "x-user-id: user_1"
```

## Next Steps

1. **Add a Database**: 
   - MongoDB Atlas (free tier available)
   - Supabase (PostgreSQL)
   - PlanetScale (MySQL)

2. **Improve Security**:
   - Add proper JWT authentication
   - Use environment variables for secrets
   - Implement rate limiting

3. **Monitor Your App**:
   - Use Vercel Analytics
   - Add error tracking (Sentry)
   - Monitor API performance