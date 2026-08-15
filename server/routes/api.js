const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Controllers
const aiController = require('../controllers/aiController');
const authController = require('../controllers/authController');
const subjectController = require('../controllers/subjectController');
const pyqController = require('../controllers/pyqController');
const notesController = require('../controllers/notesController');
const scholarshipController = require('../controllers/scholarshipController');


// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', protect, authController.getProfile);
router.put('/auth/profile', protect, authController.updateProfile);

// Subject Routes
router.get('/subjects', subjectController.getSubjects);
router.post('/subjects', protect, subjectController.createSubject);
// PYQ Routes
router.get('/pyqs', pyqController.getPYQs);
router.post('/pyqs', protect, pyqController.upload.single('file'), pyqController.createPYQ);
router.get('/pyqs/:id/file', pyqController.serveFile);   // ✅ ADD THIS LINE

// Notes Routes
router.get('/notes', notesController.getNotes);
router.post('/notes', protect, notesController.upload.single('file'), notesController.createNotes);

// Scholarship Routes
router.get('/scholarships', scholarshipController.getScholarships);
router.post('/scholarships', protect, scholarshipController.createScholarship);

// AI Predictor Route
router.post('/ai/predict', aiController.predict);

module.exports = router;
