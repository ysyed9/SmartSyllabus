# 🚀 SmartSyllabus Deployment Guide

This guide will help you deploy SmartSyllabus to production using Render (backend) and Vercel (frontend).

## 📋 Prerequisites

- GitHub account
- MongoDB Atlas account
- Render account (free tier available)
- Vercel account (free tier available)

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Your Repository

1. **Fork this repository** to your GitHub account
2. **Clone your fork** locally
3. **Update environment variables** in your local `.env` file

### Step 2: Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `smartsyllabus-backend` (or your preferred name)
   - **Root Directory**: Leave empty (deploy from root)
   - **Runtime**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

### Step 3: Environment Variables

Add these environment variables in Render:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/syllabus-app?retryWrites=true&w=majority
NODE_ENV=production
PORT=10000
```

### Step 4: Deploy

1. **Click "Create Web Service"**
2. **Wait for deployment** (usually 2-5 minutes)
3. **Copy your backend URL** (e.g., `https://your-app.onrender.com`)

## 🎨 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 2: Environment Variables

Add this environment variable in Vercel:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Step 3: Deploy

1. **Click "Deploy"**
2. **Wait for deployment** (usually 1-2 minutes)
3. **Copy your frontend URL** (e.g., `https://your-app.vercel.app`)

## 🔄 Continuous Deployment

Both Render and Vercel will automatically redeploy when you push changes to your main branch.

## 🌐 Custom Domains (Optional)

### Render (Backend)
1. Go to your Render service
2. Click "Settings" → "Custom Domains"
3. Add your domain and configure DNS

### Vercel (Frontend)
1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Add your domain and configure DNS

## 🔧 Post-Deployment Configuration

### CORS Configuration

If you're using a custom domain, update the CORS configuration in `backend/app.js`:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-domain.com',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

### Environment Variables

Make sure all environment variables are set correctly:

**Backend (Render):**
- `MONGODB_URI`: Your MongoDB connection string
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render's default)

**Frontend (Vercel):**
- `VITE_API_URL`: Your backend URL + `/api`

## 🧪 Testing Your Deployment

### Backend Testing
```bash
curl https://your-backend-url.onrender.com/api/hello
```

Expected response:
```json
{
  "message": "Hello from SmartSyllabus backend!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "method": "GET",
  "url": "/api/hello"
}
```

### Frontend Testing
1. Visit your Vercel URL
2. Try uploading a syllabus file
3. Check that API calls work without CORS errors

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify your backend URL in `VITE_API_URL`
   - Check CORS configuration in backend
   - Ensure domains are correctly listed

2. **MongoDB Connection Issues**
   - Verify connection string format
   - Check IP whitelist in MongoDB Atlas
   - Ensure database name is correct

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

4. **File Upload Issues**
   - Check file size limits
   - Verify upload directory permissions
   - Ensure proper MIME type handling

### Debugging Tips

- **Check Render logs** for backend issues
- **Check Vercel logs** for frontend issues
- **Use browser DevTools** to inspect network requests
- **Test API endpoints** with Postman or curl

## 📊 Monitoring

### Render Monitoring
- View logs in Render dashboard
- Monitor resource usage
- Set up alerts for downtime

### Vercel Monitoring
- View deployment status
- Monitor performance metrics
- Check function execution logs

## 🔐 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **CORS**: Only allow necessary domains
3. **File Uploads**: Validate file types and sizes
4. **MongoDB**: Use strong passwords and IP whitelisting
5. **HTTPS**: Always use HTTPS in production

## 📈 Scaling

### Render Scaling
- Upgrade to paid plan for more resources
- Configure auto-scaling based on traffic
- Set up load balancing for multiple instances

### Vercel Scaling
- Automatic scaling based on traffic
- Edge functions for better performance
- CDN distribution worldwide

## 🆘 Support

- **Render Support**: [Render Documentation](https://render.com/docs)
- **Vercel Support**: [Vercel Documentation](https://vercel.com/docs)
- **GitHub Issues**: [SmartSyllabus Issues](https://github.com/ysyed9/SmartSyllabus/issues)

---

🎉 **Congratulations!** Your SmartSyllabus application is now deployed and ready for production use. 