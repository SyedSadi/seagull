import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addQuiz } from "../services/quizApi";
import AdminLayout from "../components/Admin/AdminLayout";
import AddQuestionForm from "../components/Quiz/AddQuestionForm";

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
		try {
			const data = await addQuiz(quiz);
			setCategoryId(data.id);
			setQuizCreated(true);
			alert("Quiz category created successfully! Now add questions.");
		} catch {
			alert("Something went wrong");
		}
	};

	const handleQuestionAdded = () => {
		alert("Question added successfully!");
	};

	return (
		<AdminLayout>
			<div className="max-w-2xl mx-auto p-6">
				{!quizCreated ? (
					<div className="bg-blue-100 p-6 rounded-lg shadow-lg">
						<h2 className="text-xl font-bold mb-4">Create New Quiz Category</h2>
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

							<button type="submit" className="btn btn-primary w-full">
								Add Quiz
							</button>
						</form>
					</div>
				) : (
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-xl font-bold mb-4">
							Add Questions to {quiz.name}
						</h2>
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
