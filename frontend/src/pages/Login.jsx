import { useState, useContext } from "react";
import {AuthContext} from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate()
    const { loginUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await loginUser(formData);
        console.log('res', res);
        if(res?.status === 200){
            navigate('/')
            alert('login successful')
        }
        
    };
    
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="card w-96 bg-white shadow-lg p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
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
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
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
