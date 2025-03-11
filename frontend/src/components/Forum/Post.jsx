import React, { useState } from 'react';
import VoteButtons from './VoteButtons';
import CommentSection from './CommentSection';
import API from '../../services/api';

const Post = ({ post, onVote }) => {
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const userId = localStorage.getItem('user_id'); // Assumes you store user_id upon login
  const isAuthor = post.author === Number(userId);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleComments = () => setShowComments(!showComments);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await API.delete(`/forum/posts/${post.id}/`);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-500 text-sm mb-4">
        Posted by {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div className="mb-4">
        {isExpanded ? post.content : `${post.content.slice(0, 200)}...`}
        {post.content.length > 200 && !isExpanded && (
          <button onClick={toggleExpand} className="text-blue-600 ml-2 hover:underline">
            See More
          </button>
        )}
      </div>

       {/* Display Tags */}
       <div className="flex flex-wrap gap-2 mb-4">
        {post.tags?.map((tag) => (
          <span key={tag.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {tag.name}
          </span>
        ))}
      </div>

      <VoteButtons postId={post.id} totalVotes={post.total_votes} onVote={onVote} toggleComments={toggleComments} commentCount={post.comments?.length || 0}  />

      {isAuthor && (
        <div className="flex gap-4 mt-4">
          <button className="text-blue-600 hover:underline">Edit</button>
          <button onClick={handleDelete} className="text-red-600 hover:underline">Delete</button>
        </div>
      )}

      {showComments && <CommentSection postId={post.id} comments={post.comments} />}
    </div>
  );
};

export default Post;
