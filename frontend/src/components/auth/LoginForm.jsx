import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const { login, error } = useAuth();
  
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
      await login(formData.username, formData.password);
    } catch (err) {
      // Error is handled in AuthContext
      console.error('Login failed:', err);
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10  p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      
      <p className="mt-4 text-center">
        Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
      </p>
    </div>
  );
};
export default LoginForm;