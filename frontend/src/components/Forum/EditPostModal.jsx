import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';
import {createTag, getTags, updatePost } from '../../services/forumApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditPostModal = ({ post, onClose, refreshPost }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(post.tags || []);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getTags();
        setAllTags(data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  const handleSave = async () => {
    if (selectedTags.length === 0) {
      toast.error("Please select at least one tag.");
      return;
    }

    try {
      const updatedPost = await updatePost(post.id, {
        title,
        content,
        tag_ids: selectedTags.map(tag => tag.id)
      }, token);

      toast.success("Post updated successfully!");
      refreshPost(updatedPost);
      onClose();
    } catch (error) {
      const data = error.response?.data;
      let errorMessage;

      if (Array.isArray(data)) {
        errorMessage = data[0];
      } else if (typeof data === 'object' && data !== null) {
        errorMessage = data.error || Object.values(data)[0];
      } else {
        errorMessage = error.message || 'An unknown error occurred.';
      }

      toast.error(errorMessage, { autoClose: 5000 });
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
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Edit Post</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
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

          {/* React Select for Tags */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Select Tags (max 3):</label>
            <CreatableSelect
                options={allTags.map(tag => ({ value: tag.id, label: tag.name }))}
                value={selectedTags.map(tag => ({ value: tag.id, label: tag.name }))}
                onChange={(selected) => {
                  const limited = selected.slice(0, 3);
                  setSelectedTags(limited.map(sel => ({
                    id: sel.value,
                    name: sel.label
                  })));
                }}
                onCreateOption={async (inputValue) => {
                  try {
                    const newTag = await createTag({ name: inputValue }, token); // make sure your API matches
                    const newTagObj = { id: newTag.id, name: newTag.name };

                    setAllTags(prev => [...prev, newTagObj]);

                    setSelectedTags(prev => {
                      const updated = [...prev, newTagObj].slice(0, 3);
                      return updated;
                    });

                    // toast.success(`Tag "${newTag.name}" created`);
                  } catch (error) {
                    toast.error('Failed to create tag');
                    console.error('Create tag error:', error);
                  }
                }}
                isMulti
                styles={customStyles}
                placeholder="Choose up to 3 tags..."
                closeMenuOnSelect={false}
                className="text-sm"
              />

          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium text-lg"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            type="button"
            className="w-full text-center text-gray-500 hover:underline pt-2"
          >
            Cancel
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

EditPostModal.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
      })
    )
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  refreshPost: PropTypes.func.isRequired
};

export default EditPostModal;
