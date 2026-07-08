import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Briefcase, CheckCircle, Clock, ArrowRight, Building, Globe, ShieldCheck, Share2, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                // Fallback: fetch all jobs and find the one matching ID (since GET /jobs/:id might not be implemented)
                const { data } = await api.get('/api/jobs');
                const found = data.find(j => (j._id || j.id) === id);
                if (found) {
                    setJob(found);
                } else {
                    setError('Job not found');
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load job details');
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setApplying(true);
        try {
            await api.post(`/api/applications/apply/${id}`);
            setApplied(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error || !job) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Job Not Found</h2>
            <p className="text-slate-500 mb-6">{error || "We couldn't find the job you're looking for."}</p>
            <Button onClick={() => navigate('/jobs')} variant="outline" className="border-slate-300">
                Browse Jobs
            </Button>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
            {/* Header Background */}
            <div className="h-64 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900"></div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                <div className="md:flex items-start justify-between gap-6 mb-8">
                    {/* Company Logo & Title Block */}
                    <div className="flex flex-col md:flex-row gap-6 md:items-end">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl font-bold text-slate-800 border-4 border-white/50 backdrop-blur-sm">
                            {job.company?.charAt(0) || <Building className="w-12 h-12 text-slate-400" />}
                        </div>
                        <div className="pb-2 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
                                {job.title}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-slate-300 text-sm font-medium">
                                <span className="flex items-center">
                                    <Briefcase className="w-4 h-4 mr-1.5 text-blue-400" />
                                    {job.company}
                                </span>
                                <span className="hidden md:inline text-slate-600">•</span>
                                <span className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1.5 text-red-400" />
                                    {job.location}
                                </span>
                                <span className="hidden md:inline text-slate-600">•</span>
                                <span className="flex items-center bg-white/10 px-2 py-0.5 rounded-full text-white">
                                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 md:mt-0 justify-center pb-2">
                        <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl backdrop-blur-md transition-all border border-white/10" title="Share Job">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl backdrop-blur-md transition-all border border-white/10 text-sm font-bold flex items-center gap-2">
                            <Globe className="w-4 h-4" /> Visit Website
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column (Content) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. Description Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                                    <Briefcase className="w-5 h-5" />
                                </span>
                                About the Role
                            </h3>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                                {job.description || "No detailed description provided."}
                            </div>
                        </div>

                        {/* 2. Skills Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                                    <ShieldCheck className="w-5 h-5" />
                                </span>
                                Skills & Requirements
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {job.skillsRequired && job.skillsRequired.length > 0 ? (
                                    job.skillsRequired.map((skill, index) => (
                                        <div key={index} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all shadow-sm">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            {skill}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 italic">No specific skills listed.</p>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Job Overview & Action Card */}
                        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="font-bold text-slate-900 text-lg">Job Overview</h4>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100/50 shadow-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-wide">Active</span>
                                </div>
                            </div>

                            <div className="space-y-5 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-600 border border-slate-100">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Salary</p>
                                        <p className="font-bold text-slate-900 text-base">{job.salary}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-600 border border-slate-100">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                                        <p className="font-bold text-slate-900 text-base">{job.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-600 border border-slate-100">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Job Type</p>
                                        <p className="font-bold text-slate-900 text-base">Full-time</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                {user?.role === 'recruiter' ? (
                                    <div className="w-full bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 group hover:bg-slate-100 transition-colors cursor-default">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-slate-900 font-bold text-sm">You posted this job</p>
                                            <p className="text-slate-500 text-xs mt-0.5">Manage it from your dashboard</p>
                                        </div>
                                    </div>
                                ) : applied ? (
                                    <Button disabled className="w-full h-14 bg-green-600/90 text-white shadow-lg shadow-green-600/20 border-transparent text-lg font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                                        <CheckCircle className="w-5 h-5" />
                                        Application Sent
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleApply}
                                        disabled={applying}
                                        className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 text-lg font-bold rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                                    >
                                        {applying ? 'Submitting...' : 'Apply Now'}
                                        {!applying && <ArrowRight className="w-5 h-5" />}
                                    </Button>
                                )}

                                <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium bg-slate-50 py-2.5 rounded-lg border border-slate-100">
                                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                                    Verified & Safe Job Poster
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
