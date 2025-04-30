import API from "./api";

// ----------------------- QUIZ CATEGORIES -----------------------------------
// Fetch all quiz categories
export const getAllCategories = async () => {
	const response = await API.get("/quiz/");
	return response.data;
};

// ----------------------- QUIZ QUESTIONS -----------------------------------
// Fetch quiz questions by category ID
export const getQuizQuestions = async (categoryId) => {
	const response = await API.get(`/quiz/${categoryId}/`);
	return response.data;
};

// ----------------------- SUBMIT QUIZ -----------------------------------
// Submit quiz answers
export const submitQuiz = async (quizData) => {
	try {
		const token = localStorage.getItem("access_token");
		if (!token) {
			throw new Error("Authentication token is missing. Please log in again.");
		}

		const response = await API.post("/quiz/submit-quiz/", quizData, {
			headers: {
				Authorization: `Bearer ${token}`, // Attach token
			},
		});

		return response.data;
	} catch (error) {
		console.error("🚨 Error submitting quiz:", error);
		throw error;
	}
};

// ----------------------- ADD QUIZ -----------------------------------
// Add a new quiz
export const addQuiz = async (quizData) => {
	try {
		const token = localStorage.getItem("access_token");
		if (!token) {
			throw new Error("Authentication token is missing");
		}
		const response = await API.post("/quiz/add/", quizData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error adding quiz:", error);
		throw error; // Optionally, handle the error as per your application's need
	}
};

// ----------------------- ADD Questions -----------------------------------
export const addQuestion = async (questionData) => {
	try {
		const token = localStorage.getItem("access_token");
		if (!token) {
			throw new Error("Authentication token is missing");
		}
		const response = await API.post("/quiz/add-question/", questionData, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		return response.data;
	} catch (error) {
		console.error("API Error Details:", error); // Log detailed error
		throw error;
	}
};

// ----------------------- UPDATE Quiz Category -----------------------------------
export const updateQuiz = async (categoryId, quizData) => {
	try {
		const token = localStorage.getItem("access_token");
		if (!token) {
			throw new Error("Authentication token is missing");
		}
		const response = await API.put(`/quiz/update/${categoryId}/`, quizData, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error updating quiz", error);
		throw error;
	}
};

// ----------------------- UPDATE Questions -----------------------------------
export const updateQuestion = async (questionId, questionData) => {
	try {
		const token = localStorage.getItem("access_token");
		if (!token) {
			throw new Error("Authentication token is missing");
		}
		const response = await API.put(
			`/quiz/update-questions/${questionId}/`,
			questionData,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Detailed error in updateQuestion:", error);
		console.error("Response data if available:", error.response?.data);
		throw error;
	}
};

// ----------------------- DELETE Questions -----------------------------------
export const deleteQuestion = async (questionId) => {
	try {
		const response = await API.delete(`/quiz/delete-question/${questionId}/`);
		return response.data;
	} catch (error) {
		throw error.response?.data || error.message;
	}
};

// ----------------------- GET Quiz Attempts -----------------------------------
export const getAllQuizAttempts = async () => {
	try {
		const token = localStorage.getItem("access_token");
		if (!token) {
			throw new Error("Authentication token is missing");
		}

		const response = await API.get("/quiz/attempts/", {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		return response;
	} catch (error) {
		console.error("Error fetching quiz attempts:", error);
		throw error;
	}
};
