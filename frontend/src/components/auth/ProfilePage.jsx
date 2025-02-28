import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { currentUser, updateProfile, error } = useAuth();
  const [formData, setFormData] = useState({
    bio: currentUser?.bio || '',
    email: currentUser?.email || '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };
  
  if (!currentUser) return <div>Loading...</div>;
  
  return (
    <div className="max-w-md mx-auto mt-10 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{successMessage}</div>}
      
      <div className="mb-6">
        <p><strong>Username:</strong> {currentUser.username}</p>
        <p><strong>Role:</strong> {currentUser.role}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.bio}
            onChange={handleChange}
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};
export default ProfilePage;