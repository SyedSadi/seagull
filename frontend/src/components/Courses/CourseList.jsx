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
		<div>
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
