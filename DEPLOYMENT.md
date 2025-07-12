# SmartSyllabus Deployment Guide

## Deploying to Render

### Prerequisites
1. Create a Render account at https://render.com
2. Connect your GitHub repository
3. Ensure your MongoDB Atlas connection string is ready

### Deployment Steps

#### 1. Backend Deployment
1. Go to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `smartsyllabus-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: `10000`

#### 2. Frontend Deployment
1. Go to your Render dashboard
2. Click "New +" and select "Static Site"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `smartsyllabus-frontend`
   - **Build Command**: `cd frontend && npm install && VITE_API_URL=https://smartsyllabus-backend.onrender.com/api npm run build`
   - **Publish Directory**: `frontend/dist`

### Alternative: Use render.yaml (Blueprints)

1. Push the `render.yaml` file to your repository
2. In Render dashboard, click "New +" and select "Blueprint"
3. Connect your repository
4. Render will automatically create both services

### Environment Variables

#### Backend (.env)
```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=10000
```

#### Frontend (set during build)
```
VITE_API_URL=https://smartsyllabus-backend.onrender.com/api
```

### URLs
- Backend API: `https://smartsyllabus-backend.onrender.com`
- Frontend: `https://smartsyllabus-frontend.onrender.com`

### Troubleshooting
1. Check Render logs for build errors
2. Ensure MongoDB Atlas IP whitelist includes Render's IPs
3. Verify environment variables are set correctly
4. Check CORS settings in backend/app.js 