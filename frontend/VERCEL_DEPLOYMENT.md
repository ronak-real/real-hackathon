# SpendWise Frontend - Vercel Deployment Guide

## Prerequisites
- Backend already deployed at: https://real-hackathon-be.vercel.app
- Vercel account (https://vercel.com)

## Deployment Steps

### Method 1: Deploy with Vercel CLI

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Deploy**:
   ```bash
   npx vercel
   ```

3. **Follow the prompts**:
   - Confirm directory
   - Link to existing project or create new
   - Accept default settings

### Method 2: Deploy with GitHub

1. **Push code to GitHub**

2. **Import to Vercel**:
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your repository
   - Select the `frontend` folder as root directory

3. **Configure Build Settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://real-hackathon-be.vercel.app/api
   ```

5. **Deploy**

## Post-Deployment

### Update CORS (if needed)
If your frontend URL is different from expected, update the backend CORS settings in `backend/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend-url.vercel.app', // Add your URL here
];
```

### Test Your App

1. Visit your deployed frontend URL
2. Test login with demo account:
   - Username: `demo`
   - Password: `demo123`

## Features to Test

1. **Authentication**:
   - Login/Logout
   - User registration

2. **Financial Management**:
   - Add income
   - Track expenses
   - Set financial goals
   - View analytics

3. **Financial Advisor**:
   - Get advice on expenses
   - See Jethalal's reactions

## Troubleshooting

### API Connection Issues
- Check browser console for errors
- Verify VITE_API_URL in Vercel environment variables
- Test API directly: https://real-hackathon-be.vercel.app/api/health

### CORS Errors
- Update backend CORS settings
- Redeploy backend after changes

### Build Failures
- Check Node version compatibility
- Ensure all dependencies are installed
- Review build logs in Vercel dashboard

## Production Considerations

1. **Security**:
   - Use HTTPS only
   - Implement proper authentication
   - Add rate limiting

2. **Performance**:
   - Enable caching
   - Optimize images
   - Use CDN for assets

3. **Monitoring**:
   - Set up error tracking
   - Monitor API performance
   - Track user analytics