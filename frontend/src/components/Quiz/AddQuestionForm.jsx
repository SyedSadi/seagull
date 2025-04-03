import { useState } from "react";
import PropTypes from "prop-types";
import { addQuestion } from "../../services/quizApi";
import { useNavigate } from "react-router-dom";

const AddQuestionForm = ({ categoryId }) => {
	const navigate = useNavigate();
	const [questionCount, setQuestionCount] = useState(0);
	const [question, setQuestion] = useState({
		text: "",
		options: [
			{ text: "", is_correct: false },
			{ text: "", is_correct: false },
			{ text: "", is_correct: false },
			{ text: "", is_correct: false },
		],
	});

	const handleOptionChange = (index, field, value) => {
		const newOptions = [...question.options];
		newOptions[index] = { ...newOptions[index], [field]: value };
		if (field === "is_correct") {
			// Ensure only one option is correct
			newOptions.forEach((opt, i) => {
				if (i !== index) opt.is_correct = false;
			});
		}
		setQuestion({ ...question, options: newOptions });
	};

	const validateQuestion = () => {
		// Check if question text is empty
		if (!question.text.trim()) {
			alert("Question text is required!");
			return false;
		}

		// Check if one option is marked as correct
		if (!question.options.some((opt) => opt.is_correct)) {
			alert("Please mark one option as correct!");
			return false;
		}

		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateQuestion()) return;

		try {
			const questionData = {
				...question,
				category: categoryId,
			};
			await addQuestion(questionData);

			setQuestionCount((prev) => prev + 1);
			// Reset form
			setQuestion({
				text: "",
				options: [
					{ text: "", is_correct: false },
					{ text: "", is_correct: false },
					{ text: "", is_correct: false },
					{ text: "", is_correct: false },
				],
			});
			alert("Question added successfully!");
		} catch (error) {
			console.error("Error adding question:", error.response?.data || error);
			alert(
				error.response?.data?.error ||
					"Failed to add question. Please try again."
			);
		}
	};

	const handleFinish = () => {
		if (questionCount === 0) {
			alert("Please add at least one question before finishing!");
			return;
		}
		alert(`Quiz created successfully with ${questionCount} questions!`);
		navigate("/quiz"); // Navigate to quiz home page
	};

	return (
		<div className="spacae-y-6">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Question Text
					</label>
					<input
						value={question.text}
						onChange={(e) => setQuestion({ ...question, text: e.target.value })}
						className="mt-1 block w-full border rounded-md shadow-sm p-2"
						required
					/>
				</div>

				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700">
						Options (Select one correct answer)
					</label>
					{question.options.map((option, index) => (
						<div key={index} className="flex items-center space-x-2">
							<input
								type="text"
								value={option.text}
								onChange={(e) =>
									handleOptionChange(index, "text", e.target.value)
								}
								className="flex-1 border rounded-md shadow-sm p-2"
								placeholder={`Option ${index + 1}`}
								required
							/>
							<label className="flex items-center">
								<input
									type="radio"
									name="correct_answer"
									checked={option.is_correct}
									onChange={() => handleOptionChange(index, "is_correct", true)}
									className="mr-2"
								/>
								Correct
							</label>
						</div>
					))}
				</div>

				<button
					type="submit"
					className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
				>
					Add Question
				</button>
			</form>

			<div className="flex justify-between items-center pt-4 border-t">
				<span className="text-gray-600">Questions added: {questionCount}</span>
				<button
					onClick={handleFinish}
					className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
				>
					Finish
				</button>
			</div>
		</div>
	);
};
AddQuestionForm.propTypes = {
	categoryId: PropTypes.number.isRequired,
};

export default AddQuestionForm;
