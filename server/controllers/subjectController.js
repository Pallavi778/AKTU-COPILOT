const Subject = require('../models/Subject');
const { getStatus } = require('../config/db');
const mockDb = require('../config/mockDb');

// @desc    Get all subjects (optionally filtered by branch/semester)
// @route   GET /api/subjects
// @access  Public
exports.getSubjects = async (req, res) => {
  try {
    const { branch, semester } = req.query;

    // --- FAILOVER MODE ---
    if (!getStatus()) {
      let filtered = [...mockDb.subjects];

      if (branch && branch !== 'All') {
        filtered = filtered.filter(s => s.branch === branch);
      }
      if (semester) {
        filtered = filtered.filter(s => s.semester === Number(semester));
      }

      // Sort by code
      filtered.sort((a, b) => a.code.localeCompare(b.code));

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

    const subjects = await Subject.find(filter).sort({ code: 1 });
    res.json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private
exports.createSubject = async (req, res) => {
  try {
    const { name, code, semester, branch } = req.body;

    // --- FAILOVER MODE ---
    if (!getStatus()) {
      const codeUpper = code.toUpperCase();
      const subjectExists = mockDb.subjects.find(s => s.code === codeUpper);
      if (subjectExists) {
        return res.status(400).json({ success: false, message: `Subject code ${code} already exists` });
      }

      const newSubject = {
        _id: 'sub_' + Date.now() + Math.round(Math.random() * 100),
        name,
        code: codeUpper,
        semester: Number(semester),
        branch,
      };

      mockDb.subjects.push(newSubject);

      return res.status(201).json({ success: true, data: newSubject });
    }

    // --- STANDARD MONGO MODE ---
    const subjectExists = await Subject.findOne({ code: code.toUpperCase() });
    if (subjectExists) {
      return res.status(400).json({ success: false, message: `Subject code ${code} already exists` });
    }

    const subject = await Subject.create({
      name,
      code,
      semester,
      branch,
    });

    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
