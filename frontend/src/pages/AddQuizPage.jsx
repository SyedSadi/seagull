import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addQuiz } from "../services/api";
import AdminLayout from "../components/Admin/AdminLayout";

const AddQuizPage = () => {
	const navigate = useNavigate();
	const [quiz, setQuiz] = useState({
		title: "",
		description: "",
	});

	const handleChange = (e) => {
		setQuiz({ ...quiz, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(quiz);
		try {
			const data = await addQuiz(quiz);
			alert("Quiz added successfully");
			navigate("/quiz");
			setQuiz({
				title: "",
				description: "",
			});
			console.log(data);
		} catch {
			alert("something went wrong");
		}
	};

	return (
		<AdminLayout>
			<div className="max-w-lg mx-auto p-6 shadow-lg bg-blue-100 rounded-lg">
				<h2 className="text-xl font-bold mb-4">Add New Quiz</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<label className="form-control w-full">
						<span className="label-text">Title</span>
						<input
							type="text"
							name="title"
							value={quiz.title}
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
		</AdminLayout>
	);
};

export default AddQuizPage;
