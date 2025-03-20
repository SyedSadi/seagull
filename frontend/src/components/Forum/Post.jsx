import React, { useState } from 'react';
import VoteButtons from './VoteButtons';
import CommentSection from './CommentSection';
import API from '../../services/api';
import EditPostModal from './EditPostModal';

const Post = ({ post, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedPost, setUpdatedPost] = useState(post);

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const userId = user ? user.id : null;
  const token = localStorage.getItem('access_token');

  const isAuthor = Number(post.author) === Number(userId);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleComments = () => setShowComments(!showComments);
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
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{updatedPost.title}</h2>
      <p className="text-gray-500 text-sm mb-4">
        Posted by <span className="font-semibold">{updatedPost.author_name}</span> • {new Date(updatedPost.created_at).toLocaleDateString()}
      </p>

      <div className="mb-4 text-gray-700">
        {isExpanded ? updatedPost.content : `${updatedPost.content.slice(0, 200)}...`}
        {updatedPost.content.length > 200 && !isExpanded && (
          <button onClick={toggleExpand} className="text-blue-600 ml-2 hover:underline font-medium">
            See More
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {updatedPost.tags?.map((tag) => (
          <span key={tag.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {tag.name}
          </span>
        ))}
      </div>

      <VoteButtons 
        postId={post.id} 
        totalVotes={updatedPost.total_votes} 
        onVote={handleVoteUpdate} 
        toggleComments={toggleComments} 
        commentCount={updatedPost.comments?.length || 0} 
      />

      {isAuthor && (
        <div className="flex gap-4 mt-4">
          <button onClick={openEditModal} className="text-blue-600 hover:underline font-medium">Edit</button>
          <button onClick={handleDelete} className="text-red-600 hover:underline font-medium">Delete</button>
        </div>
      )}

      {showComments && <CommentSection postId={post.id} comments={updatedPost.comments} />}

      {isEditing && <EditPostModal post={updatedPost} onClose={closeEditModal} refreshPost={refreshPost} />}
    </div>
  );
};

export default Post;
