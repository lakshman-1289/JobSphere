const express = require('express');
const router = express.Router();
const { getJobs, getMyJobs, createJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, getJobs).post(protect, authorize('recruiter'), createJob);
router.route('/myjobs').get(protect, authorize('recruiter'), getMyJobs);

module.exports = router;
