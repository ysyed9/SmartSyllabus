# SmartSyllabus

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5+-green.svg)](https://www.mongodb.com/)


A comprehensive syllabus management system that allows users to upload, organize, and track course syllabi with automatic text extraction, assignment tracking, and calendar integration. SmartSyllabus makes managing academic schedules effortless with AI-powered text extraction and intelligent assignment organization.

## 🌟 Live Demo

[View Live Demo](https://smartsyllabus-5zsqhwc82-younussyed989s-projects.vercel.app) | [Report Bug](https://github.com/ysyed9/SmartSyllabus/issues) | [Request Feature](https://github.com/ysyed9/SmartSyllabus/issues)

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

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/syllabus-app
   PORT=5000
   ```

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
