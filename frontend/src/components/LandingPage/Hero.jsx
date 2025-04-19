import { useState } from "react";
import HeroImage from "../../assets/herobg.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Hero = () => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
		}
	};

	return (
		<section className="relative w-full h-[600px] -mt-16">
			{/* Background image with gradient overlay */}
			<div className="absolute inset-0 z-0">
				<img
					src={HeroImage}
					alt="Learning background"
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
			</div>

			{/* Content - positioned for navbar overlay */}
			<div className="relative z-10 w-full h-full flex items-center justify-center">
				<div className="max-w-3xl mx-auto px-4 text-center text-white">
					<h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
						Unlock Your <span className="text-blue-500">Learning</span>{" "}
						Potential{" "}
					</h1>
					<p className="text-lg md:text-xl mb-6 text-gray-200">
						Join our community of learners and discover world-class courses
						designed to elevate your skills{" "}
					</p>

					{/* Search form */}
					<form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
						<div className="flex overflow-hidden rounded shadow-lg">
							<input
								type="text"
								placeholder="Search for courses..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full px-6 py-4 text-gray-900 bg-white focus:outline-none"
							/>
							<button
								type="submit"
								className="px-6 py-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none"
							>
								<FontAwesomeIcon icon={faMagnifyingGlass} />
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
};

export default Hero;
