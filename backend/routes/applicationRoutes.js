const express = require('express');
const router = express.Router();
const { applyJob, getStudentApplications, getJobApplicants, updateStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/apply/:jobId', protect, authorize('student'), applyJob);
router.get('/student', protect, authorize('student'), getStudentApplications);
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplicants);
router.patch('/status/:id', protect, authorize('recruiter'), updateStatus);

module.exports = router;
