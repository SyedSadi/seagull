import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, categoryName, totalQuestions } = location.state || {};

 //debugging
console.log("Results data:", location.state);

// Redirect if accessed directly without results
if (!results) {
  console.log("No results found, redirecting...");
  navigate('/quiz');
  return null;
}

  const { score, correct_answers, incorrect_answers, unanswered } = results;
  const percentage = ((score / totalQuestions) * 100).toFixed(2);
  
  // Determine result color based on score percentage
  let resultColorClass = 'text-red-600';
  if (percentage >= 70) {
    resultColorClass = 'text-green-600';
  } else if (percentage >= 40) {
    resultColorClass = 'text-yellow-600';
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-center">Quiz Results - {categoryName}</h2>
      </div>
      
      <div className="p-6">
        <div className="text-center mb-10">
          <h1 className={`text-6xl font-bold ${resultColorClass}`}>{percentage}%</h1>
          <p className="text-xl mt-2 text-gray-600">
            {score} out of {totalQuestions} correct
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h5 className="text-lg font-semibold text-green-600 mb-2">Correct</h5>
            <p className="text-4xl font-bold">{correct_answers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h5 className="text-lg font-semibold text-red-600 mb-2">Incorrect</h5>
            <p className="text-4xl font-bold">{incorrect_answers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h5 className="text-lg font-semibold text-yellow-600 mb-2">Unanswered</h5>
            <p className="text-4xl font-bold">{unanswered}</p>
          </div>
        </div>

        {results.questions && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-6">Review Your Answers</h3>
            <div className="space-y-4">
              {results.questions.map((q, index) => {
                const toggleQuestion = () => {
                  document.getElementById(`question-${index}`).classList.toggle('hidden');
                };

                return (
                  <div 
                    key={index} 
                    className={`border rounded-lg overflow-hidden ${
                      q.is_correct ? 'border-green-500' : 'border-red-500'
                    }`}
                  >
                    <div 
                      role="button"
                      tabIndex={0}
                      className={`px-6 py-4 flex items-center justify-between cursor-pointer ${
                        q.is_correct ? 'bg-green-50' : 'bg-red-50'
                      }`}
                      onClick={toggleQuestion}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleQuestion();
                        }
                      }}
                      aria-expanded={!document.getElementById(`question-${index}`)?.classList.contains('hidden')}
                      aria-controls={`question-${index}`}
                    >
                      <h4 className="font-medium">
                        Question {index + 1}: {q.text.length > 50 ? `${q.text.substring(0, 50)}...` : q.text}
                      </h4>
                      <span className={q.is_correct ? 'text-green-600' : 'text-red-600'}>
                        {q.is_correct ? '✓' : '✗'}
                      </span>
                    </div>
                    <div 
                      id={`question-${index}`} 
                      className={q.is_correct ? 'hidden' : ''}
                      role="region"
                      aria-labelledby={`question-${index}-header`}
                    >
                      <div className="p-6 bg-white border-t">
                        <p className="mb-2"><strong>Question:</strong> {q.text}</p>
                        <p className="mb-2"><strong>Your Answer:</strong> {q.your_answer || 'Unanswered'}</p>
                        {!q.is_correct && <p className="mb-2"><strong>Correct Answer:</strong> {q.correct_answer}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-6 py-4 flex justify-between">
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md" 
          onClick={() => navigate('/')}
        >
          Back to Categories
        </button>
        <button 
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md" 
          onClick={() => navigate(`/quiz/${results.category_id}`)}
        >
          Retry Quiz
        </button>
      </div>
    </div>
  );
}

export default Result;
