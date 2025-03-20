import React, { useState, useEffect, useContext } from 'react';
import API from '../../services/api';
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
        const response = await API.get('/forum/tags/');
        setAllTags(response.data);
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
      const response = await API.post('/forum/posts/', payload);
      console.log('Post created:', response.data);
      refreshPosts(); // Refresh the list after posting
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error creating post:', error.response?.data);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="5"
            required
          />
          {/* Tag Selection */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Select Tags (1-3):</label>
            <select
              onChange={handleTagSelect}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            <div className="mt-2 flex flex-wrap">
              {selectedTags.map((tag) => (
                <span key={tag.id} className="bg-blue-200 text-blue-800 px-2 py-1 m-1 rounded-full flex items-center">
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag.id)}
                    className="ml-1 text-red-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
            Post
          </button>
        </form>
        <button onClick={onClose} className="mt-4 w-full text-center text-gray-600 hover:underline">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreatePostModal;