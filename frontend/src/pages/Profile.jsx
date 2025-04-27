import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
	getEnrolledCourses,
} from "../services/coursesApi";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuizAttempt from "../../src/components/Quiz/QuizAttempt";
import ProfileSection from "../components/Profile/ProfileSection";
import { Helmet } from 'react-helmet-async';


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
					setCourses(response?.data);
				} else if (user.role === "instructor") {
					const allCourses = JSON.parse(localStorage.getItem("courses"))
					const instructorsCourses = allCourses.filter(c => c.created_by_details.id == user?.instructor.id)
					setCourses(instructorsCourses)
				} else {
					setCourses([]);
				}
			} catch (error) {
				console.error(error);
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
				<div className="animate-pulse text-lg font-medium text-gray-600">
					Loading...
				</div>
			</div>
		);
	}

	const renderCourses = () => {
		if (loading) {
			return <p className="text-center text-gray-500">Loading courses...</p>;
		}

		if (courses?.length === 0) {
			return (
				<p className="text-center text-gray-500">
					{user.role === "student"
						? "You are not enrolled in any courses."
						: user.role === "instructor"
						? "You have not created any courses yet."
						: ""}
				</p>
			);
		}

		return (
			<ul className="space-y-4">
				{courses.map((course) => (
					<li
						key={course.id}
						className="bg-white p-5 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300"
					>
						<h3 className="text-lg font-semibold text-gray-800">
							{course.title}
						</h3>
						<p className="text-gray-500 text-sm">{course.subject}</p>
						{user.role === "instructor" && (
							<div className="mt-2 flex items-center">
								<span className="text-amber-400 mr-1">⭐</span>
								<span className="text-sm font-medium">
									{course.ratings?.toFixed(1) || "N/A"}
								</span>
							</div>
						)}
						<div className="mt-4">
							<Link
								to={`/CourseContents/${course.id}`}
								className="btn btn-sm bg-blue-500 text-white inline-flex items-center gap-2"
							>
								{user.role === "student" ? "Go to Course" : "View Course"}
								<FaArrowRight />
							</Link>
						</div>
					</li>
				))}
			</ul>
		);
	};

	return (
		<>
		<Helmet>
		    <title>Profile | KUETx</title>
    	</Helmet>
		<div className="md:flex min-h-screen bg-gray-50">
			{/* Left Sidebar */}
			<aside className="w-full md:w-1/3 lg:w-1/4 p-4 bg-gradient-to-b from-blue-100 to-indigo-100 shadow-md">
				<ProfileSection />
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-6 space-y-8 bg-gradient-to-b from-blue-50 to-indigo-100">
				<div>
	
					<h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
						{user.role === "student" ? "My Learning" : "My Courses"}
					</h2>

					
					{renderCourses()}
				</div>

				{user.role === "student" && (
					<div className="mt-10">
						<h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
							Quiz History
						</h2>
						<div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
							<QuizAttempt />
						</div>
					</div>
				)}
			</main>
		</div>
		</>
	);
};

export default Profile;
