const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  dueDate: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['assignment', 'exam', 'quiz', 'project', 'other'],
    default: 'assignment'
  },
  weight: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const syllabusSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    trim: true
  },
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  instructor: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  description: String,
  officeHours: String,
  contactInfo: {
    email: String,
    phone: String,
    office: String
  },
  assignments: [assignmentSchema],
  originalFile: {
    filename: String,
    path: String,
    mimetype: String
  },
  extractedText: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
syllabusSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Syllabus', syllabusSchema); 