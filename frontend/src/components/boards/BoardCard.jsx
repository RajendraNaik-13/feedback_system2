// src/components/boards/BoardCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaUnlock, FaUser, FaComment, FaCalendarAlt } from 'react-icons/fa';

const BoardCard = ({ board }) => {
  const formattedDate = new Date(board.updated_at).toLocaleDateString();
  
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold">
            <Link to={`/boards/${board.id}`} className="hover:text-blue-600 transition-colors">
              {board.title}
            </Link>
          </h2>
          <span className="text-gray-500">
            {board.is_public ? (
              <FaUnlock title="Public board" />
            ) : (
              <FaLock title="Private board" />
            )}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{board.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="flex items-center mr-4" title="Created by">
            <FaUser className="mr-1" /> {board.created_by.username}
          </span>
          <span className="flex items-center mr-4" title="Last updated">
            <FaCalendarAlt className="mr-1" /> {formattedDate}
          </span>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm">
            <span className="flex items-center mr-3" title="Members">
              <FaUser className="mr-1 text-blue-500" /> {board.members_count}
            </span>
            <span className="flex items-center" title="Feedback items">
              <FaComment className="mr-1 text-green-500" /> {board.feedback_count}
            </span>
          </div>
          
          <Link 
            to={`/boards/${board.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Board →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;