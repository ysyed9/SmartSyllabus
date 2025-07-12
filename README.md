# SmartSyllabus

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5+-green.svg)](https://www.mongodb.com/)

A comprehensive syllabus management system that allows users to upload, organize, and track course syllabi with automatic text extraction, assignment tracking, and calendar integration. SmartSyllabus makes managing academic schedules effortless with AI-powered text extraction and intelligent assignment organization.

## 🌟 Live Demo

[View Live Demo](https://smart-syllabus-dormcuv64-younussyed989s-projects.vercel.app/) | [Report Bug](https://github.com/ysyed9/SmartSyllabus/issues) | [Request Feature](https://github.com/ysyed9/SmartSyllabus/issues)

## 🚀 Quick Start

Want to run this project locally? Follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/ysyed9/SmartSyllabus.git
cd SmartSyllabus

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Set up environment variables (see Environment Setup below)

# 4. Start the development servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

## Features

### 📚 Syllabus Management
- Upload PDF and image files with automatic text extraction
- OCR support for image-based syllabi
- Organize syllabi by course, semester, and year
- Search and filter functionality
- Edit course information and instructor details

### 📅 Assignment Tracking
- Add, edit, and delete assignments
- Set due dates, weights, and assignment types
- Track assignment completion status
- View upcoming assignments with urgency indicators

### 🗓️ Calendar Integration
- Generate iCal files for individual courses
- Download comprehensive calendar with all assignments
- View upcoming assignments timeline
- Color-coded urgency indicators

### 🎨 Modern UI
- Responsive design with Tailwind CSS
- Clean, intuitive interface
- Real-time updates and notifications
- Mobile-friendly layout

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Multer** for file uploads
- **pdf-parse** for PDF text extraction
- **Tesseract.js** for OCR
- **ics** for calendar generation

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **date-fns** for date manipulation
- **Lucide React** for icons

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection (Required)
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/syllabus-app?retryWrites=true&w=majority

# Server Configuration (Optional)
PORT=5000
NODE_ENV=development
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# Backend API URL (Required)
VITE_API_URL=http://localhost:5000/api

# For production, use your deployed backend URL:
# VITE_API_URL=https://your-backend-url.onrender.com/api
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ysyed9/SmartSyllabus.git
   cd SmartSyllabus
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables** (see Environment Setup above)

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using a local installation:
   ```bash
   mongod
   ```

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

### Production Mode

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm start
   ```

## 🚀 Deployment

### Backend Deployment (Render)

1. **Fork this repository**
2. **Connect to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New Web Service"
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `NODE_ENV`: `production`

### Frontend Deployment (Vercel)

1. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variable:
     - `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-app.onrender.com/api`)

2. **Deploy automatically** on every push to main branch

## API Endpoints

### Syllabi
- `GET /api/syllabi` - Get all syllabi
- `GET /api/syllabi/:id` - Get specific syllabus
- `POST /api/syllabi` - Create new syllabus
- `POST /api/syllabi/upload` - Upload syllabus file
- `PUT /api/syllabi/:id` - Update syllabus
- `DELETE /api/syllabi/:id` - Delete syllabus

### Assignments
- `POST /api/syllabi/:id/assignments` - Add assignment
- `PUT /api/syllabi/:syllabusId/assignments/:assignmentId` - Update assignment
- `DELETE /api/syllabi/:syllabusId/assignments/:assignmentId` - Delete assignment

### Calendar
- `GET /api/calendar/syllabus/:syllabusId` - Download syllabus calendar
- `GET /api/calendar/all` - Download all syllabi calendar
- `GET /api/calendar/upcoming` - Get upcoming assignments

## File Upload Support

The application supports:
- **PDF files** - Automatic text extraction
- **Image files** - OCR text extraction using Tesseract.js
- **Maximum file size**: 10MB
- **Supported formats**: PDF, PNG, JPG, JPEG, GIF, BMP

## Database Schema

### Syllabus
```javascript
{
  courseCode: String,
  courseName: String,
  instructor: String,
  semester: String,
  year: Number,
  description: String,
  officeHours: String,
  contactInfo: {
    email: String,
    phone: String,
    office: String
  },
  assignments: [Assignment],
  originalFile: {
    filename: String,
    path: String,
    mimetype: String
  },
  extractedText: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Assignment
```javascript
{
  title: String,
  description: String,
  dueDate: Date,
  type: String, // 'assignment', 'exam', 'quiz', 'project', 'other'
  weight: Number,
  completed: Boolean
}
```

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your backend CORS configuration includes your frontend domain
   - Check that environment variables are set correctly

2. **MongoDB Connection Issues**
   - Verify your MongoDB connection string
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Check that the database name is correct

3. **File Upload Failures**
   - Check file size (max 10MB)
   - Verify file format is supported
   - Ensure uploads directory has write permissions

4. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all environment variables are set

### Development Tips

- Use `npm run dev` for both frontend and backend during development
- Check browser console and server logs for detailed error messages
- Use MongoDB Compass for database visualization
- Test API endpoints with Postman or similar tools

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🤝 Contributing to SmartSyllabus

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the [GitHub repository](https://github.com/ysyed9/SmartSyllabus/issues).

## 📞 Contact

- **GitHub**: [@ysyed9](https://github.com/ysyed9)
- **Repository**: [SmartSyllabus](https://github.com/ysyed9/SmartSyllabus) 
