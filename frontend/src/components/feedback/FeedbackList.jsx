// src/components/feedback/FeedbackList.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaPlus, FaSearch, FaFilter, FaSort, FaThList, FaColumns, 
  FaChevronLeft, FaChevronRight, FaThumbsUp 
} from 'react-icons/fa';
import FeedbackItem from './FeedbackItem';
import FeedbackKanban from './FeedbackKanban';
import CreateFeedbackModal from './CreateFeedbackModal';

const FeedbackList = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list or kanban
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated_at'); // updated_at, created_at, upvotes, status, priority
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const token = localStorage.getItem('auth_token');
  const isAuthenticated = !!token;

  useEffect(() => {
    fetchBoardDetails();
    fetchFeedback();
  }, [boardId, statusFilter, priorityFilter, sortBy, sortOrder, currentPage, pageSize]);

  const fetchBoardDetails = async () => {
    try {
      const config = isAuthenticated ? {
        headers: { Authorization: `Token ${token}` }
      } : {};

      const response = await axios.get(`/api/boards/${boardId}/`, config);
      setBoard(response.data);
    } catch (err) {
      console.error('Error fetching board details:', err);
      setError('Failed to load board details');
    }
  };

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      let url = `/api/feedback/?board=${boardId}&ordering=${sortOrder === 'desc' ? '-' : ''}${sortBy}&page=${currentPage}&page_size=${pageSize}`;
      
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }
      
      if (priorityFilter !== 'all') {
        url += `&priority=${priorityFilter}`;
      }

      const config = isAuthenticated ? {
        headers: { Authorization: `Token ${token}` }
      } : {};
      
      const response = await axios.get(url, config);
      
      if (response.data.results) {
        // Pagination response
        setFeedback(response.data.results);
        setTotalPages(Math.ceil(response.data.count / pageSize));
      } else {
        // Non-paginated response
        setFeedback(response.data);
        setTotalPages(1);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch feedback. Please try again later.');
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFeedback = async (feedbackData) => {
    try {
      const response = await axios.post('/api/feedback/', 
        { ...feedbackData, board: boardId },
        { headers: { Authorization: `Token ${token}` }}
      );
      setFeedback([response.data, ...feedback]);
      setShowCreateModal(false);
      // Refetch to ensure proper sorting and filtering
      fetchFeedback();
    } catch (err) {
      console.error('Error creating feedback:', err);
      alert('Failed to create feedback. Please try again.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    
    if (!searchTerm.trim()) {
      fetchFeedback();
      return;
    }

    setLoading(true);
    const config = isAuthenticated ? {
      headers: { Authorization: `Token ${token}` }
    } : {};

    axios.get(`/api/feedback/?board=${boardId}&search=${searchTerm}`, config)
      .then(response => {
        setFeedback(response.data.results || response.data);
        setTotalPages(response.data.count ? Math.ceil(response.data.count / pageSize) : 1);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error searching feedback:', err);
        setError('Failed to search feedback. Please try again.');
        setLoading(false);
      });
  };

  const handleUpvote = async (feedbackId) => {
    if (!isAuthenticated) {
      alert('Please log in to upvote feedback');
      return;
    }

    try {
      await axios.post(`/api/feedback/${feedbackId}/upvote/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });
      
      // Update the feedback in state
      setFeedback(prevFeedback => 
        prevFeedback.map(item => 
          item.id === feedbackId 
            ? { 
                ...item, 
                upvote_count: item.upvote_count + 1,
                is_upvoted: true 
              } 
            : item
        )
      );
    } catch (err) {
      console.error('Error upvoting feedback:', err);
      alert('Failed to upvote. Please try again.');
    }
  };

  const handleRemoveUpvote = async (feedbackId) => {
    try {
      await axios.post(`/api/feedback/${feedbackId}/remove_upvote/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });
      
      // Update the feedback in state
      setFeedback(prevFeedback => 
        prevFeedback.map(item => 
          item.id === feedbackId 
            ? { 
                ...item, 
                upvote_count: item.upvote_count - 1,
                is_upvoted: false 
              } 
            : item
        )
      );
    } catch (err) {
      console.error('Error removing upvote:', err);
      alert('Failed to remove upvote. Please try again.');
    }
  };

  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      await axios.patch(`/api/feedback/${feedbackId}/update_status/`, 
        { status: newStatus },
        { headers: { Authorization: `Token ${token}` }}
      );
      
      // Update the feedback in state
      setFeedback(prevFeedback => 
        prevFeedback.map(item => 
          item.id === feedbackId 
            ? { ...item, status: newStatus } 
            : item
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {board && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Link to="/boards" className="text-blue-600 hover:underline flex items-center mr-2">
              <FaChevronLeft className="mr-1" /> Back to Boards
            </Link>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{board.title}</h1>
              <p className="text-gray-600">{board.description}</p>
            </div>
            
            {isAuthenticated && (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                onClick={() => setShowCreateModal(true)}
              >
                <FaPlus className="mr-2" /> Add Feedback
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-grow">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search feedback..."
                className="border rounded-l px-4 py-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded-r"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <label className="whitespace-nowrap">
              <span className="mr-2 text-sm text-gray-600">Status:</span>
              <select 
                value={statusFilter} 
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="under_review">Under Review</option>
                <option value="implemented">Implemented</option>
                <option value="closed">Closed</option>
              </select>
            </label>

            <label className="whitespace-nowrap">
              <span className="mr-2 text-sm text-gray-600">Priority:</span>
              <select 
                value={priorityFilter} 
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </label>
            
            <label className="whitespace-nowrap">
              <span className="mr-2 text-sm text-gray-600">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="updated_at">Last Updated</option>
                <option value="created_at">Created Date</option>
                <option value="upvote_count">Upvotes</option>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
              </select>
            </label>
            
            <button 
              onClick={toggleSortOrder}
              className="border rounded px-2 py-1 text-gray-600 text-sm"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
            
            <div className="border-l pl-2 ml-2">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-2 py-1 rounded mr-1 ${viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'}`}
                title="List View"
              >
                <FaThList />
              </button>
              <button 
                onClick={() => setViewMode('kanban')}
                className={`px-2 py-1 rounded ${viewMode === 'kanban' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'}`}
                title="Kanban View"
              >
                <FaColumns />
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-2">Loading feedback...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : feedback.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No feedback found.</p>
          {isAuthenticated ? (
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowCreateModal(true)}
            >
              Be the first to add feedback
            </button>
          ) : (
            <p className="mt-2">
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link> to create feedback.
            </p>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <div className="bg-white rounded-lg shadow">
              {feedback.map(item => (
                <FeedbackItem 
                  key={item.id} 
                  feedback={item} 
                  onUpvote={handleUpvote}
                  onRemoveUpvote={handleRemoveUpvote}
                  onStatusChange={handleStatusChange}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          ) : (
            <FeedbackKanban 
              feedback={feedback}
              onUpvote={handleUpvote}
              onRemoveUpvote={handleRemoveUpvote}
              onStatusChange={handleStatusChange}
              isAuthenticated={isAuthenticated}
            />
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => setCurrentPage(curr => Math.max(curr - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded-l-md ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <FaChevronLeft />
                </button>
                
                <div className="px-4 py-2 border-t border-b bg-white">
                  Page {currentPage} of {totalPages}
                </div>
                
                <button
                  onClick={() => setCurrentPage(curr => Math.min(curr + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded-r-md ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <FaChevronRight />
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {showCreateModal && (
        <CreateFeedbackModal 
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateFeedback}
          boardId={boardId}
        />
      )}
    </div>
  );
};

export default FeedbackList;