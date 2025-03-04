import React, { useState } from 'react';
import VoteButtons from './VoteButtons';
import CommentSection from './CommentSection';

const Post = ({ post, onVote }) => {
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleComments = () => setShowComments(!showComments);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
      <h2 className="text-xl font-bold">{post.title}</h2>
      <p className="text-gray-600 text-sm">Posted by {post.author_name} • {new Date(post.created_at).toLocaleDateString()}</p>
      
      <div className="my-4">
        {isExpanded ? post.content : `${post.content.slice(0, 200)}...`}
        {post.content.length > 200 && !isExpanded && (
          <button onClick={toggleExpand} className="text-blue-600 hover:underline ml-2">
            See More
          </button>
        )}
      </div>

      <VoteButtons 
        postId={post.id} 
        totalVotes={post.total_votes} 
        onVote={onVote}
        toggleComments={toggleComments}
      />

      {showComments && <CommentSection postId={post.id} comments={post.comments} />}
    </div>
  );
};

export default Post;
