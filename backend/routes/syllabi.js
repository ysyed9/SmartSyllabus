const express = require('express');
const router = express.Router();
const syllabusController = require('../controllers/syllabusController');

// Get all syllabi
router.get('/', syllabusController.getAllSyllabi);

// Get single syllabus
router.get('/:id', syllabusController.getSyllabus);

// Create new syllabus
router.post('/', syllabusController.createSyllabus);

// Upload syllabus file
router.post('/upload', syllabusController.uploadSyllabus);

// Update syllabus
router.put('/:id', syllabusController.updateSyllabus);

// Delete syllabus
router.delete('/:id', syllabusController.deleteSyllabus);

// Assignment routes
router.post('/:id/assignments', syllabusController.addAssignment);
router.put('/:syllabusId/assignments/:assignmentId', syllabusController.updateAssignment);
router.delete('/:syllabusId/assignments/:assignmentId', syllabusController.deleteAssignment);

module.exports = router; 