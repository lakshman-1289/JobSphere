import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
    MapPin, Mail, School, Edit2, FileText, Upload, Briefcase,
    Plus, Download, ExternalLink, Linkedin, Github,
    X, User as UserIcon, Award, Trash2, CheckCircle, Smartphone, Globe
} from 'lucide-react';

const Profile = () => {
    const { user: authUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (authUser && authUser.role === 'recruiter') {
            navigate('/recruiter/profile');
        }
    }, [authUser, navigate]);

    // -- State --
    // Initial state matching user structure + new profile fields
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        role: 'student',
        title: 'Aspiring Professional',
        bio: '',
        location: '',
        phone: '',
        socialLinks: { linkedin: '', github: '', portfolio: '' },
        skills: [], // { name: '', level: 'Intermediate' }
        education: [], // { id: 1, degree: '', school: '', year: '', grade: '' }
        projects: [], // { id: 1, title: '', desc: '', link: '' }
        certifications: [], // { id: 1, title: '', issuer: '', year: '' }
        resume: 'my_resume.pdf'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [tempProfile, setTempProfile] = useState(profile);
    const [saving, setSaving] = useState(false);
    const [completion, setCompletion] = useState(0);

    // -- Effects --
    useEffect(() => {
        const fetchProfile = async () => {
            if (authUser) {
                try {
                    // Try fetch from Backend API
                    const { data } = await api.get('/api/profile');
                    if (data) {
                        setProfile({ ...data, name: authUser.name, email: authUser.email }); // Ensure user details match auth
                        setTempProfile({ ...data, name: authUser.name, email: authUser.email });
                        // Update local cache
                        const storageKey = `studentProfile_${authUser.email}`;
                        localStorage.setItem(storageKey, JSON.stringify(data));
                        return;
                    }
                } catch (err) {
                    console.log("Profile not found on server or API error, falling back to local/default");
                }

                // Fallback to LocalStorage (Cache) or Defaults
                const storageKey = `studentProfile_${authUser.email}`;
                const storedProfile = localStorage.getItem(storageKey);

                let initialProfile = {
                    ...profile,
                    name: authUser.name || '',
                    email: authUser.email || '',
                    role: authUser.role || 'student',
                };

                if (storedProfile) {
                    try {
                        const parsed = JSON.parse(storedProfile);
                        initialProfile = { ...initialProfile, ...parsed, email: authUser.email };
                    } catch (e) { console.error(e); }
                }

                setProfile(initialProfile);
                setTempProfile(initialProfile);
            }
        };

        fetchProfile();
    }, [authUser]);

    useEffect(() => {
        calculateCompletion(profile);
    }, [profile]);

    // -- Handlers --

    const calculateCompletion = (data) => {
        let filled = 0;
        let total = 7; // Name, Title, Bio, Phone, Skills, Education, Resume

        if (data.name) filled++;
        if (data.title && data.title !== 'Aspiring Professional') filled++;
        if (data.bio) filled++;
        if (data.phone) filled++;
        if (data.skills.length > 0) filled++;
        if (data.education.length > 0) filled++;
        if (data.resume) filled++;

        setCompletion(Math.round((filled / total) * 100));
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setTempProfile(profile); // Reset changes on cancel
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e, section = null) => {
        const { name, value } = e.target;
        if (section) {
            setTempProfile(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: value }
            }));
        } else {
            setTempProfile(prev => ({ ...prev, [name]: value }));
        }
    };

    // Generic List Handlers (Education, Projects, Certs)
    const addItem = (field, emptyItem) => {
        setTempProfile(prev => ({
            ...prev,
            [field]: [...prev[field], { ...emptyItem, id: Date.now() }]
        }));
    };

    const updateItem = (field, id, key, value) => {
        setTempProfile(prev => ({
            ...prev,
            [field]: prev[field].map(item => item.id === id ? { ...item, [key]: value } : item)
        }));
    };

    const removeItem = (field, id) => {
        setTempProfile(prev => ({
            ...prev,
            [field]: prev[field].filter(item => item.id !== id)
        }));
    };

    // Skills specific handler
    const addSkill = () => {
        setTempProfile(prev => ({
            ...prev,
            skills: [...prev.skills, { id: Date.now(), name: '', level: 'Intermediate' }]
        }));
    };

    const updateSkill = (id, key, value) => {
        setTempProfile(prev => ({
            ...prev,
            skills: prev.skills.map(skill => skill.id === id ? { ...skill, [key]: value } : skill)
        }));
    };

    const removeSkill = (id) => {
        setTempProfile(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill.id !== id)
        }));
    };


    const handleSave = async () => {
        setSaving(true);
        try {
            // Save to Backend
            await api.put('/api/profile', tempProfile);

            // Save to LocalStorage (Cache)
            if (authUser?.email) {
                const storageKey = `studentProfile_${authUser.email}`;
                localStorage.setItem(storageKey, JSON.stringify(tempProfile));
            }

            setProfile(tempProfile);
            setSaving(false);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save profile", error);
            alert("Failed to save profile. Please try again. " + (error.response?.data?.message || error.message));
            setSaving(false);
        }
    };

    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempProfile(prev => ({
                    ...prev,
                    resume: file.name,
                    resumeData: reader.result // Store base64 data for "download"
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownloadResume = () => {
        if (profile.resumeData) {
            const link = document.createElement('a');
            link.href = profile.resumeData;
            link.download = profile.resume; // Use stored filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("No real resume uploaded. This is a placeholder.");
        }
    };

    return (
        <div className="font-sans space-y-8 pb-10">

            {/* Header Section */}
            <div className="relative">
                {/* Banner */}
                <div className="h-64 w-full rounded-3xl overflow-hidden relative shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900"></div>
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500 to-teal-500 blur-3xl transform scale-150"></div>

                    {/* Progress Bar (Visible only on Banner for style) */}
                    <div className="absolute bottom-4 right-8 bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider">Profile Completed</span>
                        <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${completion}%` }}></div>
                        </div>
                        <span className="font-bold">{completion}%</span>
                    </div>
                </div>

                {/* Profile Card Overlay */}
                <div className="mx-4 sm:mx-10 relative -mt-24">
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start md:items-end">

                        {/* Avatar */}
                        <div className="relative shrink-0 -mt-24 md:-mt-0 md:-mb-6 group">
                            <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl p-1.5 bg-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500 ease-out cursor-pointer overflow-hidden relative">
                                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-4xl font-bold text-blue-600">
                                    {profile.name.charAt(0).toUpperCase()}
                                </div>
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Name & Title */}
                        <div className="flex-1 w-full pt-2">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div className="space-y-2 w-full">
                                    {isEditing ? (
                                        <div className="space-y-3 w-full max-w-md">
                                            <input type="text" name="name" value={tempProfile.name} onChange={handleInputChange} className="text-3xl font-bold text-slate-900 bg-white/50 border border-slate-300 rounded-lg px-3 py-1 w-full outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full Name" />
                                            <input type="text" name="title" value={tempProfile.title} onChange={handleInputChange} className="text-lg text-slate-500 font-medium bg-white/50 border border-slate-300 rounded-lg px-3 py-1 w-full outline-none focus:ring-2 focus:ring-blue-500" placeholder="Headline / Tagline" />
                                        </div>
                                    ) : (
                                        <>
                                            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{profile.name}</h1>
                                            <p className="text-xl text-slate-500 font-medium">{profile.title}</p>
                                        </>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 pt-1">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                                            <Mail className="w-4 h-4 text-slate-500" /> <span>{profile.email}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                                            <MapPin className="w-4 h-4 text-slate-500" />
                                            {isEditing ? (
                                                <input type="text" name="location" value={tempProfile.location} onChange={handleInputChange} className="bg-transparent border-b border-slate-400 w-32 outline-none" placeholder="City, Country" />
                                            ) : (
                                                <span>{profile.location || 'Add Location'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 shrink-0">
                                    {isEditing ? (
                                        <>
                                            <Button variant="outline" onClick={handleEditToggle} className="rounded-xl px-4 border-slate-300">Cancel</Button>
                                            <Button onClick={handleSave} disabled={saving} className="rounded-xl px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                                                {saving ? 'Saving...' : 'Save Profile'}
                                            </Button>
                                        </>
                                    ) : (
                                        <Button onClick={handleEditToggle} className="rounded-xl px-6 py-2.5 bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-900/20">
                                            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-10">

                {/* Left Column (Main Info) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Bio Section */}
                    <Card className="p-8 border-slate-100 shadow-sm rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                <UserIcon className="w-6 h-6 text-blue-500" /> About Me
                            </h2>
                        </div>
                        {isEditing ? (
                            <textarea name="bio" value={tempProfile.bio} onChange={handleInputChange} className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 resize-none bg-slate-50" placeholder="Tell us about yourself..." />
                        ) : (
                            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{profile.bio || "No bio added yet."}</p>
                        )}
                    </Card>

                    {/* Education Section */}
                    <Card className="p-8 border-slate-100 shadow-sm rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                <School className="w-6 h-6 text-purple-500" /> Education
                            </h2>
                            {isEditing && (
                                <Button variant="ghost" size="sm" onClick={() => addItem('education', { degree: '', school: '', year: '', grade: '' })} className="text-purple-600">
                                    <Plus className="w-4 h-4 mr-1" /> Add
                                </Button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {(isEditing ? tempProfile.education : profile.education).map((edu) => (
                                <div key={edu.id} className="group relative pl-4 border-l-2 border-purple-100 hover:border-purple-300 transition-colors">
                                    {isEditing ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                                            <input placeholder="Degree (e.g. B.Tech)" value={edu.degree} onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)} className="p-2 border rounded-lg" />
                                            <input placeholder="School / University" value={edu.school} onChange={(e) => updateItem('education', edu.id, 'school', e.target.value)} className="p-2 border rounded-lg" />
                                            <input placeholder="Year (e.g. 2024)" value={edu.year} onChange={(e) => updateItem('education', edu.id, 'year', e.target.value)} className="p-2 border rounded-lg" />
                                            <input placeholder="Grade / CGPA" value={edu.grade} onChange={(e) => updateItem('education', edu.id, 'grade', e.target.value)} className="p-2 border rounded-lg" />
                                            <Button variant="ghost" size="sm" className="col-span-2 text-red-500 hover:bg-red-50" onClick={() => removeItem('education', edu.id)}><Trash2 className="w-4 h-4 mr-2" /> Remove</Button>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="text-lg font-bold text-slate-900">{edu.degree}</h3>
                                            <p className="text-slate-600">{edu.school}</p>
                                            <div className="flex gap-4 mt-1 text-sm text-slate-500">
                                                <span>{edu.year}</span>
                                                {edu.grade && <span className="text-emerald-600 font-medium">Grade: {edu.grade}</span>}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            {!isEditing && profile.education.length === 0 && <p className="text-slate-400 italic">No education details added.</p>}
                        </div>
                    </Card>

                    {/* Projects Section */}
                    <Card className="p-8 border-slate-100 shadow-sm rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                <Briefcase className="w-6 h-6 text-indigo-500" /> Projects
                            </h2>
                            {isEditing && (
                                <Button variant="ghost" size="sm" onClick={() => addItem('projects', { title: '', desc: '', link: '' })} className="text-indigo-600">
                                    <Plus className="w-4 h-4 mr-1" /> Add
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(isEditing ? tempProfile.projects : profile.projects).map((proj) => (
                                <div key={proj.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 relative">
                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <input placeholder="Project Title" value={proj.title} onChange={(e) => updateItem('projects', proj.id, 'title', e.target.value)} className="w-full p-2 border rounded-lg" />
                                            <textarea placeholder="Description" value={proj.desc} onChange={(e) => updateItem('projects', proj.id, 'desc', e.target.value)} className="w-full p-2 border rounded-lg h-20 resize-none" />
                                            <input placeholder="Link (GitHub/Demo)" value={proj.link} onChange={(e) => updateItem('projects', proj.id, 'link', e.target.value)} className="w-full p-2 border rounded-lg" />
                                            <Button variant="ghost" size="sm" className="text-red-500 w-full hover:bg-red-50" onClick={() => removeItem('projects', proj.id)}><Trash2 className="w-4 h-4 mr-2" /> Remove</Button>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col">
                                            <h3 className="font-bold text-slate-900 mb-2">{proj.title}</h3>
                                            <p className="text-sm text-slate-600 mb-4 flex-1">{proj.desc}</p>
                                            {proj.link && (
                                                <a href={proj.link} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm font-semibold hover:underline flex items-center gap-1">
                                                    View Project <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {!isEditing && profile.projects.length === 0 && <p className="text-slate-400 italic">No projects added.</p>}
                    </Card>

                    {/* Certifications Section */}
                    <Card className="p-8 border-slate-100 shadow-sm rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                <Award className="w-6 h-6 text-orange-500" /> Certifications
                            </h2>
                            {isEditing && (
                                <Button variant="ghost" size="sm" onClick={() => addItem('certifications', { title: '', issuer: '', year: '' })} className="text-orange-600">
                                    <Plus className="w-4 h-4 mr-1" /> Add
                                </Button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {(isEditing ? tempProfile.certifications : profile.certifications).map((cert) => (
                                <div key={cert.id} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                    <div className="flex-1">
                                        {isEditing ? (
                                            <div className="flex flex-col md:flex-row gap-2">
                                                <input placeholder="Certificate Name" value={cert.title} onChange={(e) => updateItem('certifications', cert.id, 'title', e.target.value)} className="p-2 border rounded-lg flex-1" />
                                                <input placeholder="Issuer" value={cert.issuer} onChange={(e) => updateItem('certifications', cert.id, 'issuer', e.target.value)} className="p-2 border rounded-lg flex-1" />
                                                <input placeholder="Year" value={cert.year} onChange={(e) => updateItem('certifications', cert.id, 'year', e.target.value)} className="p-2 border rounded-lg w-24" />
                                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removeItem('certifications', cert.id)}><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-bold text-slate-900">{cert.title}</p>
                                                <p className="text-sm text-slate-500">{cert.issuer} • {cert.year}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {!isEditing && profile.certifications.length === 0 && <p className="text-slate-400 italic">No certifications added.</p>}
                        </div>
                    </Card>

                </div>

                {/* Right Column (Sidebar Widgets) */}
                <div className="space-y-8">

                    {/* Resume Widget */}
                    <Card className="p-8 border-slate-100 shadow-md rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/30 transition-colors"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                                    <FileText className="w-8 h-8 text-blue-300" />
                                </div>
                            </div>
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-2 truncate" title={profile.resume}>{profile.resume || 'No Resume Uploaded'}</h3>
                                <p className="text-slate-400 text-sm">PDF, DOCX formats supported</p>
                            </div>
                            <div className="space-y-3">
                                {profile.resume && (
                                    <button onClick={handleDownloadResume} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                                        <Download className="w-4 h-4" /> Download Resume
                                    </button>
                                )}
                                {isEditing && (
                                    <label className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer">
                                        <Upload className="w-4 h-4" /> {profile.resume ? 'Replace Resume' : 'Upload Resume'}
                                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Skills Widget */}
                    <Card className="p-8 border-slate-100 shadow-sm rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 text-lg">Skills</h3>
                            {isEditing && (
                                <button onClick={addSkill} className="text-blue-600 hover:bg-blue-50 p-1 rounded-lg transition-colors"><Plus className="w-5 h-5" /></button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(isEditing ? tempProfile.skills : profile.skills).map((skill) => (
                                <div key={skill.id} className="relative group">
                                    {isEditing ? (
                                        <div className="flex gap-1 mb-2">
                                            <input value={skill.name} onChange={(e) => updateSkill(skill.id, 'name', e.target.value)} className="bg-slate-50 border rounded-lg px-2 py-1 text-sm w-24" placeholder="Skill" />
                                            <select value={skill.level} onChange={(e) => updateSkill(skill.id, 'level', e.target.value)} className="bg-slate-50 border rounded-lg px-1 py-1 text-xs text-slate-500">
                                                <option>Beginner</option><option>Intermediate</option><option>Expert</option>
                                            </select>
                                            <button onClick={() => removeSkill(skill.id)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                                        </div>
                                    ) : (
                                        <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:border-blue-300 transition-colors" title={skill.level}>
                                            {skill.name}
                                        </span>
                                    )}
                                </div>
                            ))}
                            {!isEditing && profile.skills.length === 0 && <span className="text-slate-400 italic text-sm">Add your top skills.</span>}
                        </div>
                    </Card>

                    {/* Contact & Social */}
                    <Card className="p-8 border-slate-100 shadow-sm rounded-3xl">
                        <h3 className="font-bold text-slate-900 mb-6 text-lg">Contact Information</h3>
                        <div className="space-y-4">
                            {/* Phone */}
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-400 font-bold uppercase">Phone</p>
                                    {isEditing ? (
                                        <input type="text" name="phone" value={tempProfile.phone} onChange={handleInputChange} className="border-b w-full outline-none py-1 text-sm text-slate-900" placeholder="+1234567890" />
                                    ) : (
                                        <p className="text-sm font-semibold text-slate-900">{profile.phone || 'Not Provided'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="pt-4 border-t border-slate-100 space-y-3">
                                {[{ name: 'linkedin', Icon: Linkedin }, { name: 'github', Icon: Github }, { name: 'portfolio', Icon: Globe }].map(({ name, Icon }) => (
                                    <div key={name} className="flex items-center gap-3">
                                        <Icon className="w-4 h-4 text-slate-400" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={tempProfile.socialLinks?.[name] || ''}
                                                onChange={(e) => handleInputChange(e, 'socialLinks')}
                                                name={name}
                                                className="border-b w-full outline-none py-1 text-xs text-slate-600"
                                                placeholder={`${name} URL`}
                                            />
                                        ) : (
                                            <a href={profile.socialLinks?.[name] || '#'} target="_blank" rel="noreferrer" className={`text-sm ${profile.socialLinks?.[name] ? 'text-blue-600 hover:underline' : 'text-slate-400 pointer-events-none'}`}>
                                                {profile.socialLinks?.[name] ? `/${name}` : `Add ${name}`}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}

export default Profile;
