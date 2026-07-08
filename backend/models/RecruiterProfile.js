const mongoose = require('mongoose');

const recruiterProfileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Basic Information
    fullName: { type: String, required: [true, 'Full Name is required'] },
    email: { type: String, required: [true, 'Official Email is required'] },
    phone: { type: String, required: [true, 'Phone Number is required'] },
    designation: { type: String, required: [true, 'Designation is required'] },

    // Company Information
    companyName: { type: String, required: [true, 'Company Name is required'] },
    companyWebsite: { type: String, required: [true, 'Company Website is required'] },
    industry: { type: String, required: [true, 'Industry is required'] },
    companySize: {
        type: String,
        enum: {
            values: ['1-10', '11-50', '51-200', '200+'],
            message: '{VALUE} is not a valid company size'
        },
        required: [true, 'Company Size is required']
    },
    companyLocation: { type: String, required: [true, 'Location is required'] },
    companyDescription: { type: String, required: [true, 'Company Description is required'] },

    // Verification Details
    companyEmailDomain: { type: String, required: [true, 'Company Email Domain is required'] },
    linkedInUrl: { type: String, required: [true, 'LinkedIn URL is required'] },
    registrationId: { type: String }, // Optional

    isVerified: { type: Boolean, default: false },
    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

    // Profile Metadata
    profileCompletion: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

}, {
    timestamps: true
});

// Middleware to calculate profile completion before saving
recruiterProfileSchema.pre('save', function (next) {
    const mandatoryFields = [
        'fullName', 'email', 'phone', 'designation',
        'companyName', 'companyWebsite', 'industry', 'companySize',
        'companyLocation', 'companyDescription',
        'companyEmailDomain', 'linkedInUrl'
    ];

    let filledCount = 0;
    mandatoryFields.forEach(field => {
        // Access path properly, though this[field] usually works on docs
        const val = this[field];
        if (val && typeof val === 'string' && val.trim().length > 0) {
            filledCount++;
        }
    });

    this.profileCompletion = Math.round((filledCount / mandatoryFields.length) * 100);
    next();
});

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
