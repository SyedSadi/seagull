import { createContext, useState, useEffect } from "react";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    }else{
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const registerUser = async (userData) => {
    try {
      const response = await API.post("/register/", userData);
      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      alert('Registration failed. Please try again.');
    }
  };

  const loginUser = async (credentials, navigate, location) => {
    try {
      console.log(credentials)
      const response = await API.post("/login/", credentials);
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log('new token after lgoin', response.data.access)
      console.log('new decoded token after login ', jwtDecode(response.data.access))
      setUser(response.data.user);
      // console.log("Redirecting to:", location.state?.from?.pathname || "/");
      navigate(location.state?.from?.pathname, { replace: true });

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      alert('Login failed')
    }finally{
      setLoading(false)
    }
  };

  const logoutUser = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
  
      if (!refreshToken) {
        throw new Error("No refresh token available.");
      }
      const res = await API.post("/logout/", { refresh: refreshToken });
  
      console.log("Logout successful:", res);
  
      localStorage.clear();
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, registerUser,loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
