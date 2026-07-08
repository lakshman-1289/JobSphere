import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Filter, Bell, CheckCircle, Clock, Calendar, ChevronRight, User, FileText, Award, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import JobCard from '../../components/jobs/JobCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Real Data State
    const [stats, setStats] = useState({
        applied: 0,
        shortlisted: 0,
        interviews: 0,
        profileCompletion: 50 // Default placeholder, logic would be complex to fully implement without profile endpoint
    });

    const [recentApplications, setRecentApplications] = useState([]);
    const [notifications, setNotifications] = useState([]); // Empty or fetch real notifications if endpoint exists

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Jobs
                const jobsRes = await api.get('/api/jobs');
                if (Array.isArray(jobsRes.data)) {
                    setJobs(jobsRes.data);
                }

                // Fetch Applications for Stats
                const appsRes = await api.get('/api/applications/student');
                if (Array.isArray(appsRes.data)) {
                    const apps = appsRes.data;

                    // Calculate Stats
                    const appliedCount = apps.length;
                    const shortlistedCount = apps.filter(app => app.status === 'Shortlisted').length;
                    const interviewsCount = apps.filter(app => app.status === 'Interviewing').length;

                    setStats(prev => ({
                        ...prev,
                        applied: appliedCount,
                        shortlisted: shortlistedCount,
                        interviews: interviewsCount
                    }));

                    // Calculate Profile Completion from LocalStorage (Sync with Profile Page)
                    if (user && user.email) {
                        const storageKey = `studentProfile_${user.email}`;
                        const storedProfile = localStorage.getItem(storageKey);
                        if (storedProfile) {
                            try {
                                const p = JSON.parse(storedProfile);
                                let filled = 0;
                                let total = 7;
                                if (p.name) filled++;
                                if (p.title && p.title !== 'Aspiring Professional') filled++;
                                if (p.bio) filled++;
                                if (p.phone) filled++;
                                if (p.skills && p.skills.length > 0) filled++;
                                if (p.education && p.education.length > 0) filled++;
                                if (p.resume) filled++;

                                const completion = Math.round((filled / total) * 100);
                                setStats(prev => ({ ...prev, profileCompletion: completion }));
                            } catch (e) {
                                console.error("Error parsing profile for stats", e);
                            }
                        } else {
                            // If no profile saved for this user, default to 0 or basic completion
                            setStats(prev => ({ ...prev, profileCompletion: 15 })); // 15% for basic info (implied)
                        }
                    }

                    // Set Recent Applications (Top 5)
                    const sortedApps = apps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 5);

                    // Map to display structure
                    setRecentApplications(sortedApps.map(app => ({
                        id: app._id,
                        title: app.jobId?.title || 'Unknown Role',
                        company: app.jobId?.company || 'Unknown Company',
                        date: app.appliedAt,
                        status: app.status || 'Applied'
                    })));
                }

                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
                setLoading(false);
            }
        };
        fetchData();
    }, [user]); // Re-run when user changes

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 4); // Show top 4 recommended

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 pb-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
                    <p className="text-slate-500 mt-2 text-lg">Here's what's happening with your job search today.</p>
                </div>
                <Link to="/profile">
                    <Button variant="outline" className="hidden md:flex">Edit Profile</Button>
                </Link>
            </div>

            {/* 1. Stats Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Briefcase className="w-20 h-20 text-blue-600 transform rotate-12" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Applied Jobs</p>
                        <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats.applied}</h3>
                    </div>
                    <div className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></span>
                        Active
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CheckCircle className="w-20 h-20 text-emerald-600 transform rotate-12" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Shortlisted</p>
                        <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats.shortlisted}</h3>
                    </div>
                    <div className="flex items-center text-xs font-semibold text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3 mr-1" />
                        Awaiting Response
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Calendar className="w-20 h-20 text-purple-600 transform rotate-12" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Interviews</p>
                        <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats.interviews}</h3>
                    </div>
                    <div className="flex items-center text-xs font-semibold text-purple-600 bg-purple-50 w-fit px-2 py-1 rounded-full">
                        Upcoming
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 text-white flex flex-col justify-between h-32 relative overflow-hidden">
                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                            Profile Status
                            <span className="text-white">{stats.profileCompletion}%</span>
                        </p>
                        <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${stats.profileCompletion}%` }}></div>
                        </div>
                    </div>
                    <Link to="/profile" className="text-xs font-semibold text-blue-300 hover:text-white flex items-center mt-2 transition-colors">
                        Complete Profile <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN (2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 2. Job Search & Filters */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Find your next opportunity</h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Job title, company, or skill"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button className="bg-slate-900 text-white h-auto py-3 px-6 rounded-xl hover:bg-black shadow-lg shadow-slate-900/10">
                                Search
                            </Button>
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {['Remote', 'Full-time', 'Engineering', 'Design', '$50k+'].map(filter => (
                                <button key={filter} className="px-3 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-1">
                                    {filter}
                                </button>
                            ))}
                            <button className="px-3 py-1.5 rounded-full border border-dashed border-slate-300 text-sm font-medium text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-colors flex items-center gap-1">
                                <Filter className="w-3.5 h-3.5" /> More Filters
                            </button>
                        </div>
                    </div>

                    {/* 3. Recommended Jobs */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Recommended Jobs</h2>
                            <Link to="/jobs" className="text-sm font-semibold text-blue-600 hover:text-blue-800">View All</Link>
                        </div>
                        <div className="grid gap-4">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map(job => (
                                    <div key={job.id || job._id} className="relative group">
                                        <JobCard job={job} />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-slate-500">No jobs found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 4. Recent Applications */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
                            <Link to="/my-applications" className="text-sm font-semibold text-slate-500 hover:text-slate-900">View All</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Job Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Applied Date</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentApplications.map(app => (
                                        <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 text-sm">{app.title}</div>
                                                <div className="text-xs text-slate-500">{app.company}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={app.status === 'Shortlisted' ? 'success' : app.status === 'Rejected' ? 'danger' : 'warning'} className="text-xs">
                                                    {app.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(app.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link to={`/my-applications`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                                    Track
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN (1/3) */}
                <div className="space-y-8">

                    {/* 5. Profile Completion Widget */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -mr-6 -mt-6"></div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 relative z-10">Complete Profile</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm relative">
                                {user?.avatar ? (
                                    <img src={user.avatar || 'https://via.placeholder.com/150'} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-slate-400" />
                                )}
                                <button className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm hover:bg-blue-700 transition-colors">
                                    <Upload className="w-3 h-3" />
                                </button>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Upload Resume</p>
                                <p className="text-xs text-slate-500">Stand out to recruiters</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {(() => {
                                const storageKey = user && user.email ? `studentProfile_${user.email}` : null;
                                const storedProfile = storageKey ? localStorage.getItem(storageKey) : null;
                                const p = storedProfile ? JSON.parse(storedProfile) : {};
                                const hasSkills = p.skills && p.skills.length > 0;
                                const hasEducation = p.education && p.education.length > 0;
                                const hasResume = !!p.resume;

                                return (
                                    <>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${hasSkills ? 'bg-green-500' : 'bg-slate-200'}`}>
                                                {hasSkills && <CheckCircle className="w-3 h-3" />}
                                            </div>
                                            <span className={`text-sm font-medium ${hasSkills ? 'text-slate-900 line-through decoration-slate-400' : 'text-slate-600'}`}>Add Skills</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${hasEducation ? 'bg-green-500' : 'bg-slate-200'}`}>
                                                {hasEducation && <CheckCircle className="w-3 h-3" />}
                                            </div>
                                            <span className={`text-sm font-medium ${hasEducation ? 'text-slate-900 line-through decoration-slate-400' : 'text-slate-600'}`}>Add Education</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${hasResume ? 'bg-green-500' : 'bg-slate-200'}`}>
                                                {hasResume && <CheckCircle className="w-3 h-3" />}
                                            </div>
                                            <span className={`text-sm font-medium ${hasResume ? 'text-slate-900 line-through decoration-slate-400' : 'text-slate-600'}`}>Upload Resume</span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        <Link to="/profile">
                            <Button className="w-full mt-6 bg-slate-900 text-white shadow-lg">Complete Now</Button>
                        </Link>
                    </div>

                    {/* 6. Notifications Panel */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
                            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">Mark all read</button>
                        </div>
                        <div className="space-y-4">
                            {notifications.length > 0 ? (
                                notifications.map(notif => (
                                    <div key={notif.id} className="flex gap-3 items-start group">
                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notif.new ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                                        <div>
                                            <p className={`text-sm ${notif.new ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{notif.text}</p>
                                            <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-slate-500">
                                    <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                    <p className="text-sm">No new notifications</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 7. Skill & Career Section */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100">
                        <h3 className="text-lg font-bold text-indigo-900 mb-2">Boost your career</h3>
                        <p className="text-sm text-indigo-700 mb-4 opacity-80">Take skill assessments to earn badges and stand out to recruiters.</p>

                        <div className="space-y-3">
                            <Link to="/skills" className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Award className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">React Skill Test</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </Link>
                            <Link to="/resume-tips" className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink-50 text-pink-600 rounded-lg group-hover:bg-pink-600 group-hover:text-white transition-colors">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">Resume Review</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
