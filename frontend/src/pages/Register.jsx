import { useState, useContext } from "react";
import {AuthContext} from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const { registerUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "student",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await registerUser(formData);
        console.log(res)
        if(res.status === 201){
            alert('Registration successful! Please log in.');
            navigate('/login')
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="card w-96 bg-white shadow-lg p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-700">Register</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="form-control">
                        <label htmlFor="username" className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter a username"
                            className="input input-bordered w-full"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-control mt-2">
                        <label htmlFor="email" className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            className="input input-bordered w-full"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-control mt-2">
                        <label htmlFor="password" className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            className="input input-bordered w-full"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-control mt-2">
                        <label htmlFor="role" className="label">
                            <span className="label-text">Role</span>
                        </label>
                        <select
                            id="role"
                            name="role"
                            className="select select-bordered w-full"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-4">
                        Register
                    </button>
                </form>

                <p className="text-sm text-gray-600 text-center mt-3">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
