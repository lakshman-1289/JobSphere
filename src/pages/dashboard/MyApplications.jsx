import React, { useState, useEffect } from 'react';
import { Building, MapPin, Calendar, CheckCircle, XCircle, Clock, Search, Briefcase, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import api from '../../utils/api';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await api.get('/api/applications/student');
                setApplications(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch applications');
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Shortlisted':
                return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle };
            case 'Rejected':
                return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: XCircle };
            case 'Interviewing':
                return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: Briefcase };
            default:
                return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Clock };
        }
    };

    const filteredApplications = applications.filter(app =>
        app.jobId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobId?.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Stats Calculation
    const stats = {
        total: applications.length,
        shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
        pending: applications.filter(a => a.status === 'Applied' || !a.status).length
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-[60vh] text-red-600 font-bold">
            {error}
        </div>
    );

    return (
        <div className="space-y-8 pb-12">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Applications</h1>
                <p className="text-slate-500 mt-2 text-lg">Track and manage your job application status.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Applied</p>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.total}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Shortlisted</p>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.shortlisted}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <Clock className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending</p>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.pending}</p>
                </div>
            </div>

            {/* Filter & Search */}
            <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by job title or company..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-slate-900"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="hidden sm:flex items-center gap-2 border-slate-200 text-slate-600">
                    <Filter className="w-4 h-4" /> Filter
                </Button>
            </div>

            {/* Application List */}
            <div className="space-y-4">
                {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => {
                        const statusStyle = getStatusStyles(app.status || 'Applied');
                        const StatusIcon = statusStyle.icon;

                        return (
                            <div key={app._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm text-2xl font-bold text-slate-400 flex-shrink-0">
                                            {app.jobId?.company?.charAt(0) || <Building className="w-8 h-8" />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                {app.jobId?.title || 'Job Title Unavailable'}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
                                                <span className="flex items-center gap-1.5">
                                                    <Building className="w-4 h-4" />
                                                    {app.jobId?.company || 'Company'}
                                                </span>
                                                <span className="hidden sm:inline text-slate-300">•</span>
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4" />
                                                    {app.jobId?.location || 'Location'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                                        <div className="flex flex-col items-end gap-1">
                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {app.status || 'Applied'}
                                            </div>
                                            <span className="text-xs text-slate-400 font-medium">
                                                Applied {new Date(app.appliedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <Link to={`/jobs/${app.jobId?._id || app.jobId}`}>
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No applications found</h3>
                        <p className="text-slate-500 mb-6">
                            {searchQuery ? "No applications match your search." : "You haven't applied to any jobs yet. Start exploring!"}
                        </p>
                        {!searchQuery && (
                            <Link to="/jobs">
                                <Button className="bg-slate-900 text-white">Browse Jobs</Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
