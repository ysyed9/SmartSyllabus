# Deploying SmartSyllabus Backend to Vercel

## Prerequisites

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Make sure you have a Vercel account and are logged in:
```bash
vercel login
```

## Deployment Steps

1. **Navigate to the backend directory:**
```bash
cd backend
```

2. **Deploy to Vercel:**
```bash
vercel
```

3. **Follow the prompts:**
   - Link to existing project or create new one
   - Set project name (e.g., `smartsyllabus-backend`)
   - Confirm deployment settings

## Environment Variables

Set these in your Vercel dashboard:

1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/syllabus-app
NODE_ENV=production
```

## API Endpoints

After deployment, your API will be available at:
- `https://your-project.vercel.app/api/*`

### Test the deployment:
```bash
curl https://your-project.vercel.app/api/hello
```

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error:**
   - Check that `MONGODB_URI` is set correctly in Vercel
   - Ensure your MongoDB cluster allows connections from Vercel's IP ranges

2. **File Upload Issues:**
   - Vercel has read-only filesystem, so file uploads won't persist
   - Consider using cloud storage (AWS S3, Cloudinary) for production

3. **CORS Issues:**
   - Update the CORS origins in `api/index.js` to include your frontend domain

### Local Testing:

You can test the new API structure locally:

```bash
cd backend
npm start
```

The API will be available at `http://localhost:5000/api/*`

## Production Considerations

1. **File Storage:** Use cloud storage for file uploads
2. **Database:** Use MongoDB Atlas or similar cloud database
3. **Environment Variables:** Set all required environment variables in Vercel
4. **CORS:** Update CORS origins to match your production frontend domain 