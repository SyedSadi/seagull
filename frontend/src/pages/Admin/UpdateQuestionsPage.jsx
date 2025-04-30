import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";
import {
	getQuizQuestions,
	updateQuestion,
	deleteQuestion,
} from "../../services/quizApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";
import AddQuestionForm from "../../components/Quiz/AddQuestionForm";

const UpdateQuestionsPage = () => {
	const { categoryId } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState({});
	const [error, setError] = useState(null);
	const [questions, setQuestions] = useState([]);
	const [categoryName, setCategoryName] = useState("");
	const [showAddForm, setShowAddForm] = useState(false);

	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				setError(null);
				const data = await getQuizQuestions(categoryId);
				setQuestions(data.questions || []); // Allow empty array
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

	const handleQuestionAdded = (newQuestion) => {
		setQuestions((prev) => [...prev, newQuestion]);
		toast.success("Question added successfully!");
	};

	const handleQuestionChange = (questionId, field, value) => {
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

	const handleDelete = async (questionId) => {
		if (!window.confirm("Are you sure you want to delete this question?")) {
			return;
		}

		try {
			setSaving((prev) => ({ ...prev, [questionId]: true }));
			await deleteQuestion(questionId);

			// Remove the question from local state
			setQuestions(questions.filter((q) => q.id !== questionId));
			toast.success("Question deleted successfully!");
		} catch (error) {
			console.error("Error deleting question:", error);
			toast.error(error.message || "Failed to delete question");
		} finally {
			setSaving((prev) => ({ ...prev, [questionId]: false }));
		}
	};

	if (loading) {
		return (
			<AdminLayout>
				<div className="flex flex-col justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
					<p className="text-gray-600">Loading questions...</p>
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
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<div className="flex justify-between items-center mb-6">
						<div>
							<h2 className="text-xl font-bold text-gray-800">
								Update Questions for {categoryName}
							</h2>
							<p className="text-sm text-gray-600 mt-1">
								Total questions: {questions.length}
							</p>
						</div>
						<div className="space-x-2">
							<button
								onClick={() => setShowAddForm(!showAddForm)}
								className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
							>
								{showAddForm ? "Cancel Add" : "Add Questions"}
							</button>
							<button
								onClick={() => navigate("/manage-quiz")}
								className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
							>
								Back
							</button>
						</div>
					</div>

					{showAddForm && (
						<div className="mb-8 bg-white rounded-lg p-6 shadow">
							<h3 className="text-lg font-semibold mb-4">Add New Question</h3>
							<AddQuestionForm
								categoryId={parseInt(categoryId)}
								onQuestionAdded={handleQuestionAdded}
							/>
						</div>
					)}

					<div className="space-y-6">
						{questions.length === 0 && !showAddForm ? (
							<div className="text-center py-8 bg-white rounded-lg shadow">
								<p className="text-gray-600 mb-4">
									No questions available in this category.
								</p>
							</div>
						) : (
							questions.map((question, qIndex) => (
								<div
									key={question.id}
									className="bg-white rounded-lg p-4 shadow border border-gray-400"
								>
									<div className="flex justify-between items-start mb-4">
										<label className="block text-lg font-medium text-gray-700">
											Question {qIndex + 1}
										</label>
										<button
											onClick={() => handleDelete(question.id)}
											disabled={saving[question.id]}
											className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 
												  transition disabled:bg-red-300 disabled:cursor-not-allowed"
										>
											{saving[question.id] ? "Deleting..." : "Delete"}
										</button>
									</div>

									<div className="mb-4">
										<p className="font-semibold">Question Text:</p>
										<input
											type="text"
											value={question.text}
											onChange={(e) =>
												handleQuestionChange(
													question.id,
													"text",
													e.target.value
												)
											}
											className="textarea textarea-bordered w-full p-2 rounded"
											placeholder="Enter question text"
										/>
									</div>
									<p className="font-semibold">
										Options (Select one correct answer)
									</p>
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
													className="textarea textarea-bordered flex-1 p-2 rounded"
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
							))
						)}
					</div>
				</div>
			</div>
		</AdminLayout>
	);
};

export default UpdateQuestionsPage;
