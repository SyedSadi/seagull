import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getAllCategories, updateQuiz } from "../../services/quizApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";

const UpdateQuizPage = () => {
	const { categoryId } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [quiz, setQuiz] = useState({
		name: "",
		description: "",
	});

	useEffect(() => {
		const fetchQuiz = async () => {
			try {
				const categories = await getAllCategories();
				const category = categories.find(
					(c) => c.id === Number.parseInt(categoryId, 10)
				);
				if (category) {
					setQuiz({
						name: category.name,
						description: category.description,
					});
				} else {
					setError("Quiz category not found");
				}
			} catch (err) {
				setError("Failed to load quiz category");
				console.error("Error:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchQuiz();
	}, [categoryId]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setQuiz((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate inputs
		if (!quiz.name.trim() || !quiz.description.trim()) {
			toast.error("All fields are required");
			return;
		}

		try {
			setSubmitting(true);
			await updateQuiz(categoryId, quiz);
			toast.success("Quiz category updated successfully!");
			navigate("/manage-quiz");
		} catch (err) {
			toast.error(
				err.response?.data?.detail ||
					"Failed to update quiz category. Please try again."
			);
			setError(err.response?.data?.detail || "Failed to update quiz category");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<AdminLayout>
				<div className="flex flex-col justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
					<p className="text-gray-600">Loading quiz details...</p>
				</div>
			</AdminLayout>
		);
	}

	if (error) {
		return (
			<AdminLayout>
				<div className="flex flex-col justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<Helmet>
				<title>Update Quiz | KUETx</title>
			</Helmet>
			<div className="max-w-2xl mx-auto p-6">
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-xl font-bold mb-4 text-center">
						Update Quiz Category: {quiz.name}
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<label className="form-control w-full">
							<span className="label-text">Title</span>
							<input
								type="text"
								name="name"
								value={quiz.name}
								onChange={handleChange}
								className="textarea textarea-bordered w-full p-2 rounded"
								required
							/>
						</label>

						<label className="form-control w-full">
							<span className="label-text">Description</span>
							<textarea
								name="description"
								value={quiz.description}
								onChange={handleChange}
								className="textarea textarea-bordered w-full p-2 rounded"
								required
							/>
						</label>

						<div className="flex space-x-4">
							<button
								type="submit"
								disabled={submitting}
								className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                  transition disabled:bg-blue-300 disabled:cursor-not-allowed"
							>
								{submitting ? (
									<span className="flex items-center justify-center">
										Updating...
									</span>
								) : (
									"Update Quiz"
								)}
							</button>
							<button
								type="button"
								onClick={() => navigate("/manage-quiz")}
								disabled={submitting}
								className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 
                  transition disabled:bg-gray-300 disabled:cursor-not-allowed"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</AdminLayout>
	);
};

export default UpdateQuizPage;
