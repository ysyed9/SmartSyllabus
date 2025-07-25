const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'https://smartsyllabus.vercel.app',
    'https://smartsyllabus-frontend.vercel.app',
    'https://smart-syllabus-dormcuv64-younussyed989s-projects.vercel.app',
    'https://smart-syllabus-git-main-younussyed989s-projects.vercel.app',
    'https://smart-syllabus-younussyed989s-projects.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add CORS debugging middleware
app.use((req, res, next) => {
  console.log('🌐 Request Origin:', req.headers.origin);
  console.log('🌐 Request Method:', req.method);
  console.log('🌐 Request URL:', req.url);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/syllabus-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.stack);
  process.exit(1);
});

// Routes
console.log('Setting up routes...');
app.use('/api/syllabi', require('./routes/syllabi'));
app.use('/api/calendar', require('./routes/calendar'));

// Add /api/hello route for Render deployments
app.get('/api/hello', (req, res) => {
  res.status(200).json({
    message: "Hello from SmartSyllabus backend!",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err.stack);
  console.error('Request URL:', req.url);
  console.error('Request Method:', req.method);
  res.status(500).json({ 
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 Not Found:', req.method, req.url);
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
