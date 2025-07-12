# SmartSyllabus Backend API Structure for Vercel

This backend has been reorganized to work with Vercel's serverless functions architecture.

## Directory Structure

```
backend/
├── api/                    # Vercel API routes
│   ├── index.js           # Main Express app setup
│   ├── [...all].js        # Catch-all handler for all routes
│   ├── hello.js           # Test endpoint
│   ├── syllabi.js         # Syllabus routes
│   └── calendar.js        # Calendar routes
├── controllers/            # Business logic
├── models/                 # Database models
├── routes/                 # Original Express routes (kept for reference)
├── uploads/               # File uploads
└── vercel.json           # Vercel configuration
```

## API Endpoints

### Test Endpoint
- `GET /api/hello` - Test endpoint to verify deployment

### Syllabus Endpoints
- `GET /api/syllabi` - Get all syllabi
- `POST /api/syllabi` - Create new syllabus
- `GET /api/syllabi/:id` - Get single syllabus
- `PUT /api/syllabi/:id` - Update syllabus
- `DELETE /api/syllabi/:id` - Delete syllabus
- `POST /api/syllabi/upload` - Upload syllabus file

### Calendar Endpoints
- `GET /api/calendar/syllabus/:syllabusId` - Generate calendar for specific syllabus
- `GET /api/calendar/all` - Generate calendar for all syllabi
- `GET /api/calendar/upcoming` - Get upcoming assignments

## How It Works

1. **Entry Point**: `api/[...all].js` catches all requests and routes them to the Express app
2. **Express App**: `api/index.js` sets up the Express server with middleware and database connection
3. **Routes**: Individual route files (`api/syllabi.js`, `api/calendar.js`) handle specific endpoints
4. **Controllers**: Business logic remains in the `controllers/` directory
5. **Vercel Config**: `vercel.json` tells Vercel how to build and route requests

## Deployment

The backend will be deployed to Vercel and available at:
- `https://your-project.vercel.app/api/*`

## Environment Variables

Make sure to set these environment variables in your Vercel dashboard:
- `MONGODB_URI` - Your MongoDB connection string
- `NODE_ENV` - Set to "production"

## Local Development

For local development, you can still run the original `app.js`:

```bash
cd backend
npm start
```

This will run the server on `http://localhost:5000` with the same API endpoints. 