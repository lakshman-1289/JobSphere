const express = require('express');
const router = express.Router();
const {
    getRecruiterProfile,
    createRecruiterProfile,
    updateRecruiterProfile,
    deleteRecruiterProfile
} = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and restricted to recruiters
router.use(protect);
router.use(authorize('recruiter'));

router.route('/profile')
    .get(getRecruiterProfile)
    .post(createRecruiterProfile)
    .put(updateRecruiterProfile)
    .delete(deleteRecruiterProfile);

module.exports = router;
