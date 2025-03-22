import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FiFilter } from 'react-icons/fi';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaSearch, FaTimes } from 'react-icons/fa';
import API from '../../services/api';
import Post from './Post';
import CreatePostModal from './CreatePostModal';
import { debounce } from 'lodash'; // Import debounce function

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('recent'); // Default filter
  const [searchTag, setSearchTag] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterRef = useRef(null);
  


  
  // Optimized fetchPosts function using useCallback
  const fetchPosts = useCallback(async () => {
    try {
      let url = `/forum/posts/?filter=${filter}`;
      if (searchTag.trim() !== '') url += `&tag=${searchTag.trim()}`;
      const response = await API.get(url);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [filter, searchTag]);

  // Debounced search to avoid excessive API calls
  const debouncedFetchPosts = useCallback(debounce(fetchPosts, 500), [fetchPosts]);

  useEffect(() => {
    debouncedFetchPosts();
    return () => debouncedFetchPosts.cancel(); // Cleanup to avoid memory leaks
  }, [filter, searchTag, debouncedFetchPosts]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setShowFilterDropdown(false); // Close dropdown after selection
  };

  const handlePostDelete = (deletedPostId) => {
    setPosts((prevPosts) => prevPosts.filter(post => post.id !== deletedPostId));
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Search & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 space-y-4 sm:space-y-0">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-2/3">
          <input
            type="text"
            placeholder="Search posts by tag..."
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          {searchTag && (
            <button 
              onClick={() => setSearchTag('')} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Icons: Filter & Create */}
        <div className="flex items-center gap-4">
          {/* Filter Button */}
          <div className="relative" ref={filterRef}>
            <button
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <FiFilter className="text-gray-600" />
              <span className="text-gray-600">Filter</span>
            </button>
            
            {/* Dropdown */}
            {showFilterDropdown && (
  <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
    <ul className="py-2">
      <li>
        <button
          className={`w-full text-left px-4 py-2 ${filter === 'recent' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          onClick={() => handleFilterChange('recent')}
        >
          Recent Posts
        </button>
      </li>
      <li>
        <button
          className={`w-full text-left px-4 py-2 ${filter === 'highest_voted' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          onClick={() => handleFilterChange('highest_voted')}
        >
          Top Voted
        </button>
      </li>
      <li>
        <button
          className={`w-full text-left px-4 py-2 ${filter === 'user_posts' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          onClick={() => handleFilterChange('user_posts')}
        >
          My Posts
        </button>
      </li>
    </ul>
  </div>
)}

          </div>

          {/* Create Post Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <AiOutlineEdit className="mr-2" />
            Create
          </button>
        </div>
      </div>

      {/* Post List */}
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center mt-6">No posts found.</p>
      ) : (
        posts.map((post) => <Post key={post.id} post={post} onDelete={handlePostDelete} />)
      )}

      {/* Create Post Modal */}
      {showCreateModal && <CreatePostModal onClose={() => setShowCreateModal(false)} refreshPosts={fetchPosts} />}
    </div>
  );
};

export default PostList;
