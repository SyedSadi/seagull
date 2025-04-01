import { useState } from "react";
import { addQuestion } from "../../services/quizApi";

const AddQuestionForm = ({ categoryId, onQuestionAdded }) => {
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await addQuestion({
				category: categoryId,
				text: question.text,
				options: question.options,
			});
			onQuestionAdded();
			setQuestion({
				text: "",
				options: [
					{ text: "", is_correct: false },
					{ text: "", is_correct: false },
					{ text: "", is_correct: false },
					{ text: "", is_correct: false },
				],
			});
		} catch (error) {
			alert("Failed to add question");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Question Text
				</label>
				<textarea
					value={question.text}
					onChange={(e) => setQuestion({ ...question, text: e.target.value })}
					className="mt-1 block w-full border rounded-md shadow-sm p-2"
					required
				/>
			</div>

			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-700">
					Options
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
	);
};

export default AddQuestionForm;
