const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private (Student only)
const getProfile = async (req, res) => {
    try {
        let profile = await StudentProfile.findOne({ user: req.user.id });

        if (!profile) {
            // Return empty/default structure if not found (but don't create it yet)
            return res.status(200).json({
                user: req.user.id,
                title: 'Aspiring Professional',
                bio: '',
                location: '',
                phone: '',
                skills: [],
                education: [],
                projects: [],
                certifications: [],
                socialLinks: { linkedin: '', github: '', portfolio: '' },
                resume: ''
            });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create or Update user profile
// @route   PUT /api/profile
// @access  Private (Student only)
const updateProfile = async (req, res) => {
    try {
        const {
            title, bio, location, phone, skills, education, projects, certifications, socialLinks, resume, resumeData
        } = req.body;

        // Build profile object
        const profileFields = {
            user: req.user.id,
            title,
            bio,
            location,
            phone,
            skills,
            education,
            projects,
            certifications,
            socialLinks,
            resume,
            resumeData
        };

        // Upsert: Find and update, or create if new
        let profile = await StudentProfile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json(profile);
    } catch (error) {
        console.error("Update Profile Error Details:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile
};
