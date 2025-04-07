import API from "./api";

// Edit contents
export const updateContentById = async (contentId, updatedContent) => {
    try {
      const response = await API.put(`/courses/content/update/${contentId}/`, updatedContent);
      return response.data;
    } catch (error) {
      console.error(`Error updating content with ID ${contentId}:`, error.response?.data || error.message);
      throw error;
    }
};

export const deleteContentById = async (contentId) => {
  try{
    const res = await API.delete(`/courses/content/delete/${contentId}/`);
    return res.data;
  }catch (error) {
    console.error(`Error deleting content with ID ${contentId}:`, error.response?.data || error.message);
    throw error;
  }
}