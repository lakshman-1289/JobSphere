import React from 'react';
import { MapPin, DollarSign, Clock, Building, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
    const navigate = useNavigate();

    if (!job) return null;

    // Backend uses skillsRequired, frontend might expect skills. Normalize it.
    const skills = job.skills || job.skillsRequired || [];
    const postedAt = job.postedAt || new Date(job.createdAt).toLocaleDateString();

    return (
        <Card className="group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-100 bg-white rounded-2xl overflow-hidden h-full flex flex-col">

            <div className="p-6 flex-1">
                <div className="flex items-start gap-4 mb-4">
                    {/* Logo/Avatar */}
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 font-bold text-xl border border-blue-100 shadow-sm shrink-0">
                        {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                            {job.title}
                        </h3>
                        <p className="text-slate-500 font-medium text-sm mt-1 flex items-center">
                            <Building className="w-3.5 h-3.5 mr-1" />
                            {job.company}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">
                        <MapPin className="w-3 h-3 mr-1.5 text-slate-400" />
                        {job.location}
                    </div>
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">
                        <DollarSign className="w-3 h-3 mr-1 text-slate-400" />
                        {job.salary}
                    </div>
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">
                        <Clock className="w-3 h-3 mr-1.5 text-slate-400" />
                        {postedAt}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                    {skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100">
                            {skill}
                        </span>
                    ))}
                    {skills.length > 3 && (
                        <span className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-medium border border-slate-100">
                            +{skills.length - 3}
                        </span>
                    )}
                </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 mt-auto">
                <Button
                    variant="primary"
                    className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300"
                    onClick={() => navigate(`/jobs/${job._id || job.id}`)}
                >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </Button>
            </div>
        </Card>
    );
};

export default JobCard;
