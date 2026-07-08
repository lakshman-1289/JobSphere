const Application = require('../models/Application');
const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Student)
const applyJob = async (req, res) => {
    const jobId = req.params.jobId;
    const studentId = req.user.id;

    // Check if duplicate
    const existing = await Application.findOne({ jobId, studentId });
    if (existing) {
        return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create({
        jobId,
        studentId
    });

    res.status(201).json(application);
}

// @desc    Get student's applications
// @route   GET /api/applications/student
// @access  Private (Student)
const getStudentApplications = async (req, res) => {
    const applications = await Application.find({ studentId: req.user.id })
        .populate('jobId', 'title company location status'); // Populate job details
    res.status(200).json(applications);
}

// @desc    Get applicants for a job (Recruiter)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
const getJobApplicants = async (req, res) => {

    // Check if the job belongs to recruiter
    const job = await Job.findById(req.params.jobId);
    if (job.recruiterId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
        .populate('studentId', 'name email'); // Basic user info

    // Fetch rich profiles for these applicants
    const studentIds = applications.map(app => app.studentId._id);
    const profiles = await StudentProfile.find({ user: { $in: studentIds } });

    // Combine data
    const result = applications.map(app => {
        const profile = profiles.find(p => p.user.toString() === app.studentId._id.toString());
        return {
            ...app.toObject(),
            studentProfile: profile || {}
        };
    });

    res.status(200).json(result);
}

// @desc    Update application status
// @route   PATCH /api/applications/status/:id
// @access  Private (Recruiter)
const updateStatus = async (req, res) => {
    const { status } = req.body;

    // Find application and populate job to check ownership
    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
        return res.status(404).json({ message: 'Application not found' });
    }

    // Verify recruiter ownership
    if (application.jobId.recruiterId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
}

module.exports = {
    applyJob,
    getStudentApplications,
    getJobApplicants,
    updateStatus
};
