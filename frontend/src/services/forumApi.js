import API from "./api";


// Posts
export const fetchPost = (filter, tag = '') => {
  let url = `/forum/posts/?filter=${filter}`;
  if (tag.trim()) url += `&tag=${tag.trim()}`;
  return API.get(url);
};

export const deletePost = (postId, token) => {
  return API.delete(`/forum/posts/${postId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Comments for a specfic post
export const fetchComment = (postId) => {
  return API.get(`/forum/comments/?post=${postId}`);
};


export const replyToComment = async (data) => {
    const res = await API.post('/forum/comments/', data);
    return res.data;
  };
  
  export const updateComment = async (id, data) => {
    const res = await API.put(`/forum/comments/${id}/`, data);
    return res.data;
  };
  
  export const deleteComment = async (id) => {
    await API.delete(`/forum/comments/${id}/`);
  };

  export const fetchTag = async () => {
    try {
      const response = await API.get('/forum/tags/');
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  };
  
  export const createPost = async (payload) => {
    try {
      const response = await API.post('/forum/posts/', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error.response?.data);
      throw error; // Rethrow the error to be handled by the caller
    }
  };
