import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import API from '../../services/api';

const CommentSection = ({ postId, comments, setComments }) => {
  const [nestedComments, setNestedComments] = useState([]);

  useEffect(() => {
    setNestedComments(comments.filter(comment => comment.post === postId));
  }, [comments, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCommentText = e.target.comment.value;
    
    try {
      const response = await API.post('/forum/comments/', {
        post: postId,
        content: newCommentText,
      });
      setComments(prev => [...prev, response.data]);
      e.target.reset();
    } catch (error) {
      console.error('❌ Error submitting comment:', error);
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
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Post Comment
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

export default CommentSection;
