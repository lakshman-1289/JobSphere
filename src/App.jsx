import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AuthProvider } from './context/AuthContext';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard';
import JobApplications from './pages/dashboard/JobApplications';
import PostJob from './pages/jobs/PostJob';
import JobDetails from './pages/jobs/JobDetails';
import MyApplications from './pages/dashboard/MyApplications';
import Profile from './pages/profile/Profile';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';
import Settings from './pages/settings/Settings';


const NotFound = () => <div className="p-8 text-center text-2xl font-bold text-gray-500">404 - Page Not Found</div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="student-dashboard" element={<StudentDashboard />} />
            <Route path="jobs" element={<StudentDashboard />} />
            <Route path="recruiter-dashboard" element={<RecruiterDashboard />} />
            <Route path="job/:jobId/applications" element={<JobApplications />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="jobs/:id" element={<JobDetails />} />
            <Route path="my-applications" element={<MyApplications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="recruiter/profile" element={<RecruiterProfile />} />
            <Route path="settings" element={<Settings />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
