import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  headers: { 'Content-Type': 'application/json' },
});

// Attach Token to Requests
API.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("access_token");
    console.log("Attaching Token:", token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("conf", config);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh token if expired
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Interceptor Error:", error.response?.status);

    if (error.response?.status === 401) {
      console.log("401 Unauthorized - Attempting Token Refresh...");

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        console.log("No refresh token found! Redirecting to login.");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post("http://127.0.0.1:8000/token/refresh/", { refresh: refreshToken });
        console.log("New Token Received:", res.data.access);

        localStorage.setItem("access_token", res.data.access);
        API.defaults.headers.common["Authorization"] = `Bearer ${res.data.access}`;
        error.config.headers["Authorization"] = `Bearer ${res.data.access}`;
        return axios(error.config);
      } catch (refreshError) {
        console.error("Token Refresh Failed:", refreshError.response);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
