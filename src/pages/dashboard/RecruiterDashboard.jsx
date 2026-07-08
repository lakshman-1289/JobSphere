import React, { useState, useEffect } from 'react';
import { Plus, Users, Briefcase, TrendingUp, Search, Calendar, MapPin, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import api from '../../utils/api';

const RecruiterDashboard = () => {
    const [postedJobs, setPostedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const { data } = await api.get('/api/jobs/myjobs');
                setPostedJobs(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch your jobs');
                setLoading(false);
            }
        };
        fetchMyJobs();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-[60vh] text-red-600 font-medium">
            {error}
        </div>
    );

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Recruiter Dashboard</h1>
                    <p className="text-slate-500 mt-2 text-lg">Overview of your hiring pipeline and job postings.</p>
                </div>
                <Link to="/post-job">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 h-12 px-6 rounded-xl font-bold flex items-center gap-2 transform transition-transform hover:scale-[1.02]">
                        <Plus className="h-5 w-5" />
                        Post New Job
                    </Button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat 1: Total Active Jobs */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Briefcase className="w-24 h-24 text-blue-600 transform rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Jobs</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-slate-900">{postedJobs.length}</span>
                        <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +2 this week
                        </span>
                    </div>
                </div>

                {/* Stat 2: Total Applicants (Demo) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 text-purple-600 transform rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Candidates</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-slate-900">12</span>
                        <span className="text-sm font-medium text-slate-400">across all roles</span>
                    </div>
                </div>

                {/* Stat 3: Views (Demo) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Search className="w-24 h-24 text-emerald-600 transform rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Search className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Job Views</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-slate-900">145</span>
                        <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +12%
                        </span>
                    </div>
                </div>
            </div>

            {/* Jobs List Header */}
            <div className="flex items-center justify-between pt-6">
                <h2 className="text-xl font-bold text-slate-900">Recent Job Postings</h2>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            className="text-sm bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Jobs Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                <th className="px-6 py-4">Job Title</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Applicants</th>
                                <th className="px-6 py-4">Posted Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {postedJobs.length > 0 ? (
                                postedJobs.map((job) => (
                                    <tr key={job._id || job.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-slate-900 text-base">{job.title}</p>
                                                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {job.location}
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">Full-time</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                </span>
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex -space-x-2 overflow-hidden">
                                                {/* Demo Avatars */}
                                                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">JD</div>
                                                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">AS</div>
                                                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs text-gray-500">+4</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-slate-500">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    to={`/jobs/${job._id || job.id}`}
                                                    className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    to={`/job/${job._id || job.id}/applications`}
                                                    className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-colors flex items-center gap-2"
                                                >
                                                    <Users className="w-3.5 h-3.5" /> Applicants
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="bg-slate-50 p-6 rounded-full mb-4">
                                                <Briefcase className="h-10 w-10 text-slate-300" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900">No jobs posted yet</h3>
                                            <p className="text-slate-500 mt-2 mb-6 max-w-sm">Create your first job posting to start finding the perfect candidates for your team.</p>
                                            <Link to="/post-job">
                                                <Button className="bg-slate-900 text-white shadow-lg">
                                                    Create First Job
                                                </Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
