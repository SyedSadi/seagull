import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getQuizQuestions, updateQuestion } from "../../services/quizApi";
import { toast } from "react-toastify";

const UpdateQuestionsPage = () => {
	const { categoryId } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [questions, setQuestions] = useState([]);
	const [categoryName, setCategoryName] = useState("");

	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				const data = await getQuizQuestions(categoryId);
				setQuestions(data.questions);
				setCategoryName(data.category_name);
			} catch (error) {
				console.error("Error fetching questions:", error);
				toast.error("Failed to load questions");
			} finally {
				setLoading(false);
			}
		};

		fetchQuestions();
	}, [categoryId]);

	const handleQuestionChange = (questionId, field, value) => {
		setQuestions(
			questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q))
		);
	};

	const handleOptionChange = (questionId, optionId, field, value) => {
		setQuestions(
			questions.map((q) => {
				if (q.id === questionId) {
					const updatedOptions = q.options.map((opt) =>
						opt.id === optionId ? { ...opt, [field]: value } : opt
					);
					return { ...q, options: updatedOptions };
				}
				return q;
			})
		);
	};

	const handleSave = async (questionId) => {
		try {
			const question = questions.find((q) => q.id === questionId);
			// options are properly formatted with just the fields the backend expects
			const formattedOptions = question.options.map((opt) => ({
				id: opt.id,
				text: opt.text,
				is_correct: opt.is_correct,
			}));

			await updateQuestion(questionId, {
				text: question.text,
				category: question.category,
				options: formattedOptions,
			});
			toast.success("Question updated successfully!");
		} catch (error) {
			console.error("Error updating question:", error);
			toast.error("Failed to update question");
		}
	};

	if (loading) {
		return (
			<AdminLayout>
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="max-w-4xl mx-auto p-6">
				<div className="bg-white rounded-lg shadow-lg p-6">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-gray-800">
							Update Questions for {categoryName}
						</h2>
						<button
							onClick={() => navigate("/manage-quiz")}
							className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
						>
							Back to Quiz Management
						</button>
					</div>

					<div className="space-y-6">
						{questions.map((question, qIndex) => (
							<div
								key={question.id}
								className="border rounded-lg p-4 bg-gray-50"
							>
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Question {qIndex + 1}
									</label>
									<input
										type="text"
										value={question.text}
										onChange={(e) =>
											handleQuestionChange(question.id, "text", e.target.value)
										}
										className="w-full p-2 border rounded-md"
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
												className="flex-1 p-2 border rounded-md"
											/>
											<label className="flex items-center space-x-2">
												<input
													type="radio"
													name={`correct-${question.id}`}
													checked={option.is_correct}
													onChange={() => {
														question.options.forEach((opt) => {
															handleOptionChange(
																question.id,
																opt.id,
																"is_correct",
																opt.id === option.id
															);
														});
													}}
													className="text-blue-600"
												/>
												<span className="text-sm text-gray-600">Correct</span>
											</label>
										</div>
									))}
								</div>

								<div className="mt-4">
									<button
										onClick={() => handleSave(question.id)}
										className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
									>
										Save Changes
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
