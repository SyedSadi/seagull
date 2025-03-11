import API from "./api";

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