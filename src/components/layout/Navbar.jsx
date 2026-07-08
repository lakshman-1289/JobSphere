import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, User, Menu, X, LogOut } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <div className="bg-slate-900 text-white p-2.5 rounded-xl group-hover:scale-105 transition-all duration-300 shadow-lg shadow-slate-900/20">
                                {/* Using Layers or Hexagon for a tech/platform vibe */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                    <polygon points="12 2 2 7 12 12 22 7 12 2 text-white" />
                                    <polyline points="2 17 12 22 22 17" />
                                    <polyline points="2 12 12 17 22 12" />
                                </svg>
                            </div>
                            <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight group-hover:text-black transition-colors">
                                JobSphere
                            </span>
                        </Link>
                        <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-center">
                            <div className="max-w-lg w-full lg:max-w-xs">
                                <label htmlFor="search" className="sr-only">Search</label>
                                <div className="relative text-gray-400 focus-within:text-gray-600">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div> {/* Closes the left-side 'flex' container */}

                    <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-5">
                                <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                                    <span className="sr-only">View notifications</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                                </button>

                                <div className="h-8 w-px bg-gray-200"></div>

                                <div className="flex items-center gap-3">
                                    <Link to={user.role === 'recruiter' ? '/recruiter/profile' : '/profile'} className="text-right hidden lg:block hover:opacity-80 transition-opacity">
                                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                    </Link>
                                    <Button variant="ghost" size="sm" onClick={logout} className="text-slate-500 hover:text-red-600">
                                        <LogOut className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 font-semibold hover:bg-transparent px-2">Log in</Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="bg-slate-900 text-white hover:bg-black rounded-full px-6 py-2 shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 font-semibold text-sm">
                                        Sign up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden bg-white border-b border-gray-200">
                    {user && (
                        <div className="pt-2 pb-3 space-y-1 px-2">
                            <Link
                                to="/jobs"
                                className={`block pl-3 pr-4 py-2 rounded-md text-base font-medium ${isActive('/jobs') ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                Find Jobs
                            </Link>
                            <Link
                                to="/post-job"
                                className={`block pl-3 pr-4 py-2 rounded-md text-base font-medium ${isActive('/post-job') ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                Post Jobs
                            </Link>
                        </div>
                    )}
                    <div className="pt-4 pb-6 border-t border-gray-200">
                        {user ? (
                            <div className="px-4 space-y-3">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
                                            <span className="text-brand-700 font-semibold text-lg">{user.name.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800">{user.name}</div>
                                        <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={logout} className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign out
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col px-4 space-y-3">
                                <Link to="/login" className="w-full">
                                    <Button className="w-full justify-center bg-slate-900 text-white hover:bg-black rounded-xl py-3 shadow-md font-semibold">Log in</Button>
                                </Link>
                                <Link to="/register" className="w-full">
                                    <Button className="w-full justify-center bg-slate-900 text-white hover:bg-black rounded-xl py-3 shadow-md font-semibold">Sign up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
