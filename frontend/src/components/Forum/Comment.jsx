import React, { useState } from 'react';
import { replyToComment, updateComment, deleteComment } from '../../services/forumApi';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Comment = ({ comment = {}, postId, setComments }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [isDeletingLoading, setIsDeletingLoading] = useState(false);
  const [isReplyingLoading, setIsReplyingLoading] = useState(false);
  // Add state for toggling "See More/See Less"
  const [isExpanded, setIsExpanded] = useState(false);

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const userId = user ? user.id : null;
  const isOwner = comment.author === Number(userId);
  const token = localStorage.getItem('access_token');

  const CHARACTER_LIMIT = 170; // Set character limit for truncation

  const extractErrorMessage = (error) => {
    const data = error.response?.data;
    if (Array.isArray(data)) return data[0];
    else if (typeof data === 'object' && data !== null) return Object.values(data).flat()[0];
    else if (typeof data === 'string') return data;
    return error.message || 'An unknown error occurred.';
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setIsReplyingLoading(true);
    try {
      const newReply = await replyToComment(
        {
          post: postId,
          content: replyContent,
          parent_id: comment.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prevComments) => insertReply(prevComments, comment.id, newReply));
      setIsReplying(false);
      setReplyContent('');
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage, { autoClose: 5000 });
    } finally {
      setIsReplyingLoading(false);
    }
  };

  const insertReply = (comments, parentId, newReply) => {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, children: [...(comment.children || []), newReply] };
      }
      return { ...comment, children: insertReply(comment.children || [], parentId, newReply) };
    });
  };

  const handleEdit = async () => {
    setIsEditingLoading(true);
    try {
      await updateComment(
        comment.id,
        { content: editedContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prevComments) => updateCommentInTree(prevComments, comment.id, editedContent));
      setIsEditing(false);
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage, { autoClose: 5000 });
    } finally {
      setIsEditingLoading(false);
    }
  };

  const updateCommentInTree = (comments, commentId, newContent) => {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, content: newContent };
      }
      return { ...comment, children: updateCommentInTree(comment.children || [], commentId, newContent) };
    });
  };

  const handleDelete = async () => {
    setIsDeletingLoading(true);
    try {
      await deleteComment(comment.id, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prevComments) => removeCommentFromTree(prevComments, comment.id));
    } catch (error) {
      console.error('❌ Error deleting comment:', error.response?.data || error.message);
    } finally {
      setIsDeletingLoading(false);
    }
  };

  const removeCommentFromTree = (comments, commentId) => {
    return comments
      .filter((comment) => comment.id !== commentId)
      .map((comment) => ({
        ...comment,
        children: removeCommentFromTree(comment.children || [], commentId),
      }));
  };

  // Determine if the comment should be truncated
  const shouldTruncate = comment.content.length > CHARACTER_LIMIT;
  const truncatedContent = shouldTruncate
    ? `${comment.content.substring(0, CHARACTER_LIMIT)}...`
    : comment.content;

  return (
    <div className="ml-4 border-l-2 pl-4 mb-4">
      <div className="flex items-center text-sm text-gray-600 mb-1">
        <span className="font-medium text-teal-600 hover:text-teal-700">
          {comment.user || 'Unknown User'}
        </span>
        <span className="mx-2">•</span>
        <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
      </div>

      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full p-2 border rounded-lg mb-2"
        />
      ) : (
        <div>
          <p className="text-gray-800">
            {isExpanded || !shouldTruncate ? comment.content : truncatedContent}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-800 text-sm mt-1"
            >
              {isExpanded ? 'See Less' : 'See More'}
            </button>
          )}
        </div>
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

            {isOwner && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Edit
                </button>
                {isDeletingLoading ? (
                  <div className="spinner w-5 h-5 border-t-2 border-red-600 border-solid rounded-full animate-spin"></div>
                ) : (
                  <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </>
        )}

        {isEditing && (
          <>
            {isEditingLoading ? (
              <div className="spinner w-5 h-5 border-t-2 border-green-600 border-solid rounded-full animate-spin"></div>
            ) : (
              <button
                onClick={handleEdit}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                Save
              </button>
            )}
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:text-gray-800 text-sm"
              disabled={isEditingLoading}
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
            disabled={isReplyingLoading}
          />
          <div className="flex gap-2">
            {isReplyingLoading ? (
              <div className="spinner w-5 h-5 border-t-2 border-blue-600 border-solid rounded-full animate-spin"></div>
            ) : (
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
              >
                Post Reply
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-300"
              disabled={isReplyingLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {Array.isArray(comment.children) &&
        comment.children.map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
            postId={postId}
            setComments={setComments}
          />
        ))}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.number.isRequired,
    user: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        content: PropTypes.string,
        author: PropTypes.number,
        user: PropTypes.string,
        created_at: PropTypes.string,
      })
    ),
  }).isRequired,
  postId: PropTypes.number.isRequired,
  setComments: PropTypes.func.isRequired,
};

export default Comment;