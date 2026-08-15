const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');                          // ✅ ADD THIS LINE
const PYQ = require('../models/Pyq');
const Subject = require('../models/Subject');
const PYQ_MAPPING = require('../config/pyqMapping');

// ---------------- FILE UPLOAD CONFIG ----------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'aktu-pyqs',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

// ---------------- GET PYQS ----------------
// const getPYQs = async (req, res) => {
//   try {
//     const { semester, year, search } = req.query;
//     let filter = {};

//     // Only apply semester/year filters when NOT searching
//     if (!search) {
//       if (semester) filter.semester = semester.toString();
//       if (year) filter.year = year.toString();
//     } else {
//       if (year) filter.year = year.toString();

//       filter.$or = [
//         { title: { $regex: search, $options: "i" } },
//         { subjectCode: { $regex: search, $options: "i" } },
//       ];
//     }

//     const pyqs = await PYQ.find(filter).sort({ createdAt: -1 });

//     return res.json({
//       success: true,
//       count: pyqs.length,
//       data: {
//         pyqs,
//       },
//     });

//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
// ---------------- GET PYQS ----------------
const getPYQs = async (req, res) => {
  try {
    const { semester, year, search } = req.query;

    let filter = {};

    // --------------------------------------------------
    // 1. SEMESTER FILTER
    // --------------------------------------------------
    if (semester) {
      const semesterKey = semester.toString();
      const semesterMapping = PYQ_MAPPING[semesterKey];

      // Semester doesn't exist in our verified mapping
      if (!semesterMapping) {
        return res.json({
          success: true,
          count: 0,
          data: {
            pyqs: [],
          },
        });
      }

      // Get only the MongoDB years that contain
      // verified/current-syllabus papers.
      const validDbYears = Object.keys(semesterMapping);

      // No valid papers for this semester
      if (validDbYears.length === 0) {
        return res.json({
          success: true,
          count: 0,
          data: {
            pyqs: [],
          },
        });
      }

      filter.semester = semesterKey;
      filter.year = { $in: validDbYears };

      // --------------------------------------------------
      // 2. ACADEMIC YEAR FILTER
      // --------------------------------------------------
      // --------------------------------------------------
// 2. YEAR FILTER
// --------------------------------------------------
if (year) {
  const requestedYear = year.toString();

  // The frontend sends the actual MongoDB year.
  // Example:
  // Sem 2 -> 2023
  // Sem 2 -> 2024
  // Sem 4 -> 2024
  // Sem 4 -> 2025

  const validDbYears = Object.keys(semesterMapping);

  // Make sure the requested year is allowed
  // for this semester.
  if (!validDbYears.includes(requestedYear)) {
    return res.json({
      success: true,
      count: 0,
      data: {
        pyqs: [],
      },
    });
  }

  filter.year = requestedYear;
}
    }

    // --------------------------------------------------
    // 3. SEARCH
    // --------------------------------------------------
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          subjectCode: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // --------------------------------------------------
    // 4. FETCH PYQS
    // --------------------------------------------------
    const pyqs = await PYQ.find(filter)
      .sort({ createdAt: -1 });

    // --------------------------------------------------
    // 5. ADD ACTUAL ACADEMIC YEAR
    // --------------------------------------------------
    const formattedPYQs = pyqs.map((pyq) => {
      const pyqObject = pyq.toObject();

      const semesterMapping =
        PYQ_MAPPING[pyq.semester] || {};

      return {
        ...pyqObject,

        // Original MongoDB year remains untouched
        year: pyq.year,

        // Actual year shown to the frontend
        academicYear:
          semesterMapping[pyq.year] || pyq.year,
      };
    });

    return res.json({
      success: true,
      count: formattedPYQs.length,
      data: {
        pyqs: formattedPYQs,
      },
    });

  } catch (err) {
    console.error("getPYQs error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ---------------- CREATE PYQ ----------------
const createPYQ = async (req, res) => {
  try {
    const { title, subject, semester, year } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'PDF file is required' });
    }

    const newPYQ = await PYQ.create({
      title,
      subject,
      semester,
      year,
      fileUrl: req.file.path,
      uploadedBy: req.user?._id || null,
    });

    return res.status(201).json({ success: true, data: { pyq: newPYQ } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- DELETE PYQ ----------------
const deletePYQ = async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);

    if (!pyq) {
      return res.status(404).json({ success: false, message: 'PYQ not found' });
    }

    const filePath = path.join(__dirname, '..', pyq.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await pyq.deleteOne();
    return res.json({ success: true, message: 'PYQ deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- SERVE / PROXY FILE ----------------  ✅ ADD THIS FUNCTION
const serveFile = async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);
    if (!pyq) {
      return res.status(404).json({ success: false, message: 'PYQ not found' });
    }

    // Local file (uploaded via form or seeded)
    if (pyq.fileUrl.startsWith('/uploads')) {
      const filePath = path.join(__dirname, '..', pyq.fileUrl);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'File not found on disk' });
      }
      return res.sendFile(filePath);
    }

    // Remote file (scraped from ABESIT) — proxy it
    const fullUrl = pyq.fileUrl.startsWith('http')
      ? pyq.fileUrl
      : new URL(pyq.fileUrl, 'https://www.abesit.in').href;

    const response = await axios.get(fullUrl, {
      responseType: 'stream',
      timeout: 15000,
      maxRedirects: 10,
      headers: {
        Referer: 'https://www.abesit.in/library/question-paper-bank/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'application/pdf,*/*',
      },
    });

    const ct = response.headers['content-type'] || '';
    if (ct.includes('text/html')) {
      return res.status(502).json({ success: false, message: 'File is protected by ABESIT' });
    }

    const safeName = (pyq.title || 'paper').replace(/[^a-z0-9]/gi, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeName}.pdf"`);
    response.data.pipe(res);

  } catch (err) {
    console.error('serveFile error:', err.message);
    res.status(500).json({ success: false, message: 'Could not fetch file' });
  }
};

// ---------------- EXPORTS ----------------
module.exports = {
  upload,
  getPYQs,
  createPYQ,
  deletePYQ,
  serveFile,                                            // ✅ ADD THIS
};