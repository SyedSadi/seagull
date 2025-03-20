import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaComment } from 'react-icons/fa';
import API from '../../services/api';

const VoteButtons = ({ postId, totalVotes, onVote, toggleComments, commentCount }) => {
  const [voteState, setVoteState] = useState(0); // 1 for upvote, -1 for downvote, 0 for no vote
  const [voteCount, setVoteCount] = useState(totalVotes);
  
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    setVoteCount(totalVotes);
  }, [totalVotes]);

  // ✅ Fetch user's previous vote state
  useEffect(() => {
    const fetchUserVote = async () => {
      if (!token) return;
  
      try {
        const response = await API.get(`/forum/votes/${postId}/user-vote/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data) {
          setVoteState(response.data.user_vote); // Corrected to match API response
        }
      } catch (error) {
        console.error('Error fetching user vote:', error.response ? error.response.data : error.message);
      }
    };
  
    fetchUserVote();
  }, [postId, token]);
  

  // ✅ Handle voting
  const handleVote = async (value) => {
    if (!token) {
      alert('You must be logged in to vote.');
      return;
    }
  
    try {
      const response = await API.post(`/forum/votes/`, { post: postId, value }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const { total_votes, user_vote } = response.data; // Read backend response
  
      setVoteState(user_vote); // Update vote state correctly
      setVoteCount(total_votes); // Update total votes correctly
      onVote(postId, total_votes); // Update parent state
    } catch (error) {
      console.error('Error voting:', error.response ? error.response.data : error.message);
    }
  };
  
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => handleVote(1)}
        className={`p-2 rounded-lg ${voteState === 1 ? "text-orange-500" : "text-gray-500"}`}
      >
        <FaArrowUp size={20} />
      </button>
      <span className="text-lg font-semibold">{voteCount}</span>
      <button
        onClick={() => handleVote(-1)}
        className={`p-2 rounded-lg ${voteState === -1 ? "text-blue-500" : "text-gray-500"}`}
      >
        <FaArrowDown size={20} />
      </button>
      <button onClick={toggleComments} className="p-2 text-gray-500 hover:text-gray-700 flex items-center">
        <FaComment size={20} className="mr-1" /> {commentCount}
      </button>
    </div>
  );
};

export default VoteButtons;
