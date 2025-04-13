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
