import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CourseList from "../components/Courses/CourseList";
import { Helmet } from "react-helmet-async";
import { FaSearch } from "react-icons/fa";

const CoursePage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [localSearch, setLocalSearch] = useState(
		searchParams.get("search") || ""
	);
	const [searchMessage, setSearchMessage] = useState("");
	const [isSearching, setIsSearching] = useState(false);

	const handleLocalSearch = (e) => {
		e.preventDefault();

		if (!localSearch.trim()) {
			setSearchMessage("Please enter a search term");
			return;
		}

		setIsSearching(true);
		setSearchMessage("");

		// Update the URL with the search parameter
		setSearchParams(localSearch ? { search: localSearch } : {});

		// Small delay to show the searching state before CourseList takes over
		setTimeout(() => {
			setIsSearching(false);
		}, 300);
	};

	const handleClearSearch = () => {
		setLocalSearch("");
		setSearchMessage("");
		setSearchParams({});
	};

	// Update the search message component
	const renderSearchMessage = () => {
		if (!searchMessage) return null;

		let messageClass = "text-sm text-center mt-2 ";
		if (searchMessage.includes("Please enter")) {
			messageClass += "text-red-500";
		} else {
			messageClass += "text-blue-600";
		}

		return <div className={messageClass}>{searchMessage}</div>;
	};

	// Clear validation message when search term changes
	useEffect(() => {
		if (localSearch.trim()) {
			setSearchMessage("");
		}
	}, [localSearch]);

	return (
		<div>
			<Helmet>
				<title>
					{searchParams.get("search")
						? `Search: ${searchParams.get("search")} | KUETx`
						: "Courses | KUETx"}
				</title>
			</Helmet>
			<div className="my-4 md:my-8 flex flex-col md:flex-row justify-between items-center px-4 md:px-10 pb-6 md:pb-12 space-y-6 md:space-y-0">
				<div className="text-center md:text-left w-full md:w-auto">
					<h1 className="text-2xl md:text-3xl font-bold">KUETx Courses</h1>
					<p className="text-base md:text-lg pt-3 md:pt-6">
						Choose courses to learn from our world class instructors
					</p>
				</div>
				{/* Search Bar */}
				<form
					onSubmit={handleLocalSearch}
					className="w-full md:max-w-2xl md:ml-auto"
				>
					<div className="flex flex-col gap-2">
						<div className="flex gap-1">
							<div className="relative flex-1">
								<input
									type="text"
									placeholder="Search courses..."
									value={localSearch}
									onChange={(e) => setLocalSearch(e.target.value)}
									className={`w-full px-4 py-2 md:py-3 pl-10 rounded-lg border 
										${
											searchMessage.includes("Please enter")
												? "border-red-300 focus:ring-red-500"
												: "border-gray-300 focus:ring-blue-500"
										} 
										focus:outline-none focus:ring-2 text-sm md:text-base`}
									disabled={isSearching}
								/>
								<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
								{localSearch && (
									<button
										type="button"
										onClick={handleClearSearch}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
										aria-label="Clear search"
									>
										✕
									</button>
								)}
							</div>
							<button
								type="submit"
								className={`px-2 md:px-4 py-2 md:py-3 rounded-lg transition-colors
									${
										isSearching
											? "bg-gray-400 cursor-not-allowed"
											: "bg-blue-600 hover:bg-blue-700"
									} 
									text-white`}
								disabled={isSearching}
							>
								<FaSearch />
							</button>
						</div>
						{renderSearchMessage()}
					</div>
				</form>
			</div>
			<CourseList />
		</div>
	);
};

export default CoursePage;
