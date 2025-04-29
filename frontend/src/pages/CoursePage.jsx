import { useState, useEffect } from "react";
import CourseList from "../components/Courses/CourseList";
import { Helmet } from "react-helmet-async";
import { FaSearch } from "react-icons/fa";
import { getAllCourses } from "../services/coursesApi";

const CoursePage = () => {
	const [loading, setLoading] = useState(false);
	const [searchMessage, setSearchMessage] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [localSearch, setLocalSearch] = useState("");
	const [courses, setCourses] = useState([]);
	useEffect(() => {
		const fetchCourses = async () => {
			setLoading(true);
			try {
				const data = await getAllCourses();
				setCourses(data || []); // Ensure data is an array
			} catch (err) {
				console.error("Failed to load courses:", err);
			} finally {
				setLoading(false);
			}
		};
		if(!localStorage.getItem("courses")) fetchCourses();
		else setCourses(JSON.parse(localStorage.getItem("courses")))
		if(localSearch){
			setIsSearching(true)
			const filteredCourses = courses.filter(course =>
				course.title.toLowerCase().includes(localSearch.toLowerCase())
			);
			setCourses(filteredCourses)
			setIsSearching(false)
			setSearchMessage("");
		}
	},[localSearch])

	const handleClearSearch = () => {
		setLocalSearch("");
		setSearchMessage("");
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

	return (
		<div className="px-12">
			<Helmet>
				<title>
					Courses | KUETx
				</title>
			</Helmet>
			<div className="my-4 md:my-8 flex flex-col md:flex-row justify-between items-center px-4 md:px-10 pb-6 md:pb-12 space-y-6 md:space-y-0">
				<div className="text-center md:text-left w-full md:w-auto">
					<h1 className="text-2xl md:text-3xl font-bold">KUETx <span className="text-blue-600">Courses</span></h1>
					<p className="text-base md:text-lg pt-3 md:pt-6">
						Choose courses to learn from our world class instructors
					</p>
				</div>
				{/* Search Bar */}
				<form
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
								className={`w-full px-4 py-2 md:py-3 pl-10 border-0 border-b-2 bg-transparent border-b-blue-500
									${
									searchMessage.includes("Please enter")
										? "border-b-red-400 focus:border-b-red-500"
										: "border-b-gray-300 focus:border-b-blue-500"
									}
									focus:outline-none focus:ring-0 text-sm md:text-base
									placeholder-gray-400
								`}
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
						</div>
						{renderSearchMessage()}
					</div>
				</form>
			</div>
			<CourseList courses={courses} loading={loading}/>
		</div>
	);
};

export default CoursePage;
