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
			const data = await addQuiz(quiz);
			setCategoryId(data.id);
			setQuizCreated(true);
			toast.success(
				"Quiz category created successfully! You can now add questions.",
				{
					position: "bottom-right",
					autoClose: 5000,
				}
			);
		} catch (error) {
			console.error("Error creating quiz:", error);
			toast.error("Failed to create quiz. Please try again.");
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
								<span className="label-text">Title</span>
								<input
									type="text"
									name="name"
									value={quiz.name}
									onChange={handleChange}
									className="input input-bordered w-full"
									required
								/>
							</label>

							<label className="form-control w-full">
								<span className="label-text">Description</span>
								<textarea
									name="description"
									value={quiz.description}
									onChange={handleChange}
									className="textarea textarea-bordered w-full"
									required
								/>
							</label>

							<button
								type="submit"
								className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-full"
							>
								Add Quiz
							</button>
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
