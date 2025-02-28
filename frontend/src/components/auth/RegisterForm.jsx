import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    role: 'contributor'
  });
  const [formErrors, setFormErrors] = useState({});
  const { register, error } = useAuth();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    const errors = {};
    if (!formData.username) errors.username = 'Username is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.password2) errors.password2 = 'Passwords do not match';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.password2,
        formData.role
      );
    } catch (err) {
      // Error is handled in AuthContext
      console.error('Registration failed:', err);
      if (err.response?.data) {
        setFormErrors(err.response.data);
      }
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10  p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            className={`w-full p-2 border rounded ${formErrors.username ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.username}
            onChange={handleChange}
          />
          {formErrors.username && <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={`w-full p-2 border rounded ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={`w-full p-2 border rounded ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.password}
            onChange={handleChange}
          />
          {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password2">Confirm Password</label>
          <input
            id="password2"
            type="password"
            name="password2"
            className={`w-full p-2 border rounded ${formErrors.password2 ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.password2}
            onChange={handleChange}
          />
          {formErrors.password2 && <p className="text-red-500 text-sm mt-1">{formErrors.password2}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="contributor">Contributor</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
      
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
      </p>
    </div>
  );
};

export default RegisterForm;