import { createContext, useState, useEffect } from "react";
import API from "../services/api";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const registerUser = async (userData) => {
    try {
      const response = await API.post("/register/", userData);
      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      alert('Registration failed. Please try again.');
    }
  };

  const loginUser = async (credentials) => {
    try {
      const response = await API.post("/login/", credentials);
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      alert('Login failed')
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
  // const logoutUser = async () => {
  //   try {
  //     const accessToken = localStorage.getItem("access_token");
  //     const refreshToken = localStorage.getItem("refresh_token");
  
  //     if (!refreshToken) {
  //       throw new Error("No refresh token available.");
  //     }
  
  //     const res = await API.post(
  //       "/logout/",
  //       { refresh: refreshToken },
  //       {
  //         headers: {
  //           "Authorization": `Bearer ${accessToken}`,  // Send access token in header
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  
  //     console.log("Logout successful:", res.data.message);
  
  //     localStorage.clear();
  //     setUser(null);
  //     window.location.href = "/login";
  //   } catch (error) {
  //     console.error(
  //       "Logout failed:",
  //       error.response ? error.response.data : error.message
  //     );
  //   }
  // };
  

  return (
    <AuthContext.Provider value={{ user, registerUser,loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
