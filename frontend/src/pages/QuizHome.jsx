import React from 'react';
import Category from "../components/Quiz/Category"

const QuizHome = () => {
    return (
            <div className="text-center">
                <div className="container mx-auto py-8 px-4">
                    <h1 className="text-3xl font-bold text-center mb-8">KUETx Quizzes</h1>
                    <p className="text-lg font_bold text-center">Test your skills with KUETxs' Quizzes.</p>
                </div>
                <Category />
            </div>
    );
};

export default QuizHome;