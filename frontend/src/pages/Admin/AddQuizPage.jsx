import { useState } from "react";
import { toast } from "react-toastify";
import { addQuiz } from "../../services/quizApi";
import AdminLayout from "../../components/Admin/AdminLayout";
import AddQuestionForm from "../../components/Quiz/AddQuestionForm";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const AddQuizPage = () => {
	const navigate = useNavigate();
	const [quiz, setQuiz] = useState({
		name: "",
		description: "",
	});
	const [quizCreated, setQuizCreated] = useState(false);
	const [categoryId, setCategoryId] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e) => {
		setQuiz({ ...quiz, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate inputs
		if (!quiz.name.trim()) {
			toast.error("Quiz title is required");
			return;
		}
		if (!quiz.description.trim()) {
			toast.error("Quiz description is required");
			return;
		}

		try {
			setIsSubmitting(true);
			const data = await addQuiz(quiz);
			setCategoryId(data.id);
			setQuizCreated(true);
			toast.success(
				"Quiz category created successfully! You can now add questions."
			);
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					"Failed to create quiz. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleQuestionAdded = () => {
		toast.success("Question added successfully!");
	};

	const handleBack = () => {
		navigate("/manage-quiz");
		toast.info("Returning to quiz management");
	};

	return (
		<AdminLayout>
			<Helmet>
				<title>Add Quiz | KUETx</title>
			</Helmet>
			<div className="max-w-2xl mx-auto p-6">
				{!quizCreated ? (
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-xl font-bold mb-4 text-center">
							Create New Quiz Category
						</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<label className="form-control w-full">
								<span className="label-text font-medium text-gray-700">
									Title
								</span>
								<input
									type="text"
									name="name"
									value={quiz.name}
									onChange={handleChange}
									className="input input-bordered w-full"
									placeholder="Enter quiz title"
									disabled={isSubmitting}
									required
								/>
							</label>

							<label className="form-control w-full">
								<span className="label-text font-medium text-gray-700">
									Description
								</span>
								<textarea
									name="description"
									value={quiz.description}
									onChange={handleChange}
									className="textarea textarea-bordered w-full"
									placeholder="Enter quiz description"
									disabled={isSubmitting}
									required
									rows={4}
								/>
							</label>

							<div className="flex space-x-4">
								<button
									type="submit"
									disabled={isSubmitting}
									className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                    transition disabled:bg-blue-300 disabled:cursor-not-allowed"
								>
									{isSubmitting ? (
										<span className="flex items-center justify-center">
											Creating Quiz...
										</span>
									) : (
										"Create Quiz"
									)}
								</button>
								<button
									type="button"
									onClick={handleBack}
									disabled={isSubmitting}
									className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 
                    transition disabled:bg-gray-300 disabled:cursor-not-allowed"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				) : (
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold">
								Add Questions to {quiz.name}
							</h2>
							<button
								onClick={handleBack}
								className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
							>
								Back to Quiz List
							</button>
						</div>
						<AddQuestionForm
							categoryId={categoryId}
							onQuestionAdded={handleQuestionAdded}
						/>
					</div>
				)}
			</div>
		</AdminLayout>
	);
};

export default AddQuizPage;
