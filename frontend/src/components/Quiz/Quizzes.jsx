import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizQuestions, submitQuiz } from '../../services/api'; // Import from your new API file

function Quizzes() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    // Fetch questions for the selected category
    getQuizQuestions(categoryId)
      .then(data => {
        setQuestions(data.questions);
        setCategoryName(data.category_name);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load quiz questions. Please try again later.');
        setLoading(false);
        console.error('Error fetching questions:', err);
      });
  }, [categoryId]);

  // Timer countdown
  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleQuizComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizComplete = () => {
    // Submit answers to backend and navigate to results
    submitQuiz({
      category_id: categoryId,
      answers: selectedAnswers
    })
      .then(data => {
        navigate('/results', { 
          state: { 
            results: data,
            categoryName: categoryName,
            totalQuestions: questions.length
          } 
        });
      })
      .catch(err => {
        console.error('Error submitting quiz:', err);
        setError('Failed to submit quiz. Please try again.');
      });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center my-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">Loading quiz...</p>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-6" role="alert">
      <span className="block sm:inline">{error}</span>
    </div>
  );
  
  if (questions.length === 0) return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative my-6" role="alert">
      <span className="block sm:inline">No questions available for this category.</span>
    </div>
  );

  // Format timer
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b p-6">
        <h2 className="text-2xl font-bold mb-4">{categoryName} Quiz</h2>
        <div className="flex justify-between items-center">
          <div className="text-red-600 font-bold">
            Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
          <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-medium mb-6">{questions[currentQuestion].text}</h3>
        <div className="space-y-3">
          {questions[currentQuestion].options.map(option => (
            <button 
              key={option.id} 
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                selectedAnswers[questions[currentQuestion].id] === option.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
              onClick={() => handleAnswerSelect(questions[currentQuestion].id, option.id)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 flex justify-between">
        <button 
          className={`px-4 py-2 rounded-md ${
            currentQuestion === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
          onClick={handlePrev} 
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        
        {currentQuestion < questions.length - 1 ? (
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleNext}
          >
            Next
          </button>
        ) : (
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            onClick={handleQuizComplete}
          >
            Finish Quiz
          </button>
        )}
      </div>
    </div>
  );
}

export default Quizzes;