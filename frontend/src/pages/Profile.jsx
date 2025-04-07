import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
	getEnrolledCourses,
	getInstructorCourses,
} from "../services/coursesApi";
import { Link } from "react-router-dom";
import {
	FaArrowRight,
	FaUserGraduate,
	FaChalkboardTeacher,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
	const { user } = useContext(AuthContext);
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) return;

		const fetchCourses = async () => {
			try {
				let response;
				if (user.role === "student") {
					response = await getEnrolledCourses();
				} else if (user.role === "instructor") {
					response = await getInstructorCourses();
				}

				setCourses(response.data || []);
			} catch (error) {
				console.error("Error fetching courses:", error);
				toast.error("Failed to fetch courses.");
			} finally {
				setLoading(false);
			}
		};

		fetchCourses();
	}, [user]);

	if (!user) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	let content;

	if (loading) {
		content = <p className="text-center text-gray-500">Loading courses...</p>;
	} else if (courses.length > 0) {
		content = (
			<ul className="space-y-3">
				{courses.map((course) => (
					<li
						key={course.id}
						className="flex justify-between items-center p-3 border rounded-lg"
					>
						<div>
							<h3 className="text-lg font-medium">{course.title}</h3>
							<p className="text-gray-500">{course.subject}</p>
							{user.role === "instructor" && (
								<p className="text-sm text-gray-600">
									Rating: {course.ratings.toFixed(1)} ⭐
								</p>
							)}
						</div>
						<Link
							to={`/courseContents/${course.id}`}
							className="btn btn-primary"
						>
							{user.role === "student" ? "Go to Course" : "View Course"}{" "}
							<FaArrowRight />
						</Link>
					</li>
				))}
			</ul>
		);
	} else {
		content = (
			<p className="text-center text-gray-500">
				{user.role === "student"
					? "You are not enrolled in any courses."
					: "You have not created any courses yet."}
			</p>
		);
	}


	return (
		<div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
			<div className="bg-blue-100 p-4 rounded-lg">
				<div className="flex items-center gap-4">
					{user.role === "student" ? (
						<FaUserGraduate className="text-4xl text-primary" />
					) : (
						<FaChalkboardTeacher className="text-4xl text-primary" />
					)}
					<div>
						<h1 className="text-2xl font-bold">{user.username}</h1>
						<p className="text-gray-600">{user.role.toUpperCase()}</p>
						<p className="text-gray-500">{user.email}</p>
					</div>
				</div>

				<div className="mt-4">
					<h2 className="text-lg font-semibold">Bio</h2>
					<p className="text-gray-600">{user.bio || "No bio available"}</p>
				</div>
			</div>

			{/* Courses Section */}
			<div className="mt-6">
				<h2 className="text-xl font-semibold mb-3 text-center">
					{user.role === "student" ? "Enrolled Courses" : "Courses Taught"}
				</h2>
				{content}
			</div>
		</div>
	);
};

export default Profile;
