import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // Your Django backend URL
});

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


// export const getCourseContents = async (courseId) => {
//   const response = await API.get(`/courses/${courseId}`);
//   return response.data;
// };

export default API;
