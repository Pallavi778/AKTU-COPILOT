const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Notes = require('../models/Notes');
const Subject = require('../models/Subject');
const { getStatus } = require('../config/db');
const mockDb = require('../config/mockDb');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'notes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'note-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter (Allow only PDFs)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

exports.upload = multer({ storage, fileFilter });

// @desc    Get all Notes (with branch, semester, subject, chapter filters)
// @route   GET /api/notes
// @access  Public
exports.getNotes = async (req, res) => {
  try {
    const { branch, semester, subject, chapter, search } = req.query;

    // --- FAILOVER MODE ---
    if (!getStatus()) {
      let filtered = [...mockDb.notes];

      if (branch && branch !== 'All') {
        filtered = filtered.filter(n => n.branch === branch);
      }
      if (semester) {
        filtered = filtered.filter(n => n.semester === Number(semester));
      }
      if (subject && subject !== 'All') {
        filtered = filtered.filter(n => {
          const subId = n.subject?._id || n.subject;
          return subId === subject;
        });
      }
      if (chapter) {
        const term = chapter.toLowerCase();
        filtered = filtered.filter(n => n.chapter.toLowerCase().includes(term));
      }
      if (search) {
        const term = search.toLowerCase();
        filtered = filtered.filter(n => n.title.toLowerCase().includes(term));
      }

      // Populate subject structures from memory
      filtered = filtered.map(n => {
        let subjObj = n.subject;
        if (typeof n.subject === 'string') {
          subjObj = mockDb.subjects.find(s => s._id === n.subject);
        }
        return {
          ...n,
          subject: subjObj,
        };
      });

      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    // --- STANDARD MONGO MODE ---
    const filter = {};

    if (branch && branch !== 'All') {
      filter.branch = branch;
    }
    if (semester) {
      filter.semester = Number(semester);
    }
    if (subject && subject !== 'All') {
      filter.subject = subject;
    }
    if (chapter) {
      filter.chapter = { $regex: chapter, $options: 'i' };
    }
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const notesList = await Notes.find(filter)
      .populate('subject')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: notesList.length, data: notesList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload new Notes
// @route   POST /api/notes
// @access  Private
exports.createNotes = async (req, res) => {
  try {
    const { title, subject, semester, branch, chapter } = req.body;

    if (!req.file && !req.body.fileUrl) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    const fileUrl = req.file 
      ? `/uploads/notes/${req.file.filename}` 
      : req.body.fileUrl;

    // --- FAILOVER MODE ---
    if (!getStatus()) {
      const subjectExists = mockDb.subjects.find(s => s._id === subject);
      if (!subjectExists) {
        return res.status(404).json({ success: false, message: 'Subject not found' });
      }

      const newNote = {
        _id: 'note_' + Date.now() + Math.round(Math.random() * 100),
        title,
        subject: subjectExists,
        semester: Number(semester),
        branch,
        chapter,
        fileUrl,
        uploadedBy: { name: req.user?.name || 'Student Upload' },
        createdAt: new Date(),
      };

      mockDb.notes.push(newNote);

      return res.status(201).json({ success: true, data: newNote });
    }

    // --- STANDARD MONGO MODE ---
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const note = await Notes.create({
      title,
      subject,
      semester: Number(semester),
      branch,
      chapter,
      fileUrl,
      uploadedBy: req.user._id,
    });

    const populated = await Notes.findById(note._id).populate('subject');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
