# MongoDB Connection Troubleshooting

## Quick Checklist

### 1. ✅ MongoDB Atlas Setup
- [ ] Created free M0 cluster
- [ ] Created database user with password
- [ ] Added `0.0.0.0/0` to Network Access (IP Whitelist)
- [ ] Cluster is active (not paused)

### 2. ✅ Connection String Format
Your connection string should look like:
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/spendwise?retryWrites=true&w=majority
```

**Important:** 
- Replace USERNAME with your database username
- Replace PASSWORD with your database password
- Replace CLUSTER with your cluster name (e.g., cluster0.xxxxx)
- Keep `/spendwise` before the `?`

### 3. ✅ Vercel Environment Variable

1. Go to: https://vercel.com/your-username/real-hackathon-be/settings/environment-variables
2. Add new variable:
   - **Key**: `MONGODB_URI`
   - **Value**: Your complete connection string
   - **Environment**: ✓ Production, ✓ Preview, ✓ Development
3. Click "Save"

### 4. ✅ Common Password Issues
If your password contains special characters like `@`, `#`, `$`, etc., you need to URL encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`

Example: If password is `p@ss#word`, use `p%40ss%23word`

### 5. ✅ Redeploy After Adding Environment Variable

**Important:** After adding the environment variable, you must redeploy:

```bash
# Option 1: Trigger via Git
git commit --allow-empty -m "Trigger redeploy with MongoDB"
git push

# Option 2: Redeploy from Vercel Dashboard
# Go to your project → Deployments → Three dots menu → Redeploy
```

### 6. ✅ Verify in MongoDB Atlas
1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. You should see `spendwise` database after first API call

## Quick Fix Steps

1. **In MongoDB Atlas:**
   ```
   Network Access → Add IP Address → Allow Access from Anywhere → Confirm
   ```

2. **Copy connection string from Atlas:**
   ```
   Database → Connect → Connect your application → Copy
   ```

3. **In Vercel:**
   ```
   Settings → Environment Variables → Add:
   MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/spendwise?retryWrites=true&w=majority
   ```

4. **Redeploy:**
   ```
   Vercel Dashboard → Deployments → ... → Redeploy
   ```

5. **Test:**
   ```bash
   curl https://real-hackathon-be.vercel.app/api/health
   ```

## Still Not Working?

Run this test locally:
```bash
cd backend
node debug-mongodb.js
```

This will show you the exact error and how to fix it.