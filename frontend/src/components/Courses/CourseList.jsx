import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCourses } from "../../services/coursesApi";
import { FaBookOpen } from "react-icons/fa"; // A book icon to represent the course
import { FiSearch } from "react-icons/fi"; 

const CourseList = () => {
	const [courses, setCourses] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");


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
		<div className="px-4 py-10 max-w-7xl mx-auto">
  {/* Search Input */}
  <div className="mb-8 max-w-md mx-auto relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Looking for something to learn?"
        className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    </div>

  {/* Course Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
    {courses
      .filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
        >
          <img
            className="w-full h-40 object-cover rounded-t-2xl"
            src={course.image}
            alt={course.title}
          />

          <div className="h-[1px] bg-gray-200 mx-4 mt-2 mb-0" />

          <div className="p-4 flex flex-col flex-grow">
            <h2 className="text-base font-semibold text-gray-800 leading-snug">{course.title}</h2>
            <p className="text-sm text-gray-600 mt-1 line-clamp-3">{course.description}</p>

            <Link
              to={`/courses/subject/${course.subject}`}
              className="mt-3 inline-block bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full self-start hover:underline hover:bg-blue-100"
            >
              {course.subject}
            </Link>

            <div className="mt-auto flex justify-end pt-4">
              <Link
                to={`/courses/${course.id}`}
                className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline"
              >
                <FaBookOpen className="text-blue-600" />
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
