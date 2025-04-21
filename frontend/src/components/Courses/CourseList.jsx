import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllCourses } from "../../services/coursesApi";
import { FaBookOpen, FaSearch, FaSpinner } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FiSearch } from "react-icons/fi"; 

const CourseList = () => {
	const [courses, setCourses] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [loading, setLoading] = useState(false);
	const [localSearch, setLocalSearch] = useState(
		searchParams.get("search") || ""
	);

	useEffect(() => {
		const fetchCourses = async () => {
			setLoading(true)
			try {
				const searchQuery = searchParams.get("search") || "";
				const data = await getAllCourses(searchQuery);
				setCourses(data);
			} catch (error) {
				console.error("Error fetching courses:", error);
			}finally{
				setLoading(false)
			}
		};

		fetchCourses();
	}, [searchParams]);

	const handleLocalSearch = (e) => {
		e.preventDefault();
		setSearchParams(localSearch ? { search: localSearch } : {});
	};

	if(loading) {
		return (
			  <div className="flex justify-center items-center h-screen">
				<FaSpinner className="animate-spin text-4xl" />
			  </div>
			);
	}

	return (
		<div className="px-6 pb-12">
			{/* Search Bar */}
			<div className="my-8">
				<form onSubmit={handleLocalSearch} className="max-w-2xl mx-auto">
					<div className="flex gap-2">
						<div className="relative flex-1">
							<input
								type="text"
								placeholder="Search courses..."
								value={localSearch}
								onChange={(e) => setLocalSearch(e.target.value)}
								className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						</div>
						<button
							type="submit"
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Search
						</button>
					</div>
				</form>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{courses?.map((course) => (
					<Link key={course.id} to={`/courses/${course.id}`}>
						<div className="bg-white rounded-lg shadow-md transition duration-300 flex flex-col h-full overflow-hidden">
							{/* Course Image */}
							<div className="relative h-40 w-full flex-shrink-0">
								{" "}
								<img
									src={course.image || "https://placehold.co/600x400?text=Course+Image"}
									alt={course.title || "Course"}
									className="w-full h-full object-cover"
									loading="lazy"
								/>
							</div>
					
							{/* Course Info */}
							<div className="p-4 flex flex-col flex-grow">
								<h3
									className="font-semibold text-lg mb-2 line-clamp-2"
									title={course.title}
								>
									{" "}
									{course.title || "Untitled Course"}
								</h3>
								<p className="text-gray-600 text-sm mb-4 line-clamp-5 flex-grow-0">
									{" "}
									{course.description || "No description available."}
								</p>
					
								{/* Course Meta */}
								<div className="flex items-center justify-between text-sm mb-4 mt-auto pt-2">
									{" "}
									<span
										className={`px-3 py-1 rounded-full font-medium ${
												course.difficulty.toLowerCase() === "beginner"
												? "bg-green-100 text-green-800"
												: course.difficulty.toLowerCase() === "intermediate"
												? "bg-yellow-100 text-yellow-800"
												: course.difficulty.toLowerCase() === "advanced"
												? "bg-red-100 text-red-800"
												: "bg-gray-100 text-gray-800" // Fallback
										}`}
									>
										{course.difficulty.toUpperCase() || "N/A"}
									</span>
									<span className="flex items-center text-gray-700">
										<FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
										{course.ratings?.toFixed(1) || "N/A"}
									</span>
								</div>
					
								{/* View Button */}
								<Link
									to={`/courses/${course.id}`}
									className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium"
								>
									View Course
								</Link>
							</div>
					</div>
					</Link>
					
				))}
			</div>
		</div>
	);
};

export default CourseList;
