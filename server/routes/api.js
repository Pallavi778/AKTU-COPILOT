const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Controllers
const authController = require('../controllers/authController');
const subjectController = require('../controllers/subjectController');
const pyqController = require('../controllers/pyqController');
const notesController = require('../controllers/notesController');
const scholarshipController = require('../controllers/scholarshipController');
const noticeController = require('../controllers/noticeController');
const aiController = require('../controllers/aiController');

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

// Notice Routes
router.get('/notices', noticeController.getNotices);
router.post('/notices', protect, noticeController.createNotice);

// AI & Analytics Placeholder Routes
router.post('/ai/chat', protect, aiController.chat);
router.get('/ai/analytics/:subjectCode', protect, aiController.getAnalytics);
router.get('/ai/predictions/:subjectCode', protect, aiController.getPredictions);
router.post('/ai/viva/start', protect, aiController.startViva);
router.post('/ai/viva/submit', protect, aiController.submitVivaAnswer);
router.post('/ai/planner', protect, aiController.generatePlan);

module.exports = router;
