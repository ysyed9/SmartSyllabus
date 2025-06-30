const Syllabus = require('../models/Syllabus');
const { createEvent } = require('ics');
const { format } = require('date-fns');

// Generate calendar events from syllabus assignments
exports.generateCalendar = async (req, res) => {
  try {
    const { syllabusId } = req.params;
    const syllabus = await Syllabus.findById(syllabusId);
    
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }

    const events = [];
    
    // Create events for each assignment
    syllabus.assignments.forEach((assignment, index) => {
      const dueDate = new Date(assignment.dueDate);
      
      events.push({
        start: [
          dueDate.getFullYear(),
          dueDate.getMonth() + 1,
          dueDate.getDate(),
          dueDate.getHours(),
          dueDate.getMinutes()
        ],
        duration: { hours: 1 },
        title: `${assignment.title} - ${syllabus.courseCode}`,
        description: assignment.description || `Due: ${assignment.title}`,
        location: syllabus.courseName,
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        organizer: { name: syllabus.instructor, email: syllabus.contactInfo?.email || '' },
        categories: [assignment.type, syllabus.courseCode]
      });
    });

    // Generate iCal file
    const { error, value } = createEvent(events);
    
    if (error) {
      return res.status(500).json({ error: 'Failed to generate calendar' });
    }

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="${syllabus.courseCode}-calendar.ics"`);
    
    res.send(value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate calendar for all syllabi
exports.generateAllCalendars = async (req, res) => {
  try {
    const syllabi = await Syllabus.find();
    const events = [];
    
    syllabi.forEach(syllabus => {
      syllabus.assignments.forEach(assignment => {
        const dueDate = new Date(assignment.dueDate);
        
        events.push({
          start: [
            dueDate.getFullYear(),
            dueDate.getMonth() + 1,
            dueDate.getDate(),
            dueDate.getHours(),
            dueDate.getMinutes()
          ],
          duration: { hours: 1 },
          title: `${assignment.title} - ${syllabus.courseCode}`,
          description: assignment.description || `Due: ${assignment.title}`,
          location: syllabus.courseName,
          status: 'CONFIRMED',
          busyStatus: 'BUSY',
          organizer: { name: syllabus.instructor, email: syllabus.contactInfo?.email || '' },
          categories: [assignment.type, syllabus.courseCode]
        });
      });
    });

    const { error, value } = createEvent(events);
    
    if (error) {
      return res.status(500).json({ error: 'Failed to generate calendar' });
    }

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="all-syllabi-calendar.ics"');
    
    res.send(value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get upcoming assignments
exports.getUpcomingAssignments = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + parseInt(days));
    
    const syllabi = await Syllabus.find({
      'assignments.dueDate': { $lte: cutoffDate, $gte: new Date() }
    });

    const upcomingAssignments = [];
    
    syllabi.forEach(syllabus => {
      syllabus.assignments.forEach(assignment => {
        const dueDate = new Date(assignment.dueDate);
        if (dueDate >= new Date() && dueDate <= cutoffDate) {
          upcomingAssignments.push({
            ...assignment.toObject(),
            courseCode: syllabus.courseCode,
            courseName: syllabus.courseName,
            instructor: syllabus.instructor,
            syllabusId: syllabus._id
          });
        }
      });
    });

    // Sort by due date
    upcomingAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    res.json(upcomingAssignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 