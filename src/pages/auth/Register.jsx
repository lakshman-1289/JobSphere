import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Briefcase, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const userData = {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: role,
            company: role === 'recruiter' ? formData.companyName : undefined
        };

        const result = await register(userData);

        if (result.success) {
            navigate('/jobs');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}>
                <div className="w-full h-full bg-brand-900/60 backdrop-brightness-75 flex items-center justify-center px-12">
                    <div className="text-white max-w-lg">
                        <h1 className="text-4xl font-bold mb-6">Start your journey.</h1>
                        <p className="text-lg text-brand-100">Create an account to access thousands of exclusive job listings.</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white overflow-y-auto">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center justify-center lg:justify-start">
                            <Briefcase className="h-10 w-10 text-brand-600" />
                            <span className="ml-2 text-2xl font-bold text-gray-900">JobSphere</span>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="flex space-x-4 mb-8 bg-gray-50 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${role === 'student'
                                    ? 'bg-white text-brand-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <User className="mr-2 h-4 w-4" />
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('recruiter')}
                                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${role === 'recruiter'
                                    ? 'bg-white text-brand-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <Briefcase className="mr-2 h-4 w-4" />
                                Recruiter
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <Input
                                id="fullName"
                                label="Full Name"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="John Doe"
                            />

                            {role === 'recruiter' && (
                                <Input
                                    id="companyName"
                                    label="Company Name"
                                    required
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    placeholder="Acme Inc."
                                />
                            )}

                            <Input
                                id="email"
                                label="Email address"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@company.com"
                            />

                            <Input
                                id="password"
                                label="Password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />

                            <Input
                                id="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                            />

                            <Button type="submit" className="w-full shadow-lg bg-blue-500 shadow-brand-500/30 font-semibold" disabled={loading} size="lg">
                                {loading ? 'Creating account...' : 'Create account'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
