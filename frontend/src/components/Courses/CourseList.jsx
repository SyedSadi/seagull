import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllCourses } from "../../services/coursesApi";
import { FaBookOpen, FaSearch } from "react-icons/fa";

const CourseList = () => {
	const [courses, setCourses] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [localSearch, setLocalSearch] = useState(
		searchParams.get("search") || ""
	);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const searchQuery = searchParams.get("search") || "";
				const data = await getAllCourses(searchQuery);
				setCourses(data);
			} catch (error) {
				console.error("Error fetching courses:", error);
			}
		};

		fetchCourses();
	}, [searchParams]);

	const handleLocalSearch = (e) => {
		e.preventDefault();
		setSearchParams(localSearch ? { search: localSearch } : {});
	};

	return (
		<div>
			{/* Search Bar */}
			<div className="mb-8">
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
				{courses.map((course) => (
					<div
						key={course.id}
						className="card bg-white shadow-xl rounded-lg h-full flex flex-col transition-all transform hover:shadow-2xl"
					>
						<figure className="m-0 flex-grow">
							<img
								className="w-full h-48 object-cover"
								src={course.image}
								alt="Course"
							/>
						</figure>
						<div className="p-6 flex flex-col flex-grow">
							<h3 className="text-sm text-gray-500 mb-2">#{course.subject}</h3>
							<Link
								to={`/courses/${course.id}`}
								className="text-2xl font-semibold text-gray-800 hover:underline"
							>
								{course.title}
							</Link>
							<p className="text-gray-600 text-sm mt-2">{course.description}</p>
							<p className="text-sm text-gray-500 mt-4">{course.difficulty}</p>
							<div className="mt-auto">
								<Link
									to={`/courses/${course.id}`}
									className="btn btn-primary w-1/2 ml-auto flex items-center justify-center gap-2"
								>
									<FaBookOpen className="text-white" />
									Details
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CourseList;
