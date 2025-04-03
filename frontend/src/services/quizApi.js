import API from "./api";

// ----------------------- QUIZ CATEGORIES -----------------------------------
// Fetch all quiz categories
export const getAllCategories = async () => {
	const response = await API.get("/quiz/");
	console.log("API Response:", response.data);
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
