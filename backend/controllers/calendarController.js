const Syllabus = require('../models/Syllabus');
const ics = require('ics');
const { parseISO, isAfter } = require('date-fns');

// Generate calendar events from syllabus assignments
exports.generateCalendar = async (req, res, next) => {
  try {
    console.log('📋 generateCalendar called for syllabus ID:', req.params.syllabusId);
    const { syllabusId } = req.params;
    const syllabus = await Syllabus.findById(syllabusId);
    
    if (!syllabus) {
      console.log('❌ Syllabus not found for calendar generation, ID:', syllabusId);
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    const events = syllabus.assignments.map(assignment => ({
      title: `${syllabus.courseCode}: ${assignment.title}`,
      description: assignment.description || '',
      start: parseISO(assignment.dueDate),
      end: parseISO(assignment.dueDate),
      location: syllabus.courseName
    }));
    
    const { error, value } = ics.createEvents(events);
    if (error) {
      console.error('❌ Error creating calendar events:', error);
      return res.status(500).json({ error: 'Failed to generate calendar' });
    }
    
    console.log('✅ Calendar generated for syllabus:', syllabus.courseCode);
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="${syllabus.courseCode}-calendar.ics"`);
    res.send(value);
  } catch (err) {
    console.error('❌ Error in generateCalendar:', err.stack);
    next(err);
  }
};

// Generate calendar for all syllabi
exports.generateAllCalendars = async (req, res, next) => {
  try {
    console.log('📋 generateAllCalendars called');
    const syllabi = await Syllabus.find();
    const events = [];
    
    syllabi.forEach(syllabus => {
      syllabus.assignments.forEach(assignment => {
        events.push({
          title: `${syllabus.courseCode}: ${assignment.title}`,
          description: assignment.description || '',
          start: parseISO(assignment.dueDate),
          end: parseISO(assignment.dueDate),
          location: syllabus.courseName
        });
      });
    });
    
    const { error, value } = ics.createEvents(events);
    if (error) {
      console.error('❌ Error creating all calendar events:', error);
      return res.status(500).json({ error: 'Failed to generate calendar' });
    }
    
    console.log('✅ All calendars generated with', events.length, 'events');
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="all-syllabi-calendar.ics"');
    res.send(value);
  } catch (err) {
    console.error('❌ Error in generateAllCalendars:', err.stack);
    next(err);
  }
};

// Get upcoming assignments
exports.getUpcomingAssignments = async (req, res, next) => {
  try {
    console.log('📋 getUpcomingAssignments called');
    const { days = 30 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + parseInt(days));
    
    const syllabi = await Syllabus.find();
    const upcomingAssignments = [];
    
    syllabi.forEach(syllabus => {
      syllabus.assignments.forEach(assignment => {
        const dueDate = new Date(assignment.dueDate);
        if (isAfter(dueDate, new Date()) && isAfter(cutoffDate, dueDate)) {
          upcomingAssignments.push({
            ...assignment.toObject(),
            courseCode: syllabus.courseCode,
            courseName: syllabus.courseName,
            syllabusId: syllabus._id
          });
        }
      });
    });
    
    // Sort by due date
    upcomingAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    console.log('✅ Found', upcomingAssignments.length, 'upcoming assignments');
    res.json(upcomingAssignments);
  } catch (err) {
    console.error('❌ Error in getUpcomingAssignments:', err.stack);
    next(err);
  }
};
