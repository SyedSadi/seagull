import { useState, useEffect } from "react";
import { getAllCategories } from "../services/quizApi";
import AdminLayout from "../components/Admin/AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import API from "../services/api";

const ManageQuiz = () => {
	const [categories, setCategories] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

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

	const handleDelete = async (categoryId) => {
		if (window.confirm("Are you sure want to delete this quiz?")) {
			try {
				await API.delete(`/quiz/update-delete/${categoryId}/`);
				setCategories(categories.filter((cat) => cat.id !== categoryId));
				alert("Quiz Deleted successfully!");
			} catch (error) {
				console.error("Delete error: ", error);
				alert("Failed to delete quiz. Please try again.");
			}
		}
	};

	if (loading)
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
		<AdminLayout>
			<div className="bg-blue-100 rounded-lg shadow-lg p-10">
				<h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
					Manage Quizzes
				</h2>
				<p className="text-lg font-medium text-gray-700 mb-6">
					List of quizzes:
				</p>
				<div className="space-y-4">
					{categories.map((category, index) => (
						<div
							key={category.id}
							className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
						>
							<p className="text-lg font-semibold text-gray-800">
								{index + 1}. {category.name}
							</p>
							<div className="space-x-2">
								<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
									Manage Questions
								</button>
								<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
									Update
								</button>
								<button
									onClick={() => handleDelete(category.id)}
									type="button"
									className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
								>
									<FontAwesomeIcon icon={faTrashCan} />
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</AdminLayout>
	);
};

export default ManageQuiz;
