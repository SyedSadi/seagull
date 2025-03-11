import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaComment } from 'react-icons/fa';

const VoteButtons = ({ postId, totalVotes, onVote, toggleComments,commentCount }) => {
  const [voteState, setVoteState] = useState(0); // 1 for upvoted, -1 for downvoted, 0 for none

  const handleVote = async (value) => {
    if (voteState === value) {
      return; // Prevent multiple votes
    }
    setVoteState(value);
    onVote(postId, value);
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => handleVote(1)}
        className={`p-2 rounded-lg ${voteState === 1 ? "text-orange-500" : "text-gray-500"}`}
      >
        <FaArrowUp size={20} />
      </button>
      <span className="text-lg font-semibold">{totalVotes}</span>
      <button
        onClick={() => handleVote(-1)}
        className={`p-2 rounded-lg ${voteState === -1 ? "text-blue-500" : "text-gray-500"}`}
      >
        <FaArrowDown size={20} />
      </button>
      <button
        onClick={toggleComments}
        className="p-2 text-gray-500 hover:text-gray-700 flex items-center space-x-1"
      >
        <FaComment size={20} /> <span className="text-sm">({commentCount})</span> {/* Show comment count */}

      </button>
    </div>
  );
};

export default VoteButtons;