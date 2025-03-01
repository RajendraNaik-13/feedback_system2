import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/layout/Navigation';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProfilePage from './components/auth/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';
import BoardsList from './components/boards/BoardsList';
import FeedbackList from './components/feedback/FeedbackList';
const AdminPanel = () => <div className="container mx-auto p-4"><h1 className="text-2xl font-bold">Admin Panel</h1></div>;
//const BoardsList = () => <div className="container mx-auto p-4"><h1 className="text-2xl font-bold">Boards List</h1></div>;
//const FeedbackList = () => <div className="container mx-auto p-4"><h1 className="text-2xl font-bold">Feedback List</h1></div>;
const HomePage = () => <div className="container mx-auto p-4"><h1 className="text-2xl font-bold">Welcome to Feedback Management System</h1></div>;

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              
              <Route element={<ProtectedRoute requiredRole="moderator" />}>
                <Route path="/boards" element={<BoardsList />} />
                <Route path="/feedback" element={<FeedbackList />} />
              </Route>
              
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