import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, Briefcase, Building2, Globe, MapPin,
    Link as LinkIcon, AlertCircle, Save, Trash2, CheckCircle2,
    XCircle, Clock, ShieldCheck, Edit2, Upload, ChevronRight, LayoutDashboard
} from 'lucide-react';
import api from '../../utils/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

const RecruiterProfile = () => {
    const { user: authUser, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState('view'); // 'view' | 'edit' | 'create'
    const [error, setError] = useState(null);

    // Form Data State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        designation: '',
        companyName: '',
        companyWebsite: '',
        industry: '',
        companySize: '1-10',
        companyLocation: '',
        companyDescription: '',
        companyEmailDomain: '',
        linkedInUrl: '',
        registrationId: '',
    });

    // Metadata (Read-only)
    const [metadata, setMetadata] = useState({
        profileCompletion: 0,
        isVerified: false,
        verificationStatus: 'pending',
        isActive: true,
        createdAt: null,
        updatedAt: null
    });

    // Fetch Profile
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/recruiter/profile');
            setFormData({
                fullName: data.fullName || '',
                email: data.email || '',
                phone: data.phone || '',
                designation: data.designation || '',
                companyName: data.companyName || '',
                companyWebsite: data.companyWebsite || '',
                industry: data.industry || '',
                companySize: data.companySize || '1-10',
                companyLocation: data.companyLocation || '',
                companyDescription: data.companyDescription || '',
                companyEmailDomain: data.companyEmailDomain || '',
                linkedInUrl: data.linkedInUrl || '',
                registrationId: data.registrationId || '',
            });
            setMetadata({
                profileCompletion: data.profileCompletion,
                isVerified: data.isVerified,
                verificationStatus: data.verificationStatus,
                isActive: data.isActive,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            });
            setMode('view');
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setMode('create');
            } else {
                setError('Failed to load profile. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            if (mode === 'create') {
                await api.post('/api/recruiter/profile', formData);
            } else {
                await api.put('/api/recruiter/profile', formData);
            }

            // Sync Front-end User State (Navbar etc)
            if (updateUser) {
                updateUser({
                    name: formData.fullName,
                    email: formData.email
                });
            }

            await fetchProfile(); // Refresh data to get updated completion/metadata
            setMode('view');
        } catch (err) {
            console.error("Profile Save Error:", err);
            const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to save profile';
            setError(errMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete your recruiter profile? This action cannot be undone.')) return;

        try {
            await api.delete('/api/recruiter/profile');
            alert('Profile deleted successfully.');
            window.location.reload(); // Refresh to reflect changes/logout
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete profile');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
                <p className="text-gray-500 font-medium">Loading profile...</p>
            </div>
        </div>
    );

    const isEditing = mode === 'edit' || mode === 'create';

    const getVerificationBadge = () => {
        switch (metadata.verificationStatus) {
            case 'approved': return <Badge variant="success" icon={CheckCircle2}>Verified Recruiter</Badge>;
            case 'rejected': return <Badge variant="danger" icon={XCircle}>Verification Rejected</Badge>;
            default: return <Badge variant="warning" icon={Clock}>Verification Pending</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">

            {/* Header / Hero Section */}
            <div className="relative h-64 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-900 to-slate-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                        <button onClick={() => setError(null)} className="text-red-400 hover:text-red-500">
                            <XCircle className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-8 backdrop-blur-sm bg-white/95">
                    <div className="flex flex-col md:flex-row gap-6 md:items-end">
                        <div className="flex-shrink-0 relative">
                            <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-600 shadow-lg flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white">
                                {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : <User size={48} />}
                            </div>
                            {metadata.isVerified && (
                                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full ring-4 ring-white shadow-sm" title="Verified Account">
                                    <CheckCircle2 size={20} fill="currentColor" className="text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 pb-2">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                        {formData.fullName || 'New Recruiter'}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-2 text-gray-600">
                                        <Briefcase className="h-4 w-4" />
                                        <span className="font-medium">{formData.designation || 'Designation'}</span>
                                        <span className="hidden md:inline text-gray-300">•</span>
                                        <span className="md:hidden block"></span>
                                        <Building2 className="h-4 w-4" />
                                        <span className="font-medium">{formData.companyName || 'Company Name'}</span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-4">
                                        {getVerificationBadge()}
                                        <div className="h-4 w-px bg-gray-300 hidden md:block"></div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span className="font-medium">Profile Completion:</span>
                                            <span className={`font-bold ${metadata.profileCompletion === 100 ? 'text-green-600' : 'text-brand-600'}`}>
                                                {metadata.profileCompletion}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {!isEditing ? (
                                        <Button
                                            onClick={() => setMode('edit')}
                                            icon={Edit2}
                                            className="shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl transition-all hover:scale-105"
                                        >
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            {mode !== 'create' && (
                                                <Button
                                                    onClick={() => {
                                                        setMode('view');
                                                        fetchProfile();
                                                    }}
                                                    variant="secondary"
                                                    className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={saving}
                                                icon={Save}
                                                className="shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl"
                                            >
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* View Mode Content */}
                {!isEditing && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: Contact & Metadata */}
                        <div className="space-y-6 md:col-span-1">
                            <Card className="p-6 border-t-4 border-t-brand-500 shadow-md">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <User className="h-5 w-5 text-brand-600" />
                                    Contact Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                                            <p className="text-sm font-medium text-gray-900 break-all">{formData.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</p>
                                            <p className="text-sm font-medium text-gray-900">{formData.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <LinkIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">LinkedIn</p>
                                            <a
                                                href={formData.linkedInUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline break-all"
                                            >
                                                View Profile
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 border-t-4 border-t-purple-500 shadow-md">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-purple-600" />
                                    Verification Info
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-500">Status</span>
                                        <span className={`text-sm font-bold capitalize px-2 py-1 rounded-md ${metadata.verificationStatus === 'approved' ? 'bg-green-100 text-green-700' :
                                            metadata.verificationStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {metadata.verificationStatus}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-500">Domain</span>
                                        <span className="text-sm font-medium text-gray-900">{formData.companyEmailDomain}</span>
                                    </div>
                                    {formData.registrationId && (
                                        <div className="pt-2">
                                            <span className="text-xs text-gray-500 block mb-1">Company Reg. ID</span>
                                            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">{formData.registrationId}</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Right Column: Company Info */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="p-8 shadow-md border border-gray-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Building2 className="h-6 w-6 text-brand-600" />
                                        Company Overview
                                    </h3>
                                    {formData.companyWebsite && (
                                        <a
                                            href={formData.companyWebsite}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
                                        >
                                            <Globe className="h-4 w-4" />
                                            Visit Website
                                        </a>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Industry</p>
                                        <div className="flex items-center gap-2">
                                            <LayoutDashboard className="h-5 w-5 text-gray-600" />
                                            <p className="text-lg font-semibold text-gray-900">{formData.industry}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Company Size</p>
                                        <div className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-gray-600" />
                                            <p className="text-lg font-semibold text-gray-900">{formData.companySize} Employees</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl sm:col-span-2">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-gray-600" />
                                            <p className="text-lg font-semibold text-gray-900">{formData.companyLocation}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">About Company</h4>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                        {formData.companyDescription}
                                    </p>
                                </div>
                            </Card>

                            {/* Danger Zone (View Mode Only to reduce clutter in Edit) */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                                    <div>
                                        <h4 className="text-sm font-bold text-red-800">Delete Account</h4>
                                        <p className="text-xs text-red-600 mt-1">Permanently remove your profile and access.</p>
                                    </div>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={handleDelete}
                                        icon={Trash2}
                                        className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Mode Form */}
                {isEditing && (
                    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* 1. Basic Information */}
                        <Card className="p-8 border-t-4 border-t-brand-500 shadow-lg">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                                    <User className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
                                    <p className="text-sm text-gray-500">Your personal details and role</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    id="fullName"
                                    label="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. John Doe"
                                />
                                <Input
                                    id="designation"
                                    label="Role / Designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    placeholder="e.g. HR Manager"
                                    required
                                />
                                <Input
                                    id="email"
                                    label="Official Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={Mail}
                                    required
                                />
                                <Input
                                    id="phone"
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    icon={Phone}
                                    required
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </Card>

                        {/* 2. Company Information */}
                        <Card className="p-8 border-t-4 border-t-blue-500 shadow-lg">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Company Information</h3>
                                    <p className="text-sm text-gray-500">Tell us about your organization</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    id="companyName"
                                    label="Company Name"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    id="companyWebsite"
                                    label="Company Website"
                                    value={formData.companyWebsite}
                                    onChange={handleChange}
                                    icon={Globe}
                                    required
                                    placeholder="https://example.com"
                                />
                                <Input
                                    id="industry"
                                    label="Industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    placeholder="e.g. Technology, Healthcare"
                                    required
                                />
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 animate-in fade-in">
                                        Company Size
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="companySize"
                                            value={formData.companySize}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 text-sm bg-white"
                                        >
                                            <option value="1-10">1-10 Employees</option>
                                            <option value="11-50">11-50 Employees</option>
                                            <option value="51-200">51-200 Employees</option>
                                            <option value="200+">200+ Employees</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <Input
                                    id="companyLocation"
                                    label="Location (City, Country)"
                                    value={formData.companyLocation}
                                    onChange={handleChange}
                                    icon={MapPin}
                                    required
                                />
                                <div className="md:col-span-2">
                                    <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Company Description
                                    </label>
                                    <textarea
                                        id="companyDescription"
                                        rows={4}
                                        value={formData.companyDescription}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 text-sm resize-y"
                                        required
                                        placeholder="Describe your company culture, mission, and what you do..."
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* 3. Verification Details */}
                        <Card className="p-8 border-t-4 border-t-purple-500 shadow-lg">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Verification Details</h3>
                                    <p className="text-sm text-gray-500">Help us verify your identity</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    id="companyEmailDomain"
                                    label="Company Email Domain"
                                    value={formData.companyEmailDomain}
                                    onChange={handleChange}
                                    placeholder="e.g. google.com"
                                    required
                                    className="font-mono bg-gray-50 text-gray-600"
                                />
                                <Input
                                    id="linkedInUrl"
                                    label="LinkedIn Profile URL"
                                    value={formData.linkedInUrl}
                                    onChange={handleChange}
                                    icon={LinkIcon}
                                    required
                                    placeholder="https://linkedin.com/in/..."
                                />
                                <Input
                                    id="registrationId"
                                    label="Company Registration ID (Optional)"
                                    value={formData.registrationId}
                                    onChange={handleChange}
                                    placeholder="Tax ID / EIN / CIN"
                                />
                            </div>
                        </Card>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setMode('view');
                                    fetchProfile();
                                }}
                                className="px-8 py-3 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                icon={Save}
                                disabled={saving}
                                className="px-8 py-3 rounded-xl shadow-lg shadow-indigo-500/25 bg-indigo-600 hover:bg-indigo-700"
                            >
                                {saving ? 'Saving...' : 'Save & Update Profile'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RecruiterProfile;
