import { useState, useEffect } from "react";
import { getAllQuizAttempts } from "../../services/quizApi";
import { FaTrophy, FaClock } from "react-icons/fa";

const QuizResults = () => {
	const [attempts, setAttempts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchQuizAttempts = async () => {
			try {
				const response = await getAllQuizAttempts();
				setAttempts(response.data);
			} catch (error) {
				console.error("Error fetching quiz attempts:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchQuizAttempts();
	}, []);

	if (loading) {
		return <p className="text-center text-gray-500">Loading quiz results...</p>;
	}

	if (attempts.length === 0) {
		return (
			<p className="text-center text-gray-500">
				You haven&apos;t attempted any quizzes yet.
			</p>
		);
	}

	return (
		<div className="space-y-4">
			{attempts.map((attempt) => (
				<div
					key={attempt.id}
					className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
				>
					<div className="flex justify-between items-start">
						<div>
							<h3 className="text-lg font-semibold text-gray-800">
								{attempt.category_name}
							</h3>
							<div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
								<FaClock />
								<span>
									{new Date(attempt.completed_at).toLocaleDateString()}
								</span>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<FaTrophy className="text-yellow-500" />
							<span className="text-lg font-bold">
								{Math.round((attempt.score / attempt.total_questions) * 100)}%
							</span>
						</div>
					</div>
					<div className="mt-4 grid grid-cols-3 gap-4 text-center">
						<div className="bg-green-50 p-2 rounded">
							<p className="text-sm text-gray-600">Correct</p>
							<p className="text-lg font-semibold text-green-600">
								{attempt.correct_answers}
							</p>
						</div>
						<div className="bg-red-50 p-2 rounded">
							<p className="text-sm text-gray-600">Incorrect</p>
							<p className="text-lg font-semibold text-red-600">
								{attempt.incorrect_answers}
							</p>
						</div>
						<div className="bg-gray-50 p-2 rounded">
							<p className="text-sm text-gray-600">Total</p>
							<p className="text-lg font-semibold text-gray-600">
								{attempt.total_questions}
							</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default QuizResults;
