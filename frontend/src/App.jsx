import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/layout/Navigation';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProfilePage from './components/auth/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';

// Placeholder components - you'll implement these later
const AdminPanel = () => <div className="container mx-auto p-4"><h1 className="text-2xl font-bold">Admin Panel</h1></div>;
const BoardsList = () => <div className="container mx-auto p-4"><h1 className="text-2xl font-bold">Boards List</h1></div>;
const FeedbackList = () => <div className="container mx-auto p-4"><h1 className="text-2xl font-bold">Feedback List</h1></div>;
const HomePage = () => <div className="container mx-auto p-4"><h1 className="text-2xl font-bold">Welcome to Feedback Management System</h1></div>;

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              
              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              
              {/* Moderator and Admin routes */}
              <Route element={<ProtectedRoute requiredRole="moderator" />}>
                <Route path="/boards" element={<BoardsList />} />
                <Route path="/feedback" element={<FeedbackList />} />
              </Route>
              
              {/* Admin only routes */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
            </Routes>
          </main>
          
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;