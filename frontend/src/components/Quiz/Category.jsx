import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../services/quizApi";

function Category() {
	const [categories, setCategories] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		getAllCategories()
			.then((data) => {
				setCategories(data);
				setLoading(false);
			})
			.catch((err) => {
				setError("Failed to load categories. Please try again later.");
				console.error("Error fetching categories:", err);
				setLoading(false);
			});
	}, []);

	const handleCategorySelect = (categoryId) => {
		navigate(`/quiz/${categoryId}`);
	};

	if (loading)
		return (
			<div className="flex flex-col justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
				<p className="text-gray-600">Loading quizzes...</p>
			</div>
		);

	if (error)
		return (
			<div
				className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-6"
				role="alert"
			>
				<span className="block sm:inline">{error}</span>
			</div>
		);

	return (
		<div className="container mx-auto px-4 py-12">
			<h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
				Select a <span className="text-blue-600">Quiz</span> Category
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
				{categories.map((category) => (
					<div
						key={category.id}
						className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 
								 h-[320px] flex flex-col justify-between overflow-hidden
								 border border-gray-100 group"
					>
						<div className="p-6 flex-1">
							<h3
								className="text-2xl font-semibold text-gray-800 group-hover:text-blue-600 
									   transition-colors duration-300 mb-4"
							>
								{category.name}
							</h3>
							<p className="text-gray-600 mb-4 line-clamp-3">
								{category.description}
							</p>
							<div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600">
								<span className="text-sm font-medium">
									{category.question_count} Questions
								</span>
							</div>
						</div>

						<div className="p-6 pt-0">
							<button
								onClick={() => handleCategorySelect(category.id)}
								className="w-full bg-gradient-to-r from-blue-600 to-blue-500 
										 hover:from-blue-700 hover:to-blue-600
										 text-white rounded-lg px-6 py-3 
										 text-lg font-semibold
										 transform transition-colors duration-500"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handleCategorySelect(category.id);
									}
								}}
							>
								Start Quiz
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Category;
