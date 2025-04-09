import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const RateCourse = ({ courseId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const { data } = await API.get(`/courses/${courseId}/rate/`);
        if (data.rating) setRating(data.rating);
      } catch (err) {
        toast.error(err.response?.data?.error || "Error fetching rating");
      }
    };
    fetchRating();
  }, [courseId]);

  const submitRating = async (rate) => {
    setLoading(true);
    try {
      await API.post(`/courses/${courseId}/rate/`, { rating: rate });
      setRating(rate);
      toast.success('Rating submitted successfully!');
    } catch {
      toast.error('Failed to submit rating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 my-6 p-4 bg-white rounded-xl shadow-md w-80 mx-auto">
      <h3 className="text-2xl font-semibold text-gray-800">Rate this course</h3>
      <div className="flex space-x-2">
        {[...Array(5)].map((_, index) => {
          const star = index + 1;
          return (
            <button
              key={star}
              disabled={loading}
              onClick={() => submitRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className={`text-4xl transition-transform transform hover:scale-125 ${
                star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          );
        })}
      </div>
      {loading && <p className="text-sm text-gray-500">Submitting...</p>}
    </div>
  );
};

RateCourse.propTypes = {
  courseId: PropTypes.string.isRequired, // or PropTypes.number if courseId is a number
}

export default RateCourse;
