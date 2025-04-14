import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCourses } from "../../services/coursesApi";
import { FaBookOpen } from "react-icons/fa"; // A book icon to represent the course

const CourseList = () => {
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const data = await getAllCourses();
				setCourses(data);
			} catch (error) {
				console.error("Error fetching courses:", error);
			}
		};

		fetchCourses();
	}, []);

	return (
		<div className="px-4 py-8 max-w-7xl mx-auto">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{courses.map((course) => (
					<div
						key={course.id}
						className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden"
					>
						<img
							className="w-full h-40 object-cover rounded-t-2xl"
							src={course.image}
							alt={course.title}
						/>
						<div className="p-4 flex flex-col flex-grow">
							<h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
							<p className="text-sm text-gray-600 mt-1 line-clamp-3">{course.description}</p>

							<span className="mt-3 inline-block bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full self-start">
								{course.subject}
							</span>

							<div className="mt-4 flex justify-end">
								<Link
									to={`/courses/${course.id}`}
									className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
								>
									<FaBookOpen className="text-white" />
									View Course
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
