import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ModeToggle } from '../Theme/mode-toggle';
const Navigation = () => {
  const { currentUser, logout, isAdmin, isModerator } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <nav >
      <div className="dark:text-white dark:bg-slate-950  p-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Feedback System</Link>
        
        <div className="flex space-x-4 items-center">
         <ModeToggle/>
          {currentUser ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              
              {(isAdmin || isModerator) && (
                <>
                  <Link to="/boards" className="hover:text-gray-300">Boards</Link>
                  <Link to="/feedback" className="hover:text-gray-300">Feedback</Link>
                </>
              )}
              
              {isAdmin && (
                <Link to="/admin" className="hover:text-gray-300">Admin Panel</Link>
              )}
              
              <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              
              <div className="flex items-center">
                <span className="mr-2">{currentUser.username}   </span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;