import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RateCourse = ({ courseId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/courses/${courseId}/rate/`)
      .then(response => {
        console.log(response);
        const existingRating = response.data.rating;
        if (existingRating) {
          setRating(existingRating);
        }
      })
      .catch(err => {
        toast.error(err.response?.data?.error || "Error fetching rating");
      });
  }, [courseId]);

  const handleRating = async (rate) => {
    setLoading(true);
    try {
      await API.post(`/courses/${courseId}/rate/`, { rating: rate });
      setRating(rate)
      toast.success('Rating submitted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit rating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 my-6 p-2 bg-white rounded-xl shadow-md w-1/3 mx-auto">
        <h3 className="text-2xl font-semibold text-gray-800">Rate this course</h3>
        <div className="flex space-x-2">
            {[...Array(5)].map((_, index) => {
            index += 1;
            return (
                <button
                key={index}
                type="button"
                disabled={loading}
                onClick={() => handleRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(0)}
                className={`text-4xl transition-transform transform hover:scale-125 ${
                    index <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                >
                ★
                </button>
            );
            })}
        </div>
        {loading && <p className="text-sm text-gray-500">Submitting your rating...</p>}
    </div>

  );
};

export default RateCourse;
