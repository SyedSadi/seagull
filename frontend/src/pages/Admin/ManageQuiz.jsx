import { useState, useEffect } from "react";
import { getAllCategories } from "../../services/quizApi";
import AdminLayout from "../../components/Admin/AdminLayout";
import API from "../../services/api";

const ManageQuiz = () => {
	const [categories, setCategories] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectMode, setSelectMode] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState([]);

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

	const toggleSelectMode = () => {
		setSelectMode(!selectMode);
		setSelectedOptions([]);
	};

	const handleCheckboxChange = (id) => {
		setSelectedOptions((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
		);
	};

	const handleDelete = async () => {
		if (
			window.confirm(
				"Are you sure you want to delete this quiz? This action cannot be undone."
			)
		) {
			try {
				setLoading(true);
				await API.delete("/quiz/delete/", {
					data: { category_ids: selectedOptions },
				});
				setCategories((prev) =>
					prev.filter((cat) => !selectedOptions.includes(cat.id))
				);
				setSelectedOptions([]);
				setSelectMode(false);
				// Use a toast notification or custom component instead
				alert("Quiz deleted successfully!");
			} catch (error) {
				console.error("Delete error: ", error);
				alert(
					`Failed to delete quiz: ${
						error.response?.data?.message || "Unknown error occurred"
					}`
				);
			} finally {
				setLoading(false);
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
			<div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-lg p-10">
				<h2 className="text-3xl font-bold text-center text-black mb-6">
					Manage Quizzes
				</h2>
				<div className="flex justify-between items-center mb-6">
					<p className="text-lg font-semibold text-black">List of quizzes:</p>
					<div className="space-x-4">
						<button
							className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
							onClick={toggleSelectMode}
						>
							{selectMode ? "Cancel" : "Select Multiple"}
						</button>
						{selectMode && selectedOptions.length > 0 && (
							<button
								onClick={handleDelete}
								className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
							>
								Delete Selected
							</button>
						)}
					</div>
				</div>

				<div className="space-y-4">
					{categories.map((category, index) => (
						<div
							key={category.id}
							className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center hover:shadow-lg transition duration-300"
						>
							<div className="flex items-center">
								{selectMode && (
									<input
										type="checkbox"
										checked={selectedOptions.includes(category.id)}
										onChange={() => handleCheckboxChange(category.id)}
										className="w-5 h-5 mr-4"
									/>
								)}
								<p className="text-lg font-semibold text-gray-800">
									{index + 1}. {category.name}
								</p>
								<p className="text-base text-gray-600 ml-1">
									(Question count: {category.question_count})
								</p>
							</div>
							<div className="space-x-3">
								<button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition duration-300">
									Update
								</button>
								<button className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition duration-300">
									Manage Questions
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
