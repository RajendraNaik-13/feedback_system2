import React, { useState } from 'react';

const CreateFeedbackModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('new');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, priority, status });
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('new');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create Feedback</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-sm font-medium">Title</label>
            <input 
              type="text" 
              className="w-full border rounded p-2"
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea 
              className="w-full border rounded p-2"
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Priority</label>
            <select 
              className="w-full border rounded p-2"
              value={priority} 
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Status</label>
            <select 
              className="w-full border rounded p-2"
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="under_review">Under Review</option>
              <option value="implemented">Implemented</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-300 rounded" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFeedbackModal;