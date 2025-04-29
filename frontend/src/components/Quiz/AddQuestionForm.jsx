import { useState } from "react";
import PropTypes from "prop-types";
import { addQuestion } from "../../services/quizApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OPTION_COUNT = 4;

const AddQuestionForm = ({ categoryId, onQuestionAdded }) => {
	const navigate = useNavigate();
	const [questionCount, setQuestionCount] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [question, setQuestion] = useState({
		text: "",
		options: Array.from({ length: OPTION_COUNT }, (_, i) => ({
			id: `option-${Date.now()}-${i}`, //unique id for each options
			text: "",
			is_correct: false,
		})),
	});

	const handleOptionChange = (id, field, value) => {
		const newOptions = question.options.map((opt) =>
			opt.id === id ? { ...opt, [field]: value } : opt
		);
		if (field === "is_correct") {
			// Ensure only one option is correct
			newOptions.forEach((opt) => {
				if (opt.id !== id) opt.is_correct = false;
			});
		}
		setQuestion({ ...question, options: newOptions });
	};

	const validateQuestion = () => {
		// Check if question text is empty
		if (!question.text.trim()) {
			toast.error("Question text is required!");
			return false;
		}

		// Check if any option is empty
		const hasEmptyOptions = question.options.some((opt) => !opt.text.trim());
		if (hasEmptyOptions) {
			toast.error("All options must have text!");
			return false;
		}

		// Check if one option is marked as correct
		if (!question.options.some((opt) => opt.is_correct)) {
			toast.error("Please mark one option as correct!");
			return false;
		}

		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateQuestion()) return;

		try {
			setIsSubmitting(true);
			const questionData = {
				...question,
				category: categoryId,
				options: question.options.map((opt) => ({
					text: opt.text,
					is_correct: opt.is_correct,
				})),
			};
			const newQuestion = await addQuestion(questionData);

			if (onQuestionAdded) {
				onQuestionAdded(newQuestion);
			}

			// Increment question count
			setQuestionCount((prev) => prev + 1);

			// Reset form for next question
			setQuestion({
				text: "",
				options: Array.from({ length: OPTION_COUNT }, (_, i) => ({
					id: `option-${Date.now()}-${i}`,
					text: "",
					is_correct: false,
				})),
			});

			toast.success(
				"Question added successfully! You can add another question or click Finish."
			);
		} catch (error) {
			toast.error(
				error.response?.data?.error ||
					"Failed to add question. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center mb-4"></div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="question text"
						className="block text-sm font-medium text-gray-700"
					>
						Question Text{" "}
						<input
							id="question text"
							value={question.text}
							onChange={(e) =>
								setQuestion({ ...question, text: e.target.value })
							}
							className="textarea textarea-bordered mt-1 block w-full border rounded-md shadow-sm p-2"
							required
						/>
					</label>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="options"
						className="block text-sm font-medium text-gray-700"
					>
						Options (Select one correct answer)
						{question.options.map((option) => (
							<div key={option.id} className="flex items-center space-x-2">
								<input
									id="options"
									type="text"
									value={option.text}
									onChange={(e) =>
										handleOptionChange(option.id, "text", e.target.value)
									}
									className="textarea textarea-bordered flex-1 border rounded-md shadow-sm p-2 mb-1"
									placeholder={`Option ${question.options.indexOf(option) + 1}`}
									required
								/>
								<label className="flex items-center space-x-2 cursor-pointer">
									<input
										id="correct option"
										type="radio"
										name="correct_answer"
										checked={option.is_correct}
										onChange={() =>
											handleOptionChange(option.id, "is_correct", true)
										}
										className="radio radio-primary"
									/>{" "}
									<span className="text-sm text-gray-600">Correct</span>
								</label>
							</div>
						))}
					</label>
				</div>

				<div className="flex space-x-4">
					<button
						type="submit"
						disabled={isSubmitting}
						className="flex-1 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 
                                 disabled:bg-blue-300 disabled:cursor-not-allowed"
					>
						{isSubmitting ? (
							<span className="flex items-center justify-center">
								<svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
										fill="none"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								Adding...
							</span>
						) : (
							"Add Question"
						)}
					</button>
					<button
						type="button"
						onClick={() => navigate("/manage-quiz")}
						className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
					>
						Cancel
					</button>
				</div>
			</form>

			{questionCount > 0 && (
				<div className="mt-6 pt-4 border-t">
					<div className="flex justify-between items-center">
						<p className="text-green-600 font-medium">
							✓ {questionCount} question{questionCount !== 1 ? "s" : ""} added
							successfully
						</p>
						<button
							onClick={() => navigate("/manage-quiz")}
							className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
						>
							Finish
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
AddQuestionForm.propTypes = {
	categoryId: PropTypes.number.isRequired,
	onQuestionAdded: PropTypes.func,
};

export default AddQuestionForm;
