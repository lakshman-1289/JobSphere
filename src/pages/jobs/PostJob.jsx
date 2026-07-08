import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import api from '../../utils/api';
import { Briefcase, Building2, MapPin, DollarSign, ListChecks, FileText, ArrowLeft, Send, CheckCircle2, Sparkles } from 'lucide-react';
import postJobImg from '../../assets/images/post-job.png';

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        description: '',
        salary: '',
        location: '',
        skillsRequired: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const skillsArray = formData.skillsRequired.split(',').map(skill => skill.trim());
            const jobData = {
                ...formData,
                skillsRequired: skillsArray
            };

            await api.post('/api/jobs', jobData);
            navigate('/recruiter-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden">
            {/* Background Decor - consistent with Landing Page */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-purple-100/40 to-white"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
                <div className="absolute top-20 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl mix-blend-multiply"></div>
                <div className="absolute bottom-0 left-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl mix-blend-multiply"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-6 text-sm font-semibold group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </button>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Post a New Job</h1>
                            <p className="mt-3 text-lg text-slate-600">Find the perfect talent for your team.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column - Visuals & Tips */}
                    <div className="lg:col-span-4 space-y-8 sticky top-8">
                        {/* Illustration Card */}
                        <div className="bg-white p-2 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100 transform hover:scale-[1.02] transition-transform duration-300">
                            <div className="bg-blue-50/50 rounded-xl overflow-hidden aspect-[4/3] relative group">
                                <img
                                    src={postJobImg}
                                    alt="Post Job Illustration"
                                    className="w-full h-full object-cover mix-blend-normal group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent"></div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-yellow-500" />
                                    Hire top talent faster
                                </h3>
                                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                    Our AI-powered matching engine puts your job in front of the most qualified candidates instantly.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-200" />
                                Pro Tips
                            </h3>
                            <ul className="space-y-4 text-blue-100 text-sm font-medium">
                                <li className="flex gap-3 items-start">
                                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-white shrink-0" />
                                    <span>Be specific with job titles (e.g., "Senior React Developer" vs "Developer").</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-white shrink-0" />
                                    <span>Includes salary ranges attract 3x more qualified candidates.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-white shrink-0" />
                                    <span>List key technologies clearly in the skills section.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="lg:col-span-8">
                        <Card className="shadow-2xl shadow-slate-200/50 border-0 rounded-2xl bg-white overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                            <div className="p-8 md:p-10">
                                {error && (
                                    <div className="mb-8 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center shadow-sm">
                                        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} className="space-y-8">

                                    {/* Section 1 */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                                                <Briefcase className="w-5 h-5 text-blue-600" />
                                                Job Details
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input
                                                    id="title"
                                                    label="Job Title"
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g. Senior React Developer"
                                                    className="bg-slate-50 border-slate-200 focus:bg-white"
                                                    icon={Briefcase}
                                                />
                                                <Input
                                                    id="company"
                                                    label="Company Name"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g. Tech Corp"
                                                    className="bg-slate-50 border-slate-200 focus:bg-white"
                                                    icon={Building2}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 pt-4">
                                                <MapPin className="w-5 h-5 text-purple-600" />
                                                Requirements & Location
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input
                                                    id="location"
                                                    label="Location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g. Remote / New York"
                                                    className="bg-slate-50 border-slate-200 focus:bg-white"
                                                    icon={MapPin}
                                                />
                                                <Input
                                                    id="salary"
                                                    label="Salary Range"
                                                    value={formData.salary}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g. $80k - $120k"
                                                    className="bg-slate-50 border-slate-200 focus:bg-white"
                                                    icon={DollarSign}
                                                />
                                                <div className="md:col-span-2">
                                                    <Input
                                                        id="skillsRequired"
                                                        label="Required Skills"
                                                        value={formData.skillsRequired}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="e.g. React, Node.js, MongoDB"
                                                        className="bg-slate-50 border-slate-200 focus:bg-white"
                                                        icon={ListChecks}
                                                    />
                                                    <p className="mt-2 text-xs font-medium text-slate-500 ml-1 flex items-center gap-1">
                                                        <span className="bg-slate-200 text-slate-600 rounded px-1.5 py-0.5">Tip</span>
                                                        Separate skills with commas for better matching.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 pt-4">
                                                <FileText className="w-5 h-5 text-indigo-600" />
                                                Description
                                            </h3>
                                            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
                                                Job Description
                                            </label>
                                            <div className="relative">
                                                <div className="absolute top-4 left-4 pointer-events-none">
                                                    <FileText className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <textarea
                                                    id="description"
                                                    rows="8"
                                                    className="appearance-none block w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm resize-y bg-slate-50 focus:bg-white leading-relaxed"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Describe the role, responsibilities, and requirements..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex items-center justify-end gap-4 border-t border-slate-100">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => navigate('/recruiter-dashboard')}
                                            className="px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/30 px-8 py-3 rounded-xl flex items-center gap-2 font-bold transform transition-all hover:-translate-y-0.5"
                                        >
                                            {loading ? 'Posting...' : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Post Job Now
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
