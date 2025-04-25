import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getAllCategories, updateQuiz } from "../../services/quizApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from 'react-helmet-async';

const UpdateQuizPage = () => {
	const { categoryId } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
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
		try {
			setLoading(true);
			await updateQuiz(categoryId, quiz);
			// Import toast from your notification library
			toast.success("Quiz category updated successfully!");
			navigate("/manage-quiz");
		} catch (err) {
			setError(err.response?.data?.detail || "Failed to update quiz category");
		} finally {
			setLoading(false);
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
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-6">
					<span className="block sm:inline">{error}</span>
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
				<div className="bg-blue-100 p-6 rounded-lg shadow-lg">
					<h2 className="text-xl font-bold mb-4">
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
								className="input input-bordered w-full p-2 rounded"
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
								className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
								disabled={loading}
							>
								{loading ? "Updating..." : "Update Quiz"}
							</button>
							<button
								type="button"
								onClick={() => navigate("/manage-quiz")}
								className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
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
