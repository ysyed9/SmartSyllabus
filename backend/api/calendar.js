const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

// Generate calendar for specific syllabus
router.get('/syllabus/:syllabusId', calendarController.generateCalendar);

// Generate calendar for all syllabi
router.get('/all', calendarController.generateAllCalendars);

// Get upcoming assignments
router.get('/upcoming', calendarController.getUpcomingAssignments);

module.exports = router; 