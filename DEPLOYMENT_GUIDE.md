# SmartSyllabus Deployment Guide

This guide will help you deploy the frontend to Vercel and the backend to Render.

## 🚀 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Vercel CLI (if not already installed):**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

### Step 2: Deploy Frontend

1. **Deploy to Vercel:**
   ```bash
   vercel
   ```

2. **Follow the prompts:**
   - Link to existing project or create new one
   - Set project name (e.g., `smartsyllabus-frontend`)
   - Confirm deployment settings

3. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Navigate to Environment Variables
   - Add: `VITE_API_URL=https://your-render-backend-url.onrender.com/api`

### Step 3: Get Frontend URL

After deployment, note your frontend URL (e.g., `https://smartsyllabus-frontend.vercel.app`)

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Ensure all files are committed to Git**

### Step 2: Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Create New Web Service:**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure the service:**
   - **Name:** `smartsyllabus-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node app.js`
   - **Plan:** Free

4. **Set Environment Variables:**
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://younussyed787070:B6TLB5EzPJiGsMxF@smartsyllabus.tiz58j8.mongodb.net/smartsyllabus?retryWrites=true&w=majority`
   - `PORT` = `10000`

5. **Click "Create Web Service"**

### Step 3: Get Backend URL

After deployment, note your backend URL (e.g., `https://smartsyllabus-backend.onrender.com`)

---

## 🔗 Connect Frontend to Backend

### Step 1: Update Frontend Environment Variable

1. **Go to your Vercel dashboard**
2. **Navigate to your frontend project settings**
3. **Update the environment variable:**
   ```
   VITE_API_URL=https://your-actual-render-backend-url.onrender.com/api
   ```

### Step 2: Update Backend CORS (if needed)

If you get CORS errors, update the CORS origins in:
- `backend/app.js`
- `backend/api/index.js`

Add your frontend URL to the allowed origins.

---

## 🧪 Test Your Deployment

### Test Backend:
```bash
curl https://your-backend-url.onrender.com/api/hello
```

### Test Frontend:
Visit your frontend URL and check if it can connect to the backend.

---

## 📝 Environment Variables Summary

### Frontend (Vercel):
```
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

### Backend (Render):
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://younussyed787070:B6TLB5EzPJiGsMxF@smartsyllabus.tiz58j8.mongodb.net/smartsyllabus?retryWrites=true&w=majority
PORT=10000
```

---

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check that your frontend URL is in the backend's CORS origins
   - Update CORS settings in both `app.js` and `api/index.js`

2. **API Connection Issues:**
   - Verify the `VITE_API_URL` environment variable is set correctly
   - Check that the backend URL is accessible

3. **MongoDB Connection:**
   - Ensure your MongoDB Atlas cluster allows connections from Render's IP ranges

4. **Build Errors:**
   - Check that all dependencies are in `package.json`
   - Verify the build commands are correct

### Useful Commands:

```bash
# Test backend locally
cd backend && npm start

# Test frontend locally
cd frontend && npm run dev

# Check environment variables
echo $VITE_API_URL
```

---

## 🎉 Success!

Once both services are deployed and connected, your SmartSyllabus app will be live at:
- **Frontend:** `https://your-frontend-url.vercel.app`
- **Backend:** `https://your-backend-url.onrender.com/api/*` 