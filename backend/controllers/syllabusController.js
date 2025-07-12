const Syllabus = require('../models/Syllabus');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');

// Configure multer for file uploads
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use path relative to the API directory for Vercel compatibility
    const uploadPath = path.join(__dirname, '../uploads/');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
}).single('syllabus');

// Function to parse syllabus text and extract course information
const parseSyllabusText = (text, filename = '') => {
  const extractedData = {
    courseCode: '',
    courseName: '',
    instructor: '',
    semester: '',
    year: new Date().getFullYear(),
    description: '',
    officeHours: '',
    contactInfo: {
      email: '',
      phone: '',
      office: ''
    }
  };

  if (!text) return extractedData;

  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // Extract course code (e.g., CS 101, MATH 201, etc.)
    if (!extractedData.courseCode) {
      const courseCodeMatch = line.match(/([A-Z]{2,4}\s+\d{3,4})/i);
      if (courseCodeMatch) {
        extractedData.courseCode = courseCodeMatch[1].toUpperCase();
      }
    }

    // Extract course name (usually appears after course code or on its own line)
    if (!extractedData.courseName && extractedData.courseCode) {
      // Look for course name in the next few lines after course code
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const nextLine = lines[j];
        if (nextLine.length > 3 && nextLine.length < 100 && 
            !nextLine.match(/^\d/) && 
            !nextLine.toLowerCase().includes('instructor') &&
            !nextLine.toLowerCase().includes('office') &&
            !nextLine.toLowerCase().includes('email')) {
          extractedData.courseName = nextLine;
          break;
        }
      }
    }

    // Extract instructor name
    if (!extractedData.instructor) {
      if (lowerLine.includes('instructor') || lowerLine.includes('professor') || lowerLine.includes('teacher')) {
        const instructorMatch = line.match(/(?:instructor|professor|teacher)[:\s]+(.+)/i);
        if (instructorMatch) {
          extractedData.instructor = instructorMatch[1].trim();
        } else if (i + 1 < lines.length) {
          // Sometimes instructor name is on the next line
          extractedData.instructor = lines[i + 1].trim();
        }
      }
    }

    // Extract semester and year
    if (!extractedData.semester || !extractedData.year) {
      if (lowerLine.includes('fall') || lowerLine.includes('spring') || lowerLine.includes('summer') || lowerLine.includes('winter')) {
        const semesterMatch = line.match(/(fall|spring|summer|winter)\s+(\d{4})/i);
        if (semesterMatch) {
          extractedData.semester = semesterMatch[1].charAt(0).toUpperCase() + semesterMatch[1].slice(1);
          extractedData.year = parseInt(semesterMatch[2]);
        }
      }
    }

    // Extract email
    if (!extractedData.contactInfo.email) {
      const emailMatch = line.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailMatch) {
        extractedData.contactInfo.email = emailMatch[1];
      }
    }

    // Extract phone number
    if (!extractedData.contactInfo.phone) {
      const phoneMatch = line.match(/(\(\d{3}\)\s*\d{3}-\d{4}|\d{3}-\d{3}-\d{4}|\d{10})/);
      if (phoneMatch) {
        extractedData.contactInfo.phone = phoneMatch[1];
      }
    }

    // Extract office hours
    if (!extractedData.officeHours) {
      if (lowerLine.includes('office hour') || lowerLine.includes('office time')) {
        extractedData.officeHours = line;
      }
    }

    // Extract office location
    if (!extractedData.contactInfo.office) {
      if (lowerLine.includes('office') && !lowerLine.includes('hour') && !lowerLine.includes('time')) {
        const officeMatch = line.match(/(?:office|room)[:\s]+(.+)/i);
        if (officeMatch) {
          extractedData.contactInfo.office = officeMatch[1].trim();
        }
      }
    }
  }

  // If we couldn't extract course code from the text, try to get it from the filename
  if (!extractedData.courseCode && filename) {
    const lowerFilename = filename.toLowerCase();
    const courseCodeMatch = lowerFilename.match(/([a-z]{2,4}\s*\d{3,4})/);
    if (courseCodeMatch) {
      extractedData.courseCode = courseCodeMatch[1].toUpperCase();
    }
  }

  return extractedData;
};

