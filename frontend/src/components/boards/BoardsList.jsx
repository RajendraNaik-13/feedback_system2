import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import BoardCard from './BoardCard';
import CreateBoardModal from './CreateBoardModel';
axios.get('/boards/')
  .then(response => console.log('Success:', response))
  .catch(error => console.error('Error details:', error.response));
const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, public, private
  const [sortBy, setSortBy] = useState('updated_at'); // updated_at, created_at, title
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  useEffect(() => {
    fetchBoards();
  }, [filter, sortBy, sortOrder]);

  const fetchBoards = async () => {
    setLoading(true);
    try {
      let url = `/boards/?ordering=${sortOrder === 'desc' ? '-' : ''}${sortBy}`;
      

      const config = isAuthenticated ? {
        headers: { Authorization: `Token ${token}` }
      } : {};
      
      const response = await axios.get(url, config);
      console.log(response)
      setBoards(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch boards. Please try again later.');
      console.error('Error fetching boards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (boardData) => {
    try {
      const response = await axios.post('boards/', boardData, {
        headers: { Authorization: `Token ${token}` }
      });
      setBoards([response.data, ...boards]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating board:', err);
      alert('Failed to create board. Please try again.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchBoards();
      return;
    }

    setLoading(true);
    const config = isAuthenticated ? {
      headers: { Authorization: `Token ${token}` }
    } : {};

    axios.get(`boards/?search=${searchTerm}`, config)
      .then(response => {
        setBoards(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error searching boards:', err);
        setError('Failed to search boards. Please try again.');
        setLoading(false);
      });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredBoards = boards.filter(board => {
    if (!isAuthenticated && !board.is_public) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feedback Boards</h1>
        {isAuthenticated && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus className="mr-2" /> Create Board
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-grow">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search boards..."
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
          
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap">
              <span className="mr-2"><FaFilter className="inline" /> Filter:</span>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded px-2 py-2"
              >
                <option value="all">All Boards</option>
                <option value="public">Public Only</option>
                {isAuthenticated && <option value="private">Private Only</option>}
              </select>
            </label>

            <label className="whitespace-nowrap">
              <span className="mr-2"><FaSort className="inline" /> Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-2 py-2"
              >
                <option value="updated_at">Last Updated</option>
                <option value="created_at">Created Date</option>
                <option value="title">Title</option>
              </select>
            </label>
            
            <button 
              onClick={toggleSortOrder}
              className="border rounded px-3 py-2 text-gray-600"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-2">Loading boards...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : filteredBoards.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No boards found.</p>
          {!isAuthenticated && (
            <p className="mt-2">
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link> to see private boards or create your own.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoards.map(board => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateBoardModal 
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateBoard}
        />
      )}
    </div>
  );
};

export default BoardList;