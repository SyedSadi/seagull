import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await loginUser(formData, navigate, location);
            console.log("res", res);

            if (res?.status === 200) {
                const redirectTo = location.state?.from?.pathname || "/";
                navigate(redirectTo);
                toast.success("Login successful!");
            } else {
                toast.error("Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="card w-96 bg-white shadow-lg p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="form-control">
                        <label htmlFor="username" className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            className="input input-bordered w-full"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-control mt-2">
                        <label htmlFor="password" className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className="input input-bordered w-full"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-4">
                        Login
                    </button>
                </form>
                <p className="text-sm text-gray-600 text-center mt-3">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-500">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
