const Syllabus = require('../models/Syllabus');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');

// Configure multer for file uploads
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
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

// Get all syllabi
exports.getAllSyllabi = async (req, res) => {
  try {
    const syllabi = await Syllabus.find().sort({ createdAt: -1 });
    res.json(syllabi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single syllabus
exports.getSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id);
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new syllabus
exports.createSyllabus = async (req, res) => {
  try {
    const syllabus = new Syllabus(req.body);
    const savedSyllabus = await syllabus.save();
    res.status(201).json(savedSyllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update syllabus
exports.updateSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    res.json(syllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete syllabus
exports.deleteSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findByIdAndDelete(req.params.id);
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    // Delete associated file if it exists
    if (syllabus.originalFile && syllabus.originalFile.path) {
      const filePath = path.join(__dirname, '..', syllabus.originalFile.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.json({ message: 'Syllabus deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload syllabus file and extract text
exports.uploadSyllabus = async (req, res) => {
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

      // Create syllabus with extracted text
      const syllabusData = {
        ...req.body,
        originalFile: {
          filename: req.file.originalname,
          path: req.file.path,
          mimetype: req.file.mimetype
        },
        extractedText: extractedText
      };

      const syllabus = new Syllabus(syllabusData);
      const savedSyllabus = await syllabus.save();

      res.status(201).json(savedSyllabus);
    } catch (error) {
      // Clean up uploaded file if processing fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: error.message });
    }
  });
};

// Add assignment to syllabus
exports.addAssignment = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id);
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }

    syllabus.assignments.push(req.body);
    const updatedSyllabus = await syllabus.save();
    res.json(updatedSyllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { syllabusId, assignmentId } = req.params;
    const syllabus = await Syllabus.findById(syllabusId);
    
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }

    const assignment = syllabus.assignments.id(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    Object.assign(assignment, req.body);
    const updatedSyllabus = await syllabus.save();
    res.json(updatedSyllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { syllabusId, assignmentId } = req.params;
    const syllabus = await Syllabus.findById(syllabusId);
    
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }

    syllabus.assignments.pull(assignmentId);
    const updatedSyllabus = await syllabus.save();
    res.json(updatedSyllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 