const asyncHandler = require('express-async-handler');
const RecruiterProfile = require('../models/RecruiterProfile');
const User = require('../models/User');

// @desc    Get current recruiter profile
// @route   GET /api/recruiter/profile
// @access  Private/Recruiter
const getRecruiterProfile = asyncHandler(async (req, res) => {
    const profile = await RecruiterProfile.findOne({ userId: req.user._id });

    if (!profile) {
        return res.status(404).json({ message: 'Recruiter profile not found' });
    }

    res.status(200).json(profile);
});

const allowedUpdates = [
    'fullName', 'email', 'phone', 'designation',
    'companyName', 'companyWebsite', 'industry', 'companySize',
    'companyLocation', 'companyDescription',
    'companyEmailDomain', 'linkedInUrl', 'registrationId'
];

// @desc    Create recruiter profile
// @route   POST /api/recruiter/profile
// @access  Private/Recruiter
const createRecruiterProfile = asyncHandler(async (req, res) => {
    const existingProfile = await RecruiterProfile.findOne({ userId: req.user._id });

    if (existingProfile) {
        res.status(400);
        throw new Error('Recruiter profile already exists');
    }

    // Filter req.body to only allowed fields
    const profileFields = {};
    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            profileFields[field] = req.body[field];
        }
    });

    // Add userId (required)
    profileFields.userId = req.user._id;

    // Log the received fields for debugging
    console.log('Creating Recruiter Profile for:', req.user._id);
    console.log('Received Body:', req.body);
    console.log('Filtered Fields:', profileFields);

    // Create
    try {
        const profile = await RecruiterProfile.create(profileFields);

        // SYNC: Update User model with basic details
        await User.findByIdAndUpdate(req.user._id, {
            name: profileFields.fullName,
            email: profileFields.email
        });

        res.status(201).json(profile);
    } catch (error) {
        console.error('Create Profile Error:', error);
        if (error.name === 'ValidationError') {
            res.status(400);
            const messages = Object.values(error.errors).map(val => val.message);
            throw new Error(messages.join(', ')); // Return consolidated error message
        }
        throw error;
    }
});

// @desc    Update recruiter profile
// @route   PUT /api/recruiter/profile
// @access  Private/Recruiter
const updateRecruiterProfile = asyncHandler(async (req, res) => {
    const profile = await RecruiterProfile.findOne({ userId: req.user._id });

    if (!profile) {
        res.status(404);
        throw new Error('Recruiter profile not found');
    }

    // Check if isActive
    if (profile.isActive === false) {
        res.status(403);
        throw new Error('Profile is deactivated. Contact support.');
    }

    // Update only allowed fields
    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            profile[field] = req.body[field];
        }
    });

    try {
        console.log('Updating Recruiter Profile:', req.user._id);
        console.log('Update Data:', req.body);

        // Save triggers the pre-save hook which recalculates completion
        const updatedProfile = await profile.save();

        // SYNC: Update User model with new name/email if changed
        if (req.body.fullName || req.body.email) {
            await User.findByIdAndUpdate(req.user._id, {
                name: req.body.fullName || profile.fullName,
                email: req.body.email || profile.email
            });
        }

        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error('Update Profile Error:', error);
        if (error.name === 'ValidationError') {
            res.status(400);
            const messages = Object.values(error.errors).map(val => val.message);
            throw new Error(messages.join(', '));
        }
        throw error;
    }
});

// @desc    Soft delete recruiter profile
// @route   DELETE /api/recruiter/profile
// @access  Private/Recruiter
const deleteRecruiterProfile = asyncHandler(async (req, res) => {
    const profile = await RecruiterProfile.findOne({ userId: req.user._id });

    if (!profile) {
        res.status(404);
        throw new Error('Recruiter profile not found');
    }

    // Soft delete
    profile.isActive = false;
    await profile.save();

    res.status(200).json({ message: 'Recruiter profile deactivated' });
});

module.exports = {
    getRecruiterProfile,
    createRecruiterProfile,
    updateRecruiterProfile,
    deleteRecruiterProfile
};
