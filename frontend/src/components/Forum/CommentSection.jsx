import React, { useState } from 'react';
import Comment from './Comment';
import API from '../../services/api';

const CommentSection = ({ postId, comments }) => {
  const [newComment, setNewComment] = useState('');
  const [allComments, setAllComments] = useState(comments || []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/forum/comments/', {
        post: postId,
        content: newComment
      });
      setAllComments([...allComments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="font-semibold mb-4">Comments ({allComments.length})</h3>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
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

      {allComments.map(comment => (
        <Comment 
          key={comment.id} 
          comment={comment} 
          postId={postId}
          setComments={setAllComments}
        />
      ))}
    </div>
  );
};

export default CommentSection;
