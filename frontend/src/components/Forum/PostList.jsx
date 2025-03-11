import React, { useEffect, useState, useRef } from 'react';
import { FiFilter } from 'react-icons/fi'; // Import the filter icon from Feather Icons
import API from '../../services/api';
import Post from './Post';
import CreatePostModal from './CreatePostModal';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('recent'); // "recent", "highest_voted", "my_posts"
  const [searchTag, setSearchTag] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false); // State to control dropdown visibility
  const filterRef = useRef(null); // Ref for the filter dropdown

  useEffect(() => {
    fetchPosts();
  }, [filter, searchTag]);

  // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      let url = `/forum/posts/?filter=${filter}`;
      if (searchTag) url += `&tag=${searchTag}`;
      const response = await API.get(url);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Close dropdown when clicking outside
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

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Filtering & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex space-x-2 items-center">
          {/* Filter Icon and Text */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            ref={filterRef}
          >
            <FiFilter className="h-5 w-5 text-gray-600" /> {/* Filter icon */}
            <span className="text-gray-600">Filter</span>

            {/* Dropdown */}
            {showFilterDropdown && (
              <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setFilter('recent');
                      setShowFilterDropdown(false);
                    }}
                  >
                    Recent Posts
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setFilter('highest_voted');
                      setShowFilterDropdown(false);
                    }}
                  >
                    Top Voted
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setFilter('my_posts');
                      setShowFilterDropdown(false);
                    }}
                  >
                    My Posts
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Create Post Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Post
        </button>
      </div>

      {/* Post List */}
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}

      {/* Create Post Modal */}
      {showCreateModal && <CreatePostModal onClose={() => setShowCreateModal(false)} refreshPosts={fetchPosts} />}
    </div>
  );
};

export default PostList;