import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaComment } from 'react-icons/fa';
import { fetchUserVotes, postVote } from '../../services/forumApi';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify'; // Correct import
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const VoteButtons = ({ postId, totalVotes = 0, onVote, toggleComments }) => {
  const [voteState, setVoteState] = useState(0); // 1 for upvote, -1 for downvote, 0 for no vote
  const [voteCount, setVoteCount] = useState(totalVotes);
  const [isVoting, setIsVoting] = useState(false); // Track voting in progress
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  useEffect(() => {
    setVoteCount(totalVotes);
  }, [totalVotes]);

  // Fetch user's previous vote state
  useEffect(() => {
    const fetchUserVote = async () => {
      if (!token) return;

      try {
        const data = await fetchUserVotes(postId, token);
        setVoteState(data.user_vote);
      } catch (error) {
        console.error('Error fetching user vote:', error.response ? error.response.data : error.message);
      }
    };

    fetchUserVote();
  }, [postId, token]);

  // Handle voting
  const handleVote = async (value) => {
    if (isVoting) return; // Prevent multiple votes

    if (!token) {
      toast.error('You must be logged in to vote!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      navigate('/login');
      return;
    }

    setIsVoting(true); // Start loading
    try {
      const data = await postVote(postId, value, token);
      setVoteState(data.user_vote);
      setVoteCount(data.total_votes);
      onVote(postId, data.total_votes);
    } catch (error) {
      console.error('Error voting:', error.response ? error.response.data : error.message);
      toast.error('Failed to submit vote. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsVoting(false); // Stop loading
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {isVoting ? (
        <div className="p-2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <button
            onClick={() => handleVote(1)}
            className={`p-2 rounded-lg ${voteState === 1 ? 'text-orange-500' : 'text-gray-500'}`}
            disabled={isVoting} // Disable button during voting
          >
            <FaArrowUp size={20} />
          </button>
          <span className="text-lg font-semibold">{voteCount}</span>
          <button
            onClick={() => handleVote(-1)}
            className={`p-2 rounded-lg ${voteState === -1 ? 'text-blue-500' : 'text-gray-500'}`}
            disabled={isVoting} // Disable button during voting
          >
            <FaArrowDown size={20} />
          </button>
        </>
      )}
      <button
        onClick={toggleComments}
        className="p-2 text-gray-500 hover:text-gray-700 flex items-center"
      >
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