import API from "./api";

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