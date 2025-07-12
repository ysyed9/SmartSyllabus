const express = require('express');
const router = express.Router();
const syllabusController = require('../controllers/syllabusController');

// Get all syllabi
router.get('/', syllabusController.getAllSyllabi);

// Create new syllabus
router.post('/', syllabusController.createSyllabus);

// Get single syllabus
router.get('/:id', syllabusController.getSyllabus);

// Update syllabus
router.put('/:id', syllabusController.updateSyllabus);

// Delete syllabus
router.delete('/:id', syllabusController.deleteSyllabus);

// Upload syllabus file
router.post('/upload', syllabusController.uploadSyllabus);

// Assignment routes - temporarily commented out to isolate issue
// router.post('/:id/assignments', syllabusController.addAssignment);
// router.put('/:id/assignments/:assignmentId', syllabusController.updateAssignment);
// router.delete('/:id/assignments/:assignmentId', syllabusController.deleteAssignment);

module.exports = router; 