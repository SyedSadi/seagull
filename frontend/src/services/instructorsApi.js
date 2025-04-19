import API from "./api";

// fetch all instructors
export const getAllInstructors = async () => {
    const response = await API.get('/users/instructors/');
    return response.data;
  };
  