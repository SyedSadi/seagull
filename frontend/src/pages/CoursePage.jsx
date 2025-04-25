import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CourseList from "../components/Courses/CourseList";
import { Helmet } from 'react-helmet-async';
import { FaSearch } from "react-icons/fa";

const CoursePage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [localSearch, setLocalSearch] = useState(
		searchParams.get("search") || ""
	);

	const handleLocalSearch = (e) => {
		e.preventDefault();
		setSearchParams(localSearch ? { search: localSearch } : {});
	};

	return (
		<div>
			<Helmet>
		        <title>Courses | KUETx</title>
    		</Helmet>
			<div className="my-8 flex justify-between items-center px-10 pb-12">
				<div>
					<h1 className="text-3xl font-bold">KUETx Courses</h1>
					<p className="text-lg pt-6">
						Choose courses to learn from our world class instructors
					</p>
				</div>
				{/* Search Bar */}
				<form onSubmit={handleLocalSearch} className="max-w-2xl ml-auto">
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
							className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<FaSearch />
						</button>
					</div>
				</form>
			</div>
			<CourseList />
		</div>
	);
};

export default CoursePage;
