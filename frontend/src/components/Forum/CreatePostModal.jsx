import React, { useState, useEffect, useContext } from 'react';
import {createTag, fetchTag, createPost } from '../../services/forumApi'; 
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import CreatableSelect from 'react-select/creatable';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';  // <--- Add this at the top if not already

const CreatePostModal = ({ onClose, refreshPosts }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const { user } = useContext(AuthContext);

  // Fetch tags from the API
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

  // Handle tag change
  const handleTagChange = (selectedOptions) => {

    if (selectedOptions.length <= 3) {
      setSelectedTags(selectedOptions);
    } else {
      toast.warning('You can select up to 3 tags only.', { autoClose: 3000 });
    }
  };

  // Handle creating new tags
  const handleCreateTag = async (inputValue) => {
    try {
      const newTag = await createTag({ name: inputValue });
      const formattedTag = { value: newTag.id, label: newTag.name };
      setAllTags([...allTags, newTag]);
      setSelectedTags((prev) => [...prev, formattedTag]);
    } catch (error) {
      toast.error('Failed to create tag.');
      console.error(error);
    }
  };

  const navigate = useNavigate();
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit clicked');

    if (selectedTags.length < 1) {
      toast.error('Please select at least one tag.');
      return;
    }

    
  if (!user) {
    toast.error('User not authenticated. Redirecting to login...', { autoClose: 2000 });
    setTimeout(() => {
      navigate('/login');   // <-- Navigate to login page after a short delay
    }, 2000);
    return;
  }

    try {
      const payload = {
        title,
        content,
        tag_ids: selectedTags.map((t) => t.value), // Map to tag IDs
        author: user.id
      };

      await createPost(payload);  // Create the post
      console.log('Post created successfully!'); // Debugging lo
      toast.success('Post created successfully!', { autoClose: 3000 });  // Success toast
      refreshPosts();
      onClose();
    } catch (error) {
      const data = error.response?.data;

      let errorMessage = 'An unknown error occurred.';
      if (Array.isArray(data)) errorMessage = data[0];
      else if (typeof data === 'object' && data !== null) {
        errorMessage = data.error || Object.values(data)[0];
      } else {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { autoClose: 5000 });  // Error toast
      console.error('Error creating post:', data);
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '0.75rem',
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59,130,246,0.5)' : 'none',
      padding: '2px',
      fontSize: '0.875rem',
      minHeight: '42px',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      borderRadius: '9999px',
      padding: '2px 6px',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#1e40af',
      fontWeight: '500',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#1e40af',
      ':hover': {
        backgroundColor: '#bfdbfe',
        color: '#1e3a8a',
      }
    }),
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

          {/* React Select Tag Selection */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Select Tags (1–3):</label>
            <CreatableSelect
              isMulti
              options={allTags.map(tag => ({ value: tag.id, label: tag.name }))}
              value={selectedTags}
              onChange={handleTagChange}
              onCreateOption={handleCreateTag}
              placeholder="Search or create a tag..."
              styles={customStyles}
              closeMenuOnSelect={false}
            />
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
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

CreatePostModal.propTypes = {
	onClose: PropTypes.func.isRequired,
	refreshPosts: PropTypes.func.isRequired,
};

export default CreatePostModal;
