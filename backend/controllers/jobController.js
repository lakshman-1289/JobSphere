const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
    const jobs = await Job.find();
    res.status(200).json(jobs);
};

// @desc    Get recruiter's jobs
// @route   GET /api/jobs/myjobs
// @access  Private (Recruiter)
const getMyJobs = async (req, res) => {
    const jobs = await Job.find({ recruiterId: req.user.id });
    res.status(200).json(jobs);
}

// @desc    Set job
// @route   POST /api/jobs
// @access  Private (Recruiter)
const createJob = async (req, res) => {
    if (!req.body.title || !req.body.company || !req.body.description) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    const job = await Job.create({
        title: req.body.title,
        company: req.body.company,
        description: req.body.description,
        salary: req.body.salary,
        location: req.body.location,
        skillsRequired: req.body.skillsRequired,
        recruiterId: req.user.id,
    });

    res.status(200).json(job);
};

module.exports = {
    getJobs,
    getMyJobs,
    createJob,
};
