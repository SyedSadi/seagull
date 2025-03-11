import React, { useState } from 'react';
import API from '../../services/api';

const Comment = ({ comment, postId, setComments }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/forum/comments/', {
        post: postId,
        content: replyContent,
        parent: comment.id
      });
      setComments(prev => prev.map(c => {
        if (c.id === comment.id) {
          return { ...c, replies: [...(c.replies || []), response.data] };
        }
        return c;
      }));
      setIsReplying(false);
      setReplyContent('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const handleEdit = async () => {
    try {
      await API.put(`/forum/comments/${comment.id}/`, {
        content: editedContent
      });
      setIsEditing(false);
      setComments(prev => prev.map(c => 
        c.id === comment.id ? { ...c, content: editedContent } : c
      ));
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/forum/comments/${comment.id}/`);
      setComments(prev => prev.filter(c => c.id !== comment.id));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="ml-4 border-l-2 pl-4 mb-4">
      <div className="flex items-center text-sm text-gray-600 mb-1">
      <span className="font-medium">{comment.user || "Unknown User"}</span>

        <span className="mx-2">•</span>
        <span>{new Date(comment.created_at).toLocaleString()}</span>
      </div>
      
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full p-2 border rounded-lg mb-2"
        />
      ) : (
        <p className="text-gray-800">{comment.content}</p>
      )}
      
      <div className="flex gap-4 mt-2">
        {!isEditing && (
          <>
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Reply
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Edit
            </button>
          </>
        )}
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Delete
        </button>
        {isEditing && (
          <>
            <button
              onClick={handleEdit}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {isReplying && (
        <form onSubmit={handleReplySubmit} className="mt-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2"
            placeholder="Write a reply..."
            rows="2"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
            >
              Post Reply
            </button>
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {Array.isArray(comment.replies) && comment.replies.map(reply => (
        <Comment 
          key={reply.id} 
          comment={reply} 
          postId={postId}
          setComments={setComments}
        />
      ))}
    </div>
  );
};

export default Comment;