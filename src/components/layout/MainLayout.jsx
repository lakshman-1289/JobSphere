import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />

            {/* Centered Container for Sidebar + Content */}
            <div className={`flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 ${user ? 'md:flex md:gap-8' : ''}`}>

                {/* Fixed/Sticky Sidebar for Desktop - Only visible if logged in */}
                {user && (
                    <aside className="hidden md:block w-72 shrink-0">
                        <div className="sticky top-28">
                            <Sidebar />
                        </div>
                    </aside>
                )}

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    <Outlet />
                </main>
            </div>

            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} JobSphere. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
