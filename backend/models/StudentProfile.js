const mongoose = require('mongoose');

const studentProfileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: 'Aspiring Professional'
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    skills: [{
        name: String,
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Expert'],
            default: 'Intermediate'
        }
    }],
    education: [{
        degree: String,
        school: String,
        year: String,
        grade: String
    }],
    projects: [{
        title: String,
        desc: String,
        link: String
    }],
    certifications: [{
        title: String,
        issuer: String,
        year: String
    }],
    socialLinks: {
        linkedin: String,
        github: String,
        portfolio: String
    },
    resume: {
        type: String, // Filename
        default: ''
    },
    resumeData: {
        type: String, // Base64 string (for now, eventually S3/Cloudinary)
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
