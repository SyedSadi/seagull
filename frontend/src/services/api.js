import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // Your Django backend URL
  headers: {
    'Content-Type': 'application/json',
  }
});

// ----------------------- COURSES -----------------------------------
// Fetch all courses
export const getAllCourses = async () => {
  const response = await API.get('/courses/');
  return response.data;
};

// Fetch course details by ID
export const getCourseDetailsById = async (id) => {
  const response = await API.get(`/courses/${id}/`);
  return response.data;
};

// Add a new course
export const addCourse = async (courseData) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await API.post("/courses/add/", courseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;  // Optionally, handle the error as per your application's need
  }
};

// ----------------------- CONTENTS -----------------------------------
// Edit contents
export const updateContentById = async (contentId, updatedContent) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await API.put(`/courses/content/${contentId}/`, updatedContent, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating content with ID ${contentId}:`, error.response?.data || error.message);
    throw error;
  }
};

// ----------------------- INSTRUCTORS -----------------------------------
// fetch all instructors
export const getAllInstructors = async () => {
  const response = await API.get('/instructors/');
  return response.data;
};

// ----------------------- QUIZ CATEGORIES -----------------------------------
// Fetch all quiz categories
export const getAllCategories = async () => {
  const response = await API.get('/quiz/');
   console.log('API Response:', response.data)
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
    const token = localStorage.getItem('access_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await API.post('/submit-quiz/', quizData, {
      headers
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
};


export default API;
