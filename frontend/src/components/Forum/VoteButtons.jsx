import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaComment } from 'react-icons/fa';
import { fetchUserVotes, postVote } from '../../services/forumApi';
import PropTypes from 'prop-types';


const VoteButtons = ({ postId, totalVotes =0 , onVote, toggleComments }) => {
  const [voteState, setVoteState] = useState(0); // 1 for upvote, -1 for downvote, 0 for no vote
  const [voteCount, setVoteCount] = useState(totalVotes);
  
  
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    setVoteCount(totalVotes);
  }, [totalVotes]);

  // ✅ Fetch user's previous vote state
  useEffect(() => {
    const fetchUserVote = async () => {
      if (!token) return;
  
      try {
        const data = await fetchUserVotes(postId, token);
        setVoteState(data.user_vote); // Corrected to match API response
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
      const data = await postVote(postId, value, token);
      setVoteState(data.user_vote); // Update vote state correctly
      setVoteCount(data.total_votes); // Update total votes correctly
      onVote(postId, data.total_votes); // Update parent state
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
        <FaComment size={20} className="mr-1" /> 
      </button>
    </div>
  );
};

VoteButtons.propTypes = {
  postId: PropTypes.number.isRequired,
  totalVotes: PropTypes.number,
  onVote: PropTypes.func.isRequired,
  toggleComments: PropTypes.func.isRequired,
};



export default VoteButtons;
