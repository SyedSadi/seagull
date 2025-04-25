import { useState, useContext } from "react";
import {AuthContext} from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from 'react-helmet-async';
import coverPic from '../assets/login.png'

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { registerUser } = useContext(AuthContext);
    const [errorMsgs, setErrorMsgs] = useState({});
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
        setErrorMsgs({});
        setLoading(true);
        try{
            const res = await registerUser(formData);
            console.log(res)
            setErrorMsgs(res?.response?.data)
            console.log('eroor', errorMsgs)
            if(res.status === 201){
                toast.success(res?.data?.message, { autoClose: 7000 });
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    role: "student",
                })
            }
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false);
        }
    };

    return (
        <>
        <Helmet>
            <title>Registration | KUETx</title>
        </Helmet>
        
        <div className="md:flex justify-around items-center min-h-screen bg-white px-6">
            <div>
                <img src={coverPic} alt="kuetx-logo" width={450} height={450}/>
            </div>
            <div className="card w-84 md:w-96 bg-white p-6 rounded-xl">
                <h2 className="text-3xl font-bold text-center text-blue-700">Sign UP</h2>
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
                        <span className="text-xs text-gray-500 mt-1">Username can’t contain spaces or special characters (only letters, numbers, -, _).</span>
                        {errorMsgs?.username && <span className="text-xs text-red-500 mt-1">{errorMsgs?.username}</span>}
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
                        {errorMsgs?.email && <span className="text-xs text-red-500 mt-1">{errorMsgs?.email}</span>}
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
                        {errorMsgs?.password && <span className="text-xs text-red-500 mt-1">{errorMsgs?.password}</span>}
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
                    <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
                    {loading && (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                        {loading ? 'Registering...' : 'Sign UP'}
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
        </>
    );
};

export default Register;
