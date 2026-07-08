import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, UserCircle, PlusCircle, Settings, Award } from 'lucide-react';
import Card from '../common/Card';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();

    if (!user) return null;

    const navItems = [
        { name: 'Dashboard', to: user.role === 'recruiter' ? '/recruiter-dashboard' : '/student-dashboard', icon: LayoutDashboard },

        // Student Specific
        ...(user.role === 'student' ? [
            { name: 'My Applications', to: '/my-applications', icon: FileText },
        ] : []),

        // Recruiter Specific
        ...(user.role === 'recruiter' ? [
            { name: 'Post a Job', to: '/post-job', icon: PlusCircle },
        ] : []),

        { name: 'Profile', to: '/profile', icon: UserCircle },
    ];

    return (
        <div className="h-full">
            <Card className="h-full border-slate-100 shadow-xl bg-white/80 backdrop-blur-xl rounded-3xl flex flex-col overflow-hidden relative">
                {/* 1. Header with Profile */}
                <div className="relative p-6 text-center border-b border-slate-100/50">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-10"></div>
                    {/* Decorative blur */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-400/20 blur-3xl rounded-full pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 mx-auto rounded-full p-1 bg-white shadow-lg mb-3">
                            <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">{user.name}</h3>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{user.role}</p>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wide rounded-full border border-emerald-100">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Online
                        </div>
                    </div>
                </div>

                {/* 2. Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) => `
                                flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600 shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                            `}
                        >
                            <item.icon className={`w-5 h-5 mr-3 transition-colors duration-300 ${item.name === 'Post a Job' ? 'text-indigo-500' : ''}`} />
                            {item.name}
                        </NavLink>
                    ))}

                    <div className="my-6 border-t border-slate-100 mx-4"></div>

                    <NavLink
                        to="/settings"
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors group"
                    >
                        <Settings className="w-5 h-5 mr-3 group-hover:rotate-45 transition-transform duration-300" />
                        Settings
                    </NavLink>
                </div>

                {/* 3. Promo Area (Subtle bottom integrated) */}
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-4 text-white relative overflow-hidden shadow-lg shadow-indigo-500/20 group cursor-pointer hover:shadow-indigo-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:scale-150 transition-transform duration-500"></div>

                        <div className="relative z-10 flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Award className="w-5 h-5 text-yellow-300" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Premium</p>
                                <p className="text-[10px] text-indigo-100 opacity-80">Unlock all features</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Sidebar;
