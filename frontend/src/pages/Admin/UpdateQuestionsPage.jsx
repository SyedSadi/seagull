import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getQuizQuestions, updateQuestion } from "../../services/quizApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from 'react-helmet-async';

const UpdateQuestionsPage = () => {
	const { categoryId } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState({});
	const [error, setError] = useState(null);
	const [questions, setQuestions] = useState([]);
	const [categoryName, setCategoryName] = useState("");

	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				setError(null);
				const data = await getQuizQuestions(categoryId);
				if (!data?.questions?.length) {
					throw new Error("No questions found for this category");
				}
				setQuestions(data.questions);
				setCategoryName(data.category_name);
			} catch (error) {
				console.error("Error fetching questions:", error);
				setError(error.message || "Failed to load questions");
			} finally {
				setLoading(false);
			}
		};

		fetchQuestions();
	}, [categoryId]);

	const handleQuestionChange = (questionId, field, value) => {
		// if (value.trim() && !field === "text") {
		// 	toast.warning("Question text cannot be empty");
		// 	return;

		const questionIndex = questions.findIndex((q) => q.id === questionId);
		if (questionIndex !== -1) {
			const updatedQuestions = [...questions];
			updatedQuestions[questionIndex] = {
				...updatedQuestions[questionIndex],
				[field]: value,
			};
			setQuestions(updatedQuestions);
		}
	};

	const handleOptionChange = (questionId, optionId, field, value) => {
		setQuestions((prevQuestions) =>
			prevQuestions.map((question) => {
				if (question.id !== questionId) return question;

				const updatedOptions = question.options.map((option) => {
					if (field === "is_correct") {
						// When handling radio selection, set all other options to false
						return {
							...option,
							is_correct: option.id === optionId,
						};
					}

					if (option.id === optionId) {
						return { ...option, [field]: value };
					}

					return option;
				});

				return {
					...question,
					options: updatedOptions,
				};
			})
		);
	};

	const handleSave = async (questionId) => {
		try {
			setSaving((prev) => ({ ...prev, [questionId]: true }));
			const question = questions.find((q) => q.id === questionId);
			//Validate question text
			if (!question.text.trim()) {
				throw new Error("Question text cannot be empty");
			}
			//Validate options
			const hasEmptyOptions = question.options.some((opt) => !opt.text.trim());
			if (hasEmptyOptions) {
				throw new Error("All options must have text");
			}

			const questionData = {
				text: question.text,
				category: question.category,
				options: question.options.map((opt) => ({
					id: opt.id,
					text: opt.text,
					is_correct: opt.is_correct,
				})),
			};

			console.log("About to update question:", questionId);
			console.log("With data:", questionData);

			const result = await updateQuestion(questionId, questionData);
			if (result) {
				toast.success("Question updated successfully!");

				// Update local state with server response
				setQuestions((prevQuestions) =>
					prevQuestions.map((q) =>
						q.id === questionId ? { ...q, ...result } : q
					)
				);
			}
		} catch (error) {
			console.error("Error updating question:", error);
			toast.error(
				error.message || "Failed to update question. Please try again."
			);
		} finally {
			setSaving((prev) => ({ ...prev, [questionId]: false }));
		}
	};

	if (loading) {
		return (
			<AdminLayout>
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
				</div>
			</AdminLayout>
		);
	}

	if (error) {
		return (
			<AdminLayout>
				<Helmet>
		        	<title>Update Questions | KUETx</title>
    			</Helmet>
				<div className="max-w-2xl mx-auto p-6">
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-6">
						<span className="block sm:inline">{error}</span>
						<button
							onClick={() => navigate("/manage-quiz")}
							className="mt-4 text-red-600 hover:text-red-800 font-medium"
						>
							← Back to Quiz Management
						</button>
					</div>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="max-w-2xl mx-auto p-6">
				<div className="bg-blue-100 p-6 rounded-lg shadow-lg">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-xl font-bold text-gray-800">
							Update Questions for {categoryName}
						</h2>
						<button
							onClick={() => navigate("/manage-quiz")}
							className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
						>
							Cancel
						</button>
					</div>

					<div className="space-y-6">
						{questions.map((question, qIndex) => (
							<div key={question.id} className="bg-white rounded-lg p-4 shadow">
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Question {qIndex + 1}
									</label>
									<p>Text:</p>
									<input
										type="text"
										value={question.text}
										onChange={(e) =>
											handleQuestionChange(question.id, "text", e.target.value)
										}
										className="input input-bordered w-full p-2 rounded"
										placeholder="Enter question text"
									/>
								</div>

								<div className="space-y-3">
									{question.options.map((option) => (
										<div
											key={option.id}
											className="flex items-center space-x-3"
										>
											<input
												type="text"
												value={option.text}
												onChange={(e) =>
													handleOptionChange(
														question.id,
														option.id,
														"text",
														e.target.value
													)
												}
												className="input input-bordered flex-1 p-2 rounded"
												placeholder="Enter option text"
											/>
											<label className="flex items-center space-x-2 cursor-pointer">
												<input
													type="radio"
													name={`correct-${question.id}`}
													checked={option.is_correct}
													onChange={() =>
														handleOptionChange(
															question.id,
															option.id,
															"is_correct",
															true
														)
													}
													className="radio radio-primary"
												/>
												<span className="text-sm text-gray-600">Correct</span>
											</label>
										</div>
									))}
								</div>

								<div className="mt-4 flex justify-end">
									<button
										onClick={() => handleSave(question.id)}
										disabled={saving[question.id]}
										className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
									>
										{saving[question.id] ? "Saving..." : "Save Changes"}
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</AdminLayout>
	);
};

export default UpdateQuestionsPage;
