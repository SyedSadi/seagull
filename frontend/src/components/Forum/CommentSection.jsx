import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import { replyToComment } from '../../services/forumApi';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';  // Import react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Import default styles

const CommentSection = ({ postId, comments =[], setComments }) => {
  const [nestedComments, setNestedComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setNestedComments(comments.filter(comment => comment.post === postId));
  }, [comments, postId]);

  
  const extractErrorMessage = (error) => {
    const data = error.response?.data;
  
    if (Array.isArray(data)) {
      return data[0]; // like ["Your content violates our community guidelines."]
    } else if (typeof data === 'object' && data !== null) {
      return Object.values(data).flat()[0]; // Handles {'content': ['msg']}
    } else if (typeof data === 'string') {
      return data;
    }
    
    return error.message || 'An unknown error occurred.';
  };
  const token = localStorage.getItem('access_token');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCommentText = e.target.comment.value;
    setIsSubmitting(true); // Start loading state

    
    try {
      const newComment = await replyToComment({
        post: postId,
        content: newCommentText,
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(prev => [...prev, newComment]);
      e.target.reset();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage, { autoClose: 5000 });
    }
     finally{
      setIsSubmitting(false); // Stop loading state
     }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea 
          name="comment" 
          className="w-full p-2 border rounded-lg" 
          placeholder="Write a comment..." 
          rows="3" 
        />
          <button 
          type="submit" 
          className={`mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {nestedComments.map(comment => (
        <Comment 
          key={comment.id} 
          comment={comment} 
          postId={postId} 
          setComments={setComments}
        />
      ))}
    </div>
  );
};
CommentSection.propTypes = {
  postId: PropTypes.number.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      post: PropTypes.number.isRequired,
      author: PropTypes.number,
      user: PropTypes.string,
      created_at: PropTypes.string,
      children: PropTypes.arrayOf(PropTypes.object),
    })
  ).isRequired,
  setComments: PropTypes.func.isRequired,
};



export default CommentSection;
