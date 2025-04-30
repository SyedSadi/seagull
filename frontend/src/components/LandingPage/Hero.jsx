import HeroImage from "../../assets/herobg.jpg";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Hero = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	const handleGetStarted = () => {
		if (user) {
			navigate("/courses");
		} else {
			navigate("/login");
		}
	};

	return (
		<section className="relative w-full h-[100vh] -mt-16">
			{/* Background image with gradient overlay */}
			<div className="absolute inset-0 z-0">
				<img
					src={HeroImage}
					alt="Learning background"
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-10" />

				{/* Left side fade */}
				<div className="absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-black/70 to-transparent z-10" />

				{/* Right side fade */}
				<div className="absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-black/70 to-transparent z-10" />
			</div>

			{/* Content - positioned for navbar overlay */}
			<div className="relative z-10 w-full h-full flex items-center justify-center">
				<div className="max-w-3xl mx-auto px-4 text-center text-white">
					<div className="text-xl md:text-5xl font-bold mb-4 leading-tight">
						Unlock Your Learning Potential{" "}
						<h1 className="mt-4">
							at <span className="text-blue-500">KUETx</span>
						</h1>{" "}
					</div>

					<p className="text-lg md:text-xl mb-6 text-gray-200">
						Where Learning Connects — Explore expert-led courses, join vibrant
						communities, and take control of your education.{" "}
					</p>

					<button
						onClick={handleGetStarted}
						className="group inline-flex items-center justify-center gap-2 px-8 py-3 text-lg font-medium text-white 
              bg-gradient-to-r from-blue-600 to-blue-500 rounded-full 
              hover:from-blue-700 hover:to-blue-600 
              transition-all duration-300 transform hover:scale-105"
					>
						<span>{user ? "Browse Courses" : "Get Started"}</span>
						<svg
							className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
					</button>
				</div>
			</div>
		</section>
	);
};

export default Hero;
