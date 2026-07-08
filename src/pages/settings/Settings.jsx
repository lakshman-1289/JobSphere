import React, { useState, useEffect } from 'react';
import {
    User, Bell, Lock, Shield, Moon, Monitor,
    ChevronRight, Save, Key, Mail, Globe,
    LogOut, Trash2, Check, AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [isLoading, setIsLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    // Mock Settings State (In real app, fetch from DB)
    const [settings, setSettings] = useState({
        notifications: {
            jobAlerts: true,
            applicationUpdates: true,
            marketing: false,
            securityAlerts: true
        },
        privacy: {
            profileVisibility: 'public', // public, recruiters, private
            showResume: true,
            searchEngineIndexing: false
        },
        appearance: {
            theme: 'light',
            density: 'comfortable'
        }
    });

    useEffect(() => {
        // Load from local storage if available
        const localSettings = localStorage.getItem('userSettings');
        if (localSettings) {
            setSettings(JSON.parse(localSettings));
        }
    }, []);

    const handleToggle = (category, key) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: !prev[category][key]
            }
        }));
    };

    const handleSelect = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            localStorage.setItem('userSettings', JSON.stringify(settings));
            setIsLoading(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 800);
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Shield },
        { id: 'security', label: 'Security', icon: Lock },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">

            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 -ml-16 -mb-16"></div>

                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Settings</h1>
                        <p className="text-slate-400 text-lg">Manage your account preferences and security.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <Card className="p-2 border-slate-100 shadow-sm rounded-2xl sticky top-24">
                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                                            ${isActive
                                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-300' : 'text-slate-400'}`} />
                                        {tab.label}
                                        {isActive && <ChevronRight className="w-4 h-4 ml-auto text-slate-500" />}
                                    </button>
                                );
                            })}
                            <div className="my-2 border-t border-slate-100 mx-2"></div>
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </nav>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Account Settings */}
                    {activeTab === 'account' && (
                        <Card className="p-8 border-slate-100 shadow-sm rounded-3xl animate-fadeIn">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <User className="w-6 h-6 text-blue-500" /> Account Information
                            </h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Full Name</label>
                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 flex items-center gap-3">
                                            <User className="w-5 h-5 text-slate-400" />
                                            {user?.name}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-slate-400" />
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Account Type</label>
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 inline-flex items-center gap-2 uppercase text-xs font-bold tracking-wider">
                                        <span className={`w-2 h-2 rounded-full ${user?.role === 'recruiter' ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
                                        {user?.role} Account
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 text-red-600 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" /> Danger Zone
                                </h3>
                                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl">
                                    <div>
                                        <p className="font-bold text-red-900">Delete Account</p>
                                        <p className="text-red-600/80 text-sm">Once you delete your account, there is no going back.</p>
                                    </div>
                                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300">
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Notifications Settings */}
                    {activeTab === 'notifications' && (
                        <Card className="p-8 border-slate-100 shadow-sm rounded-3xl animate-fadeIn">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Bell className="w-6 h-6 text-indigo-500" /> Notification Preferences
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { id: 'jobAlerts', label: 'Job Alerts', desc: 'Get notified when new jobs match your profile.' },
                                    { id: 'applicationUpdates', label: 'Application Updates', desc: 'Receive emails when your application status changes.' },
                                    { id: 'securityAlerts', label: 'Security Alerts', desc: 'Get notified about new sign-ins and password changes.' },
                                    { id: 'marketing', label: 'Marketing & Tips', desc: 'Receive career tips and platform updates.' }
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                            <p className="font-bold text-slate-900">{item.label}</p>
                                            <p className="text-sm text-slate-500">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggle('notifications', item.id)}
                                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out ${settings.notifications[item.id] ? 'bg-indigo-500' : 'bg-slate-300'}`}
                                        >
                                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.notifications[item.id] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Privacy Settings */}
                    {activeTab === 'privacy' && (
                        <Card className="p-8 border-slate-100 shadow-sm rounded-3xl animate-fadeIn">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-emerald-500" /> Privacy & Visibility
                            </h2>
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-3">Profile Visibility</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {['public', 'recruiters', 'private'].map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => handleSelect('privacy', 'profileVisibility', option)}
                                                className={`
                                                    p-4 rounded-xl border-2 text-left transition-all duration-200
                                                    ${settings.privacy.profileVisibility === option
                                                        ? 'border-emerald-500 bg-emerald-50'
                                                        : 'border-slate-100 bg-white hover:border-slate-200'}
                                                `}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold capitalize text-slate-900">{option}</span>
                                                    {settings.privacy.profileVisibility === option && <Check className="w-5 h-5 text-emerald-500" />}
                                                </div>
                                                <p className="text-xs text-slate-500">
                                                    {option === 'public' && 'Visible to everyone on the platform.'}
                                                    {option === 'recruiters' && 'Only visible to verified recruiters.'}
                                                    {option === 'private' && 'Hidden from everyone except you.'}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-6">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                            <p className="font-bold text-slate-900">Show Resume</p>
                                            <p className="text-sm text-slate-500">Allow recruiters to download your resume.</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggle('privacy', 'showResume')}
                                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out ${settings.privacy.showResume ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                        >
                                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.privacy.showResume ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <Card className="p-8 border-slate-100 shadow-sm rounded-3xl animate-fadeIn">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Lock className="w-6 h-6 text-blue-500" /> Login & Security
                            </h2>
                            <form className="space-y-6 max-w-lg">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Current Password</label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">New Password</label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Confirm New Password</label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>
                                <Button className="bg-slate-900 text-white w-full sm:w-auto">Update Password</Button>
                            </form>
                        </Card>
                    )}

                    {/* Save Changes Floating Action or Static Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className={`
                                rounded-xl px-8 py-4 shadow-xl transition-all duration-300 flex items-center gap-3 text-lg font-bold
                                ${saved ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-black hover:scale-105 active:scale-95'}
                            `}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : saved ? (
                                <Check className="w-6 h-6" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {saved ? 'Changes Saved!' : 'Save Changes'}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;
