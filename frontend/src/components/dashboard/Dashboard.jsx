import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { currentUser, isAdmin, isModerator } = useAuth();

  return (
    <div className="lg:px-40 p-4 dark:bg-black">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="dark:border border-2 dark:shadow-md rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {currentUser.username}!</h2>
        <p className="mb-2">You are logged in as: <span className="font-medium capitalize">{currentUser.role}</span></p>
        <p>Use the navigation menu to access your available features.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Your Profile</h3>
          <p className="text-gray-600 mb-4">View and edit your personal information</p>
          <a href="/profile" className="text-blue-500 hover:underline">Go to Profile →</a>
        </div>

        {(isModerator || isAdmin) && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">Manage Boards</h3>
              <p className="text-gray-600 mb-4">Create and manage feedback boards</p>
              <a href="/boards" className="text-blue-500 hover:underline">Go to Boards →</a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">Feedback Items</h3>
              <p className="text-gray-600 mb-4">Manage and moderate feedback</p>
              <a href="/feedback" className="text-blue-500 hover:underline">Go to Feedback →</a>
            </div>
          </>
        )}

        {isAdmin && (
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Admin Panel</h3>
            <p className="text-gray-600 mb-4">Manage users and system settings</p>
            <a href="/admin" className="text-blue-500 hover:underline">Go to Admin Panel →</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;