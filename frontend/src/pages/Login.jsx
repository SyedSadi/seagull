import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS
import { Helmet } from 'react-helmet-async';
import coverPic from '../assets/login.png'

const Login = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(false);
	const { loginUser } = useContext(AuthContext);
	const [formData, setFormData] = useState({ username: "", password: "" });

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await loginUser(formData, navigate, location);

			if (res?.status === 200) {
				const redirectTo = location.state?.from?.pathname || "/";
				navigate(redirectTo);
				toast.success("Login successful!");
			}else{
				toast.error(res?.response?.data?.non_field_errors[0] || "Login Failed")
			}
		} catch (error) {
			console.error("Login error:", error);
		} finally{
			setLoading(false)
		}
	};

	return (
		<>
		<Helmet>
		    <title>Login | KUETx</title>
    	</Helmet>
		<div className="md:flex justify-around items-center min-h-screen bg-white px-6">
			<div>
				<img src={coverPic} alt="kuetx-logo" width={450} height={450}/>
			</div>
			<div className="card w-84 md:w-96 bg-white p-6 rounded-xl">
				<h2 className="text-3xl font-bold text-center text-blue-700">Login</h2>
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
					<button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
					{loading && (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                        {loading ? 'Loading...' : 'Login'}
					</button>
				</form>
				<p className="text-sm text-gray-600 text-center mt-3">
					<Link to="/forgot-password" className="text-blue-500">
						Forgot Password?
					</Link>
				</p>
				<p className="text-sm text-gray-600 text-center mt-3">
					Don&apos;t have an account?{" "}
					<Link to="/register" className="text-blue-500">
						Sign Up
					</Link>
				</p>
			</div>
		</div>
		</>
	);
};

export default Login;
