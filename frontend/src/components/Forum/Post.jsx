import React, { useState } from 'react';
import { formatDistanceToNow } from "date-fns";
import VoteButtons from './VoteButtons';
import CommentSection from './CommentSection';
import API from '../../services/api';
import EditPostModal from './EditPostModal';
import PropTypes from 'prop-types';


const Post = ({ post, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedPost, setUpdatedPost] = useState(post);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);


  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const userId = user ? user.id : null;
  const token = localStorage.getItem('access_token');

  const isAuthor = Number(post.author) === Number(userId);

  const toggleExpand = () => setIsExpanded(!isExpanded);
 
  const fetchComments = async () => {
    setComments([]);  // Clear previous comments before fetching new ones
    setLoadingComments(true);
    try {
      const response = await API.get(`/forum/comments/?post=${post.id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };
  
  const toggleComments = () => {
    if (!showComments) fetchComments();
    setShowComments(!showComments);
  };
  
  const openEditModal = () => setIsEditing(true);
  const closeEditModal = () => setIsEditing(false);
  const refreshPost = (newPostData) => setUpdatedPost(newPostData);

  const handleVoteUpdate = (postId, newVoteCount) => {
    if (postId === updatedPost.id) {
      setUpdatedPost({ ...updatedPost, total_votes: newVoteCount });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await API.delete(`/forum/posts/${post.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onDelete(post.id); // Removes post without full page refresh
      } catch (error) {
        console.error('Error deleting post:', error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200 hover:shadow-lg transition duration-300">
    {/* Author & Timestamp */}
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-700">{updatedPost.author_name}</span> •{" "}
        <span>{formatDistanceToNow(new Date(updatedPost.created_at), { addSuffix: true })}</span>
      </p>
    </div>

    {/* Post Title */}
    <h2 className="text-xl font-semibold text-gray-900 mb-3">{updatedPost.title}</h2>

    {/* Post Content */}
    <div className="mb-4 text-gray-700 leading-relaxed">
  {isExpanded ? updatedPost.content : `${updatedPost.content.slice(0, 250)}...`}
  {updatedPost.content.length > 250 && (
    <button 
      onClick={toggleExpand} 
      className="text-blue-600 font-medium text-sm ml-2 hover:underline hover:text-blue-800 transition"
    >
      {isExpanded ? "See Less" : "See More"}
    </button>
  )}
</div>

    {/* Tags */}
    <div className="flex flex-wrap gap-2 mt-4">
      {updatedPost.tags?.map((tag) => (
        <button type="button"
          key={tag.id}
          className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-300 transition"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("tagClicked", { detail: tag.name }))
          }
        >
          #{tag.name}
        </button>
      ))}
    </div>

    {/* Voting & Comments Section */}
    <div className="flex items-center justify-between mt-4 border-t pt-3">
      <VoteButtons
        postId={post.id}
        totalVotes={updatedPost.total_votes}
        onVote={handleVoteUpdate}
        toggleComments={toggleComments}
        commentCount={updatedPost.comments?.length || 0}
      />

      {/* Edit & Delete Buttons (Only for Author) */}
      {isAuthor && (
        <div className="flex gap-4">
          <button onClick={openEditModal} className="text-blue-600 hover:underline font-medium">
            Edit
          </button>
          <button onClick={handleDelete} className="text-red-600 hover:underline font-medium">
            Delete
          </button>
        </div>
      )}
    </div>

    {/* Comments Section */}
    {showComments &&
      (loadingComments ? (
        <p className="text-gray-500 mt-2">Loading comments...</p>
      ) : (
        <CommentSection postId={post.id} comments={comments} setComments={setComments} />
      ))}

    {/* Edit Modal */}
    {isEditing && (
      <EditPostModal post={updatedPost} onClose={closeEditModal} refreshPost={refreshPost} />
    )}
  </div>
);
};



Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    author_name: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    total_votes: PropTypes.number.isRequired,
    comments: PropTypes.arrayOf(PropTypes.object),
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};



export default Post;
