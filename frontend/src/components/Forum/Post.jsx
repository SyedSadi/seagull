import React, { useState } from 'react';
import { formatDistanceToNow } from "date-fns";
import VoteButtons from './VoteButtons';
import CommentSection from './CommentSection';
import API from '../../services/api';
import EditPostModal from './EditPostModal';

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
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200">
      {/* Post Title */}
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{updatedPost.title}</h2>

      {/* Author & Timestamp */}
      <p className="text-gray-500 text-sm mb-4">
        Posted by <span className="font-semibold">{updatedPost.author_name}</span> •{" "}
        {formatDistanceToNow(new Date(updatedPost.created_at), { addSuffix: true })}
      </p>

      {/* Post Content */}
      <div className="mb-4 text-gray-700">
        {isExpanded ? updatedPost.content : `${updatedPost.content.slice(0, 200)}...`}
        {updatedPost.content.length > 200 && !isExpanded && (
          <button onClick={toggleExpand} className="text-blue-600 ml-2 hover:underline font-medium">
            See More
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {updatedPost.tags?.map((tag) => (
         <button 
         key={tag.id} 
         className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition"
         onClick={() => window.dispatchEvent(new CustomEvent('tagClicked', { detail: tag.name }))}
    >
      {tag.name}
    </button>
  ))}
      </div>

      {/* Voting & Comments */}
      <VoteButtons 
        postId={post.id} 
        totalVotes={updatedPost.total_votes} 
        onVote={handleVoteUpdate} 
        toggleComments={toggleComments} 
        commentCount={updatedPost.comments?.length || 0} 
      />

      {/* Edit & Delete Buttons (Only for Author) */}
      {isAuthor && (
        <div className="flex gap-4 mt-4">
          <button onClick={openEditModal} className="text-blue-600 hover:underline font-medium">Edit</button>
          <button onClick={handleDelete} className="text-red-600 hover:underline font-medium">Delete</button>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        loadingComments ? (
          <p>Loading comments...</p>
     ) : (
      <CommentSection postId={post.id} comments={comments}  setComments={setComments} />
     )
   )}

      {/* Edit Modal */}
      {isEditing && <EditPostModal post={updatedPost} onClose={closeEditModal} refreshPost={refreshPost} />}
    </div>
  );
};

export default Post;