// Get all syllabi
exports.getAllSyllabi = async (req, res, next) => {
  try {
    console.log('📋 getAllSyllabi called');
    const syllabi = await Syllabus.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${syllabi.length} syllabi`);
    res.json(syllabi);
  } catch (err) {
    console.error('❌ Error in getAllSyllabi:', err.stack);
    next(err);
  }
};

// Get single syllabus
exports.getSyllabus = async (req, res, next) => {
  try {
    console.log('📋 getSyllabus called for ID:', req.params.id);
    const syllabus = await Syllabus.findById(req.params.id);
    if (!syllabus) {
      console.log('❌ Syllabus not found for ID:', req.params.id);
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    console.log('✅ Syllabus found:', syllabus.courseCode);
    res.json(syllabus);
  } catch (err) {
    console.error('❌ Error in getSyllabus:', err.stack);
    next(err);
  }
};

// Create new syllabus
exports.createSyllabus = async (req, res, next) => {
  try {
    console.log('📋 createSyllabus called with data:', req.body);
    const syllabus = new Syllabus(req.body);
    const savedSyllabus = await syllabus.save();
    console.log('✅ Syllabus created:', savedSyllabus.courseCode);
    res.status(201).json(savedSyllabus);
  } catch (err) {
    console.error('❌ Error in createSyllabus:', err.stack);
    next(err);
  }
};

// Update syllabus
exports.updateSyllabus = async (req, res, next) => {
  try {
    console.log('📋 updateSyllabus called for ID:', req.params.id);
    const syllabus = await Syllabus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!syllabus) {
      console.log('❌ Syllabus not found for update, ID:', req.params.id);
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    console.log('✅ Syllabus updated:', syllabus.courseCode);
    res.json(syllabus);
  } catch (err) {
    console.error('❌ Error in updateSyllabus:', err.stack);
    next(err);
  }
};

// Delete syllabus
exports.deleteSyllabus = async (req, res, next) => {
  try {
    console.log('📋 deleteSyllabus called for ID:', req.params.id);
    const syllabus = await Syllabus.findByIdAndDelete(req.params.id);
    if (!syllabus) {
      console.log('❌ Syllabus not found for deletion, ID:', req.params.id);
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    console.log('✅ Syllabus deleted:', syllabus.courseCode);
    res.json({ message: 'Syllabus deleted successfully' });
  } catch (err) {
    console.error('❌ Error in deleteSyllabus:', err.stack);
    next(err);
  }
};

// Upload syllabus file and extract text
exports.uploadSyllabus = async (req, res, next) => {
  try {
    console.log('📋 uploadSyllabus called');
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        let extractedText = '';
        const filePath = req.file.path;
        const fileType = req.file.mimetype;

        // Extract text based on file type
        if (fileType === 'application/pdf') {
          const dataBuffer = fs.readFileSync(filePath);
          const data = await pdfParse(dataBuffer);
          extractedText = data.text;
        } else if (fileType.startsWith('image/')) {
          // Use Tesseract.js for OCR
          const worker = await createWorker();
          await worker.loadLanguage('eng');
          await worker.initialize('eng');
          const { data: { text } } = await worker.recognize(filePath);
          await worker.terminate();
          extractedText = text;
        }

        // Parse the extracted text to get course information
        const parsedData = parseSyllabusText(extractedText, req.file.originalname);
        console.log('📋 Parsed syllabus data:', parsedData);

        // Merge parsed data with any provided form data, prioritizing form data
        const syllabusData = {
          ...parsedData,
          ...req.body,
          originalFile: {
            filename: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype
          },
          extractedText: extractedText
        };

        // Ensure required fields have fallback values
        if (!syllabusData.courseCode) {
          syllabusData.courseCode = 'UNKNOWN';
        }
        if (!syllabusData.courseName) {
          syllabusData.courseName = 'Course Name Not Found';
        }
        if (!syllabusData.instructor) {
          syllabusData.instructor = 'Instructor Not Found';
        }
        if (!syllabusData.semester) {
          syllabusData.semester = 'Fall';
        }
        if (!syllabusData.year) {
          syllabusData.year = new Date().getFullYear();
        }

        const syllabus = new Syllabus(syllabusData);
        const savedSyllabus = await syllabus.save();
        console.log('✅ Syllabus uploaded successfully with auto-filled fields');
        res.status(201).json(savedSyllabus);
      } catch (error) {
        // Clean up uploaded file if processing fails
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        console.error('❌ Error processing syllabus:', error);
        res.status(500).json({ error: error.message });
      }
    });
  } catch (err) {
    console.error('❌ Error in uploadSyllabus:', err.stack);
    next(err);
  }
};

// Add assignment to syllabus
exports.addAssignment = async (req, res, next) => {
  try {
    console.log('📋 addAssignment called for syllabus ID:', req.params.id);
    const syllabus = await Syllabus.findById(req.params.id);
    if (!syllabus) {
      console.log('❌ Syllabus not found for assignment, ID:', req.params.id);
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    syllabus.assignments.push(req.body);
    const updatedSyllabus = await syllabus.save();
    console.log('✅ Assignment added to syllabus:', syllabus.courseCode);
    res.json(updatedSyllabus);
  } catch (err) {
    console.error('❌ Error in addAssignment:', err.stack);
    next(err);
  }
};

// Update assignment
exports.updateAssignment = async (req, res, next) => {
  try {
    console.log('📋 updateAssignment called for syllabus:', req.params.id, 'assignment:', req.params.assignmentId);
    const { id, assignmentId } = req.params;
    const syllabus = await Syllabus.findById(id);
    if (!syllabus) {
      console.log('❌ Syllabus not found for assignment update, ID:', id);
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    const assignment = syllabus.assignments.id(assignmentId);
    if (!assignment) {
      console.log('❌ Assignment not found, ID:', assignmentId);
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    Object.assign(assignment, req.body);
    const updatedSyllabus = await syllabus.save();
    console.log('✅ Assignment updated in syllabus:', syllabus.courseCode);
    res.json(updatedSyllabus);
  } catch (err) {
    console.error('❌ Error in updateAssignment:', err.stack);
    next(err);
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res, next) => {
  try {
    console.log('📋 deleteAssignment called for syllabus:', req.params.id, 'assignment:', req.params.assignmentId);
    const { id, assignmentId } = req.params;
    const syllabus = await Syllabus.findById(id);
    if (!syllabus) {
      console.log('❌ Syllabus not found for assignment deletion, ID:', id);
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    syllabus.assignments = syllabus.assignments.filter(
      assignment => assignment._id.toString() !== assignmentId
    );
    const updatedSyllabus = await syllabus.save();
    console.log('✅ Assignment deleted from syllabus:', syllabus.courseCode);
    res.json(updatedSyllabus);
  } catch (err) {
    console.error('❌ Error in deleteAssignment:', err.stack);
    next(err);
  }
}; 