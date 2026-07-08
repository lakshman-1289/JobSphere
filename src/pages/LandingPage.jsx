import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { Search, Briefcase, Users, TrendingUp, CheckCircle, ArrowRight, Star, Shield, Zap, Globe, MessageCircle, Building2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import heroImg from '../assets/images/hero-illustration.png';

const LandingPage = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/jobs" replace />;
    }

    return (
        <div className="bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            {/* 1. Hero Section - Modern Light/Clean Theme */}
            <div className="relative pt-10 pb-16 lg:pt-20 lg:pb-28 overflow-hidden">
                {/* Background Decor - Subtle Gradients */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-purple-50/40 to-white"></div>
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[80px] -z-10 mix-blend-multiply"></div>
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[80px] -z-10 mix-blend-multiply"></div>

                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                        {/* Hero Text Content */}
                        <div className="flex-1 text-center lg:text-left z-10 pt-8 lg:pt-0">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 text-blue-700 font-semibold text-xs mb-6 tracking-wide uppercase transform hover:scale-105 transition-transform duration-300">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                                </span>
                                #1 Job Platform for Tech Talent
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-5">
                                Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-gradient-shift">dream job</span> <br />
                                without the chaos.
                            </h1>

                            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Join 10,000+ companies and candidates. Streamlined hiring for the modern world, built for speed, transparency, and quality.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link to="/jobs">
                                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 rounded-full transition-all hover:scale-105 flex items-center justify-center gap-2">
                                        Browse Jobs
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/post-job">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold border-2 border-slate-200 text-slate-700 hover:border-slate-800 hover:text-slate-900 rounded-full bg-white flex items-center justify-center">
                                        Post a Job - Free
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 pt-8 border-t border-slate-200/60">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-md relative z-${i}0 transition-transform hover:scale-110 hover:z-50`}>
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium mt-1">Trusted by <span className="text-slate-900 font-bold">50k+</span> engineers</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image / Graphic */}
                        <div className="flex-1 relative w-full perspective-1000">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-100 bg-white/50 backdrop-blur-sm transform hover:rotate-1 transition-transform duration-500 group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-purple-600/5 z-0"></div>
                                <img
                                    src={heroImg}
                                    alt="Digital Hiring Illustration"
                                    className="relative z-10 w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                />

                                {/* Floating Badges */}
                                <div className="absolute top-8 right-8 z-20 bg-white/90 backdrop-blur md:px-4 px-3 py-2 rounded-xl shadow-lg border border-slate-100 animate-bounce-slow">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-1.5 rounded-lg text-green-600">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase">Status</p>
                                            <p className="text-sm font-bold text-slate-800">Hired Successfully</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-12 left-8 z-20 bg-white/90 backdrop-blur md:px-5 px-3 py-3 rounded-xl shadow-lg border border-slate-100 animate-pulse-slow hidden sm:block">
                                    <div className="flex items-center gap-4">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white">
                                                    <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Applicant" className="w-full h-full object-cover rounded-full" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-sm font-bold text-slate-700">
                                            <span className="text-blue-600">12+</span> new applicants
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* 2. Stats Section */}
            <div className="py-12 bg-white border-y border-slate-100">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
                        {[
                            { label: "Live Jobs", value: "12k+", color: "text-blue-600" },
                            { label: "Companies", value: "8k+", color: "text-indigo-600" },
                            { label: "Active Seekers", value: "50k+", color: "text-purple-600" },
                            { label: "Hiring Success", value: "98%", color: "text-emerald-600" }
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center px-4">
                                <p className={`text-4xl lg:text-5xl font-extrabold ${stat.color} mb-2`}>{stat.value}</p>
                                <p className="text-slate-500 font-medium text-sm lg:text-base uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Value Proposition */}
            <div className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">Why Choose JobSphere?</h2>
                        <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl mb-6">
                            Constructed for the modern workforce
                        </h3>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            We've stripped away the noise to focus on what matters: meaningful connections and career growth.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {[
                            {
                                icon: Zap,
                                title: "Instant Connections",
                                desc: "No more waiting weeks. Our real-time chat and notification system keeps you in the loop instantly.",
                                color: "text-yellow-600",
                                bg: "bg-yellow-100",
                                border: "group-hover:border-yellow-200",
                                shadow: "group-hover:shadow-yellow-500/10"
                            },
                            {
                                icon: Shield,
                                title: "Verified Profiles",
                                desc: "We vet every company and candidate to ensure a safe, scam-free environment for your career.",
                                color: "text-blue-600",
                                bg: "bg-blue-100",
                                border: "group-hover:border-blue-200",
                                shadow: "group-hover:shadow-blue-500/10"
                            },
                            {
                                icon: Globe,
                                title: "Remote Opportunities",
                                desc: "Access a global talent pool. Find remote jobs or hire talent from anywhere in the world.",
                                color: "text-emerald-600",
                                bg: "bg-emerald-100",
                                border: "group-hover:border-emerald-200",
                                shadow: "group-hover:shadow-emerald-500/10"
                            }
                        ].map((item, idx) => (
                            <div key={idx} className={`group bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:-translate-y-2 transition-all duration-300 ${item.shadow} ${item.border}`}>
                                <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h4 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h4>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. How It Works */}
            <div className="py-24 bg-white relative">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">How it works</h2>
                        <p className="text-lg text-slate-500">Get hired in 3 simple steps</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                            {[
                                { step: "01", title: "Create Account", desc: "Sign up and build your professional profile in minutes." },
                                { step: "02", title: "Apply / Post", desc: "Browse tailored jobs or post vacancies for free." },
                                { step: "03", title: "Get Hired", desc: "Connect, interview, and start your new journey." }
                            ].map((s, i) => (
                                <div key={i} className="text-center relative bg-white md:bg-transparent pt-8 md:pt-0">
                                    <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-50 text-blue-600 shadow-xl shadow-blue-900/5 rounded-full flex items-center justify-center text-3xl font-extrabold mb-8 relative z-10">
                                        {s.step}
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900 mb-3">{s.title}</h4>
                                    <p className="text-slate-500 leading-relaxed px-4">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Contact / Support Section */}
            <div className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>

                        <div className="text-center lg:text-left lg:flex-1">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Still have questions?</h2>
                            <p className="text-lg text-slate-600 mb-8 max-w-lg">
                                Our support team is available 24/7 to help you with any issues or inquiries. We're here to help you succeed.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-slate-500 font-bold uppercase">Chat with us</p>
                                        <p className="font-semibold text-slate-900">Live Support</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-slate-500 font-bold uppercase">Email us</p>
                                        <p className="font-semibold text-slate-900">support@jobsphere.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Abstract illustration placeholder */}
                        <div className="w-full max-w-md h-64 bg-slate-100 rounded-2xl overflow-hidden relative">
                            <img
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
                                className="w-full h-full object-cover"
                                alt="Team support"
                            />
                            <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Footer CTA */}
            <div className="bg-slate-900 py-24 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">Ready to start your journey?</h2>
                    <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
                        Join the fastest growing job platform today. It only takes a minute to get started.
                    </p>
                    <Link to="/register">
                        <Button size="lg" className="px-12 py-5 bg-white text-slate-900 hover:bg-blue-50 hover:text-blue-700 rounded-full font-bold text-lg shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all transform hover:-translate-y-1">
                            Get Started Now
                        </Button>
                    </Link>
                    <div className="mt-10 flex items-center justify-center gap-6 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> No credit card required</span>
                        <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Free for students</span>
                        <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Verified Recruiters</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
