// src/components/feedback/FeedbackItem.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaThumbsUp, FaClock, FaUser, FaComment, 
  FaFlag, FaChevronDown, FaChevronUp 
} from 'react-icons/fa';

const FeedbackItem = ({ 
  feedback, 
  onUpvote, 
  onRemoveUpvote, 
  onStatusChange,
  isAuthenticated 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  const statusColorMap = {
    new: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-purple-100 text-purple-800',
    implemented: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };
  
  const priorityColorMap = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };
  
  const statusLabels = {
    new: 'New',
    in_progress: 'In Progress',
    under_review: 'Under Review',
    implemented: 'Implemented',
    closed: 'Closed'
  };
  
  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical'
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleUpvoteClick = () => {
    if (feedback.is_upvoted) {
      onRemoveUpvote(feedback.id);
    } else {
      onUpvote(feedback.id);
    }
  };
  
  const handleStatusChange = (newStatus) => {
    onStatusChange(feedback.id, newStatus);
    setShowStatusDropdown(false);
  };
  
  const canChangeStatus = isAuthenticated && (
    feedback.created_by.id === parseInt(localStorage.getItem('user_id')) || 
    localStorage.getItem('is_staff') === 'true' ||
    localStorage.getItem('can_moderate') === 'true'
  );

  return (
    <div className="border-b last:border-b-0 hover:bg-gray-50">
      <div className="p-4">
        <div className="flex">
          {/* Upvote button */}
          <div className="flex flex-col items-center mr-4">
            <button
              onClick={handleUpvoteClick}
              disabled={!isAuthenticated}
              className={`flex flex-col items-center px-2 py-1 rounded ${
                feedback.is_upvoted 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:bg-gray-100'
              } ${!isAuthenticated && 'opacity-50 cursor-not-allowed'}`}
              title={isAuthenticated ? 'Upvote this feedback' : 'Log in to upvote'}
            >
              <FaThumbsUp />
              <span className="text-sm font-semibold mt-1">{feedback.upvote_count}</span>
            </button>
          </div>
          
          {/* Feedback content */}
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold mb-1">
                <Link 
                  to={`/boards/${feedback.board}/feedback/${feedback.id}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {feedback.title}
                </Link>
              </h3>
              
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${priorityColorMap[feedback.priority]}`}>
                  {priorityLabels[feedback.priority]}
                </span>
                {canChangeStatus ? (
                  <div className="relative">
                    <button 
                      className={`text-xs px-2 py-1 rounded-full ${statusColorMap[feedback.status]} flex items-center cursor-pointer`}
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    >
                      {statusLabels[feedback.status]}
                      <FaChevronDown className="ml-1 text-xs" />
                    </button>
                    
                    {showStatusDropdown && (
                      <div className="absolute right-0 mt-1 w-40 rounded-md shadow-lg bg-white z-10 border">
                        <div className="py-1">
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <button
                              key={value}
                              className={`w-full text-left px-4 py-2 text-sm ${
                                value === feedback.status ? 'bg-gray-100' : 'hover:bg-gray-50'
                              }`}
                              onClick={() => handleStatusChange(value)}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColorMap[feedback.status]}`}>
                    {statusLabels[feedback.status]}
                  </span>
                )}
              </div>
            </div>
            
            <p className={`text-gray-600 mb-2 ${!expanded && 'line-clamp-2'}`}>
              {feedback.description}
            </p>
            
            {feedback.description.length > 150 && (
              <button 
                className="text-blue-600 text-sm hover:underline mb-2"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <span className="flex items-center">Show less <FaChevronUp className="ml-1" /></span>
                ) : (
                  <span className="flex items-center">Show more <FaChevronDown className="ml-1" /></span>
                )}
              </button>
            )}
            
            <div className="flex items-center text-xs text-gray-500 mt-2">
              <span className="flex items-center mr-4" title="Created by">
                <FaUser className="mr-1" /> {feedback.created_by.username}
              </span>
              <span className="flex items-center mr-4" title="Created on">
                <FaClock className="mr-1" /> {formatDate(feedback.created_at)}
              </span>
              <span className="flex items-center" title="Comments">
                <FaComment className="mr-1" /> 0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackItem;