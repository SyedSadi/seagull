import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/courses/', // Your Django backend URL
});

// Fetch all courses
export const getCourses = async () => {
  const response = await API.get('/courses/');
  return response.data;
};

// Fetch course details by ID
export const getCourseById = async (id) => {
  const response = await API.get(`/courses/${id}/`);
  return response.data;
};

// Fetch course contents by course ID
export const getCourseContents = async (courseId) => {
  const response = await API.get(`/contents/?course=${courseId}`);
  return response.data;
};

export default API;
