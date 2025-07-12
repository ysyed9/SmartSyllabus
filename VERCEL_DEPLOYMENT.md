# SmartSyllabus Vercel Deployment Guide

## 🚀 Complete Vercel Deployment (FREE)

### Prerequisites
1. Create a Vercel account at https://vercel.com
2. Connect your GitHub repository
3. Ensure your MongoDB Atlas connection string is ready

## 📋 Deployment Steps

### Step 1: Deploy Backend API

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign up/login with GitHub

2. **Import Backend Repository**
   - Click "New Project"
   - Import your GitHub repository: `ysyed9/SmartSyllabus`
   - **Root Directory**: `backend`
   - **Framework Preset**: Node.js
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add these variables:
     ```
     NODE_ENV=production
     MONGODB_URI=your_mongodb_atlas_connection_string
     ```

4. **Deploy**
   - Click "Deploy"
   - Note the backend URL (e.g., `https://smartsyllabus-backend.vercel.app`)

### Step 2: Deploy Frontend

1. **Create New Project**
   - Go back to Vercel Dashboard
   - Click "New Project"
   - Import the same repository: `ysyed9/SmartSyllabus`

2. **Configure Frontend**
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variable**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://smartsyllabus-backend.vercel.app/api
     ```
   - Replace with your actual backend URL

4. **Deploy**
   - Click "Deploy"
   - Your frontend will be available at the provided URL

## 🔧 Environment Variables

### Backend (.env)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartsyllabus
```

### Frontend (Environment Variable)
```
VITE_API_URL=https://smartsyllabus-backend.vercel.app/api
```

## 🎯 Expected URLs
- **Backend API**: `https://smartsyllabus-backend.vercel.app`
- **Frontend**: `https://smartsyllabus-frontend.vercel.app`

## ✅ Features Included
- ✅ Auto-fill syllabus fields from PDF
- ✅ File upload and processing
- ✅ MongoDB Atlas integration
- ✅ CORS configured for Vercel domains
- ✅ Environment-specific configurations

## 🐛 Troubleshooting

### Common Issues:
1. **Build fails**: Check if all dependencies are in package.json
2. **CORS errors**: Verify frontend URL is in backend CORS settings
3. **Database connection**: Ensure MongoDB Atlas allows all IPs (0.0.0.0/0)
4. **Environment variables**: Double-check spelling and values

### Backend Issues:
- Check Vercel function logs for errors
- Ensure MongoDB connection string is correct
- Verify all required environment variables are set

### Frontend Issues:
- Check if VITE_API_URL points to correct backend URL
- Verify build completes successfully
- Check browser console for API errors

## 🔄 Updates
- Push changes to GitHub
- Vercel will automatically redeploy
- Environment variables persist between deployments

## 💰 Cost: $0/month
- Vercel offers generous free tier
- Perfect for personal projects
- Automatic deployments from GitHub 