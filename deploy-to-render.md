# Quick Render Deployment Checklist

## ✅ Pre-deployment Checklist

1. **GitHub Repository**
   - [ ] All code is committed and pushed to GitHub
   - [ ] `render.yaml` file is in the root directory
   - [ ] No sensitive data in the repository

2. **MongoDB Atlas**
   - [ ] Database is set up and accessible
   - [ ] Connection string is ready
   - [ ] IP whitelist allows all IPs (0.0.0.0/0) for Render

3. **Render Account**
   - [ ] Account created at https://render.com
   - [ ] GitHub account connected

## 🚀 Deployment Steps

### Option 1: Blueprint Deployment (Recommended)
1. Go to Render Dashboard
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically create both services
5. Add your MongoDB connection string in the backend environment variables

### Option 2: Manual Deployment
1. **Deploy Backend:**
   - New + → Web Service
   - Connect GitHub repo
   - Name: `smartsyllabus-backend`
   - Build: `cd backend && npm install`
   - Start: `cd backend && npm start`
   - Add environment variables

2. **Deploy Frontend:**
   - New + → Static Site
   - Connect GitHub repo
   - Name: `smartsyllabus-frontend`
   - Build: `cd frontend && npm install && VITE_API_URL=https://smartsyllabus-backend.onrender.com/api npm run build`
   - Publish: `frontend/dist`

## 🔧 Environment Variables

### Backend
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartsyllabus
PORT=10000
```

### Frontend
```
VITE_API_URL=https://smartsyllabus-backend.onrender.com/api
```

## 🎯 Expected URLs
- Backend: `https://smartsyllabus-backend.onrender.com`
- Frontend: `https://smartsyllabus-frontend.onrender.com`

## 🐛 Common Issues
- **Build fails**: Check if all dependencies are in package.json
- **CORS errors**: Verify frontend URL is in backend CORS settings
- **Database connection**: Ensure MongoDB Atlas allows Render IPs
- **Environment variables**: Double-check spelling and values 