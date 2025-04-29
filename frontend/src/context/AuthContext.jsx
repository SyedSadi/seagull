import { createContext, useState, useEffect } from "react";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types';
import { toast } from "react-toastify";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

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
    return <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>;
  }

  const registerUser = async (userData) => {
    try {
      const response = await API.post("/register/", userData);
      return response;
    } catch (error) {
      return error
    }
  };

  const loginUser = async (credentials, navigate, location) => {
    setLoginLoading(true)
    try {
      const response = await API.post("/login/", credentials);
      if(response?.data?.user){
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        navigate(location.state?.from?.pathname, { replace: true });
      }      
      return response;
    } catch (error) {
      return error
    }finally{
      setLoginLoading(false)
    }
  };

  const logoutUser = async () => {
    setLogoutLoading(true)
    try {
      const refreshToken = localStorage.getItem("refresh_token");
  
      if (!refreshToken) {
        throw new Error("No refresh token available.");
      }
      const res = await API.post("/logout/", { refresh: refreshToken });  
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error.response ? error.response.data : error.message);
    } finally{
      setLogoutLoading(false)
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, registerUser,loginUser, logoutUser, loading, loginLoading, logoutLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};