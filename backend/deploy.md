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

---

The error message:

```json
{"error":"Route not found"}
```

means that the `/api/hello` route does **not** exist in your current backend deployment on Render.

---

## Why is this happening?

- On Render, your backend is running from `backend/app.js`, which uses the original Express setup.
- The `/api/hello` route only exists in your Vercel-compatible API structure (`backend/api/hello.js`), **not** in your `app.js` Express server.

---

## 🛠️ How to Fix

### Option 1: Add a `/api/hello` Route to `app.js` (Recommended for Render)

Add this to your `backend/app.js` before the 404 handler:

```js
app.get('/api/hello', (req, res) => {
  res.status(200).json({
    message: "Hello from SmartSyllabus backend!",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
});
```

**Then redeploy to Render.**

---

### Option 2: Use Only the Vercel API Structure (Not recommended for Render)

- The Vercel `/api/hello` route works only if you deploy the backend to Vercel, not Render.

---

## ✅ What to Do Next

1. **Add the `/api/hello` route to your `app.js` as shown above.**
2. **Push your changes to GitHub.**
3. **Render will redeploy automatically.**
4. **Test:**  
   [https://smartsyllabus.onrender.com/api/hello](https://smartsyllabus.onrender.com/api/hello)

You should see:
```json
{
  "message": "Hello from SmartSyllabus backend!",
  ...
}
```

---

Let me know if you want me to make this code change for you! 