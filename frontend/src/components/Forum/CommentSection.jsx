import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import { replyToComment } from '../../services/forumApi';
import PropTypes from 'prop-types';

const CommentSection = ({ postId, comments =[], setComments }) => {
  const [nestedComments, setNestedComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setNestedComments(comments.filter(comment => comment.post === postId));
  }, [comments, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCommentText = e.target.comment.value;
    setIsSubmitting(true); // Start loading state

    
    try {
      const newComment = await replyToComment({
        post: postId,
        content: newCommentText,
      });
      setComments(prev => [...prev, newComment]);
      e.target.reset();
    } catch (error) {
      console.error('❌ Error submitting comment:', error);
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
