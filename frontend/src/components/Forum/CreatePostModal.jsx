import React, { useState, useEffect, useContext } from 'react';
import { fetchTag, createPost } from '../../services/forumApi'; // Import service API functions
import PropTypes from 'prop-types';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const CreatePostModal = ({ onClose, refreshPosts }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const { user } = useContext(AuthContext); // Get the authenticated user from AuthContext

  // Fetch available tags from the backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await fetchTag();
        setAllTags(tags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  const handleTagSelect = (e) => {
    const tagId = parseInt(e.target.value);
    const tag = allTags.find((t) => t.id === tagId);
    if (tag && selectedTags.length < 3 && !selectedTags.some((t) => t.id === tagId)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tagId) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTags.length < 1) {
      alert('Please select at least one tag.');
      return;
    }

    // Check if the user is authenticated
    if (!user) {
      alert('User not authenticated. Please log in.');
      return;
    }

    try {
      const payload = {
        title: title,
        content: content,
        tag_ids: selectedTags.map((t) => t.id),
        author: user.id, // Include the authenticated user's ID as the author
      };

      console.log('Payload:', payload); // Log the payload for debugging
      const response = await createPost(payload);
      console.log('Post created:', response.data);
      refreshPosts(); // Refresh the list after posting
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error creating post:', error.response?.data);
    }
  };

  return (
    
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Create a New Post</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Enter your post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
              required
            />
            <textarea
              placeholder="Write your content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
              rows="6"
              required
            />
            {/* Tag Selection */}
            <div>
              <label htmlFor="tag-select" className="block font-medium text-gray-700 mb-2">
                Select Tags (1–3):
              </label>
              <select
                id="tag-select"
                onChange={handleTagSelect}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Choose a tag...
                </option>
                {allTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
              {/* Display Selected Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span key={tag.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium text-lg"
            >
              Post
            </button>
            <button
              onClick={onClose}
              type="button"
              className="w-full text-center text-gray-500 hover:underline pt-2"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
    
    
  
};

CreatePostModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  refreshPosts: PropTypes.func.isRequired
};


export default CreatePostModal;