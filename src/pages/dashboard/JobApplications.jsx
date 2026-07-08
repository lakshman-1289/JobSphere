import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Users, Briefcase, Mail, Phone, MapPin, Download,
    CheckCircle, XCircle, Clock, ChevronLeft, ExternalLink, Calendar
} from 'lucide-react';
import api from '../../utils/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const JobApplications = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState(null); // For modal/split view

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await api.get(`/api/applications/job/${jobId}`);
                setApplications(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch applications", err);
                setLoading(false);
            }
        };
        fetchApplications();
    }, [jobId]);

    const handleUpdateStatus = async (appId, newStatus) => {
        try {
            await api.patch(`/api/applications/status/${appId}`, { status: newStatus });
            // Update local state
            setApplications(prev => prev.map(app =>
                app._id === appId ? { ...app, status: newStatus } : app
            ));
            if (selectedApplicant && selectedApplicant._id === appId) {
                setSelectedApplicant(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const StatusBadge = ({ status }) => {
        let style = "bg-slate-100 text-slate-600 border-slate-200";
        if (status === 'Shortlisted') style = "bg-green-100 text-green-700 border-green-200";
        if (status === 'Rejected') style = "bg-red-100 text-red-700 border-red-200";
        if (status === 'Interviewing') style = "bg-purple-100 text-purple-700 border-purple-200";

        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${style}`}>
                {status}
            </span>
        );
    };

    if (loading) return <div className="p-10 flex justify-center"><div className="animate-spin h-10 w-10 border-2 border-blue-500 rounded-full border-t-transparent"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/recruiter-dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Job Applicants</h1>
                    <p className="text-slate-500">Manage candidates for this position</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List of Applicants */}
                <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                    {applications.length === 0 && (
                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                            <p className="text-slate-500 font-medium">No applicants yet.</p>
                        </div>
                    )}
                    {applications.map(app => (
                        <div
                            key={app._id}
                            onClick={() => setSelectedApplicant(app)}
                            className={`
                                p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md
                                ${selectedApplicant?._id === app._id
                                    ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200'
                                    : 'bg-white border-slate-100 hover:border-slate-200'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                        {app.studentId?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{app.studentId?.name}</h3>
                                        <p className="text-xs text-slate-500">{new Date(app.appliedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <StatusBadge status={app.status} />
                            </div>
                            {app.studentProfile?.title && (
                                <p className="text-sm text-slate-600 mb-2 line-clamp-1">{app.studentProfile.title}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Detailed View */}
                <div className="lg:col-span-2">
                    {selectedApplicant ? (
                        <Card className="p-8 border-slate-100 shadow-lg rounded-3xl sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl font-bold text-blue-600">
                                        {selectedApplicant.studentId?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">{selectedApplicant.studentId?.name}</h2>
                                        <p className="text-lg text-slate-500 font-medium">{selectedApplicant.studentProfile?.title || 'Applicant'}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {selectedApplicant.studentId?.email}</span>
                                            {selectedApplicant.studentProfile?.phone && (
                                                <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {selectedApplicant.studentProfile.phone}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <StatusBadge status={selectedApplicant.status} />
                                    <div className="flex items-center text-xs text-slate-400">
                                        Applied {new Date(selectedApplicant.appliedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mb-8">
                                <Button
                                    onClick={() => handleUpdateStatus(selectedApplicant._id, 'Shortlisted')}
                                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                    disabled={selectedApplicant.status === 'Shortlisted'}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" /> Shortlist
                                </Button>
                                <Button
                                    onClick={() => handleUpdateStatus(selectedApplicant._id, 'Interviewing')}
                                    className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                                    disabled={selectedApplicant.status === 'Interviewing'}
                                >
                                    <Clock className="w-4 h-4 mr-2" /> Interview
                                </Button>
                                <Button
                                    onClick={() => handleUpdateStatus(selectedApplicant._id, 'Rejected')}
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50 flex-1"
                                    disabled={selectedApplicant.status === 'Rejected'}
                                >
                                    <XCircle className="w-4 h-4 mr-2" /> Reject
                                </Button>
                            </div>

                            {/* Content Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    {/* About */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-blue-500" /> About
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            {selectedApplicant.studentProfile?.bio || "No bio provided."}
                                        </p>
                                    </div>

                                    {/* Experience/Projects */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-indigo-500" /> Projects
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedApplicant.studentProfile?.projects?.length > 0 ? (
                                                selectedApplicant.studentProfile.projects.map((p, i) => (
                                                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                        <div className="flex justify-between">
                                                            <p className="font-bold text-slate-900">{p.title}</p>
                                                            {p.link && <a href={p.link} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 text-blue-500" /></a>}
                                                        </div>
                                                        <p className="text-sm text-slate-600 mt-1">{p.desc}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-slate-400 italic text-sm">No projects listed.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Education */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-purple-500" /> Education
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedApplicant.studentProfile?.education?.length > 0 ? (
                                                selectedApplicant.studentProfile.education.map((e, i) => (
                                                    <div key={i} className="pl-3 border-l-2 border-purple-200">
                                                        <p className="font-bold text-slate-900 text-sm">{e.degree}</p>
                                                        <p className="text-xs text-slate-500">{e.school} • {e.year}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-slate-400 italic text-sm">No education listed.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-emerald-500" /> Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedApplicant.studentProfile?.skills?.map((s, i) => (
                                                <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                                                    {s.name}
                                                </span>
                                            ))}
                                            {(!selectedApplicant.studentProfile?.skills || selectedApplicant.studentProfile.skills.length === 0) && (
                                                <p className="text-slate-400 italic text-sm">No skills listed.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Resume Download */}
                                    {(selectedApplicant.studentProfile?.resumeData || selectedApplicant.studentProfile?.resume) && (
                                        <div className="pt-4 border-t border-slate-100">
                                            <button
                                                onClick={() => {
                                                    if (selectedApplicant.studentProfile.resumeData) {
                                                        const link = document.createElement('a');
                                                        link.href = selectedApplicant.studentProfile.resumeData;
                                                        link.download = selectedApplicant.studentProfile.resume;
                                                        link.click();
                                                    } else {
                                                        alert('Resume is a placeholder.');
                                                    }
                                                }}
                                                className="w-full py-3 bg-blue-50 text-blue-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                                            >
                                                <Download className="w-4 h-4" /> Download Resume
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <div className="h-full bg-slate-50 rounded-3xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 flex-col gap-4 min-h-[400px]">
                            <Users className="w-16 h-16 opacity-50" />
                            <p className="font-medium">Select an applicant to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobApplications;
