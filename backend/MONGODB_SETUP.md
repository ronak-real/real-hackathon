# MongoDB Atlas Setup Guide for SpendWise

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Verify your email

## Step 2: Create a Free Cluster

1. Click "Build a Database"
2. Choose **FREE** Shared Cluster (M0)
3. Select your preferred cloud provider (AWS recommended)
4. Choose a region close to your Vercel deployment
5. Name your cluster (e.g., "spendwise-cluster")
6. Click "Create Cluster"

## Step 3: Set Up Database Access

1. Go to "Database Access" in the sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username: `spendwise-user`
5. Generate a secure password (save it!)
6. Under "Database User Privileges", select "Read and write to any database"
7. Click "Add User"

## Step 4: Set Up Network Access

1. Go to "Network Access" in the sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is okay for development, but for production, add specific IPs
4. Click "Confirm"

## Step 5: Get Your Connection String

1. Go to "Database" in the sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Configure Your Connection String

Replace the placeholders in your connection string:
- `<username>` → `spendwise-user` (or your username)
- `<password>` → Your actual password
- Add database name before the `?`: `/spendwise?`

Final connection string example:
```
mongodb+srv://spendwise-user:YourPassword123@cluster0.xxxxx.mongodb.net/spendwise?retryWrites=true&w=majority
```

## Step 7: Add to Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Go to "Settings" → "Environment Variables"
3. Add new variable:
   - Name: `MONGODB_URI`
   - Value: Your complete connection string
   - Environment: Production (and Preview if needed)
4. Click "Save"

## Step 8: Update Your Backend

1. Replace `server.js` with `server-mongodb.js`:
   ```bash
   cd backend
   cp server-mongodb.js server.js
   ```

2. Commit and push:
   ```bash
   git add .
   git commit -m "Add MongoDB support"
   git push
   ```

3. Vercel will automatically redeploy

## Step 9: Test Your Deployment

```bash
# Check health endpoint
curl https://real-hackathon-be.vercel.app/api/health

# Response should show MongoDB connected:
{
  "status": "OK",
  "message": "SpendWise API is running!",
  "database": {
    "type": "MongoDB",
    "connected": true,
    "message": "Connected to MongoDB Atlas"
  }
}
```

## Monitoring Your Database

1. In MongoDB Atlas dashboard, go to "Database"
2. Click "Browse Collections" to see your data
3. You should see collections:
   - users
   - income
   - expenses
   - goals

## Fallback to In-Memory

If MongoDB connection fails, the app automatically falls back to in-memory storage. Check the health endpoint to see which storage is being used.

## Security Best Practices

1. **For Production:**
   - Restrict Network Access to specific IPs
   - Use strong passwords
   - Enable MongoDB Atlas audit logs
   - Set up alerts for unusual activity

2. **Connection String Security:**
   - Never commit connection strings to Git
   - Always use environment variables
   - Rotate passwords regularly

## Troubleshooting

### "Authentication failed"
- Double-check username and password
- Ensure user has correct permissions
- Password might have special characters that need URL encoding

### "Network timeout"
- Check Network Access settings
- Ensure IP whitelist includes 0.0.0.0/0 or your specific IPs
- Try different region if latency is high

### "Cannot connect to MongoDB"
- Verify connection string format
- Check if cluster is active (not paused)
- Ensure environment variable is set in Vercel

## Data Migration

To migrate existing in-memory data to MongoDB:

1. Export data from current deployment
2. Use MongoDB Compass or Atlas UI to import
3. Or create a migration script

## Next Steps

1. Set up MongoDB backups
2. Configure alerts for database usage
3. Consider upgrading to paid tier for:
   - Better performance
   - Dedicated resources
   - Advanced security features