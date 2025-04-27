import { useState } from "react";
import HeroImage from "../../assets/herobg.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Hero = () => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [searchMessage, setSearchMessage] = useState("");

	const handleSearch = (e) => {
		e.preventDefault();

		if (!searchQuery.trim()) {
			setSearchMessage("Please enter a search term");
			return;
		}

		// Clear any previous message and navigate to courses
		setSearchMessage("");
		navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
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

					{/* Search form */}
					{/* <form
						onSubmit={handleSearch}
						className="w-full max-w-2xl mx-auto mt-4"
					>
						<div className="flex flex-col gap-2">
							<div className="flex overflow-hidden rounded shadow-lg">
								<input
									type="text"
									placeholder="Search for courses..."
									value={searchQuery}
									onChange={(e) => {
										setSearchQuery(e.target.value);
										setSearchMessage(""); // Clear message when typing
									}}
									className={`w-full px-6 py-4 text-gray-900 bg-white focus:outline-none
                                        ${
																					searchMessage
																						? "border-red-500"
																						: "border-transparent"
																				}`}
								/>
								<button
									type="submit"
									className="px-6 py-4 bg-blue-600 text-white hover:bg-blue-700 
                                             transition-colors focus:outline-none"
								>
									<FontAwesomeIcon icon={faMagnifyingGlass} />
								</button>
							</div>
							{searchMessage && (
								<div className="text-sm text-red-400 bg-black/40 py-1 px-2 rounded">
									{searchMessage}
								</div>
							)}
						</div>
					</form> */}
				</div>
			</div>
		</section>
	);
};

export default Hero;
