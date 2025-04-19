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
import QuizAttempt from "../../src/components/Quiz/QuizAttempt";

const Profile = () => {
	const { user } = useContext(AuthContext);
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("learning");

	useEffect(() => {
		if (!user) return;

		const fetchCourses = async () => {
			try {
				let response;
				if (user.role == "student") {
					response = await getEnrolledCourses();
					setCourses(response?.data);
				} else if (user.role == "instructor") {
					response = await getInstructorCourses();
					setCourses(response?.data?.courses || []);
				} else {
					setCourses([]);
				}
				console.log(response);
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
			<ul className="space-y-3">
				{courses?.map((course) => (
					<li
						key={course.id}
						className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
					>
						<div className="flex flex-col h-full">
							<h3 className="text-lg font-medium text-gray-900">
								{course.title}
							</h3>
							<p className="text-gray-500 text-sm mt-1">{course.subject}</p>

							{user.role === "instructor" && (
								<div className="mt-2 flex items-center">
									<span className="text-amber-400 mr-1">⭐</span>
									<span className="text-sm font-medium">
										{course.ratings?.toFixed(1) || "N/A"}
									</span>
								</div>
							)}

							<div className="mt-auto pt-4">
								<Link
									to={`/courseContents/${course.id}`}
									className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm group"
								>
									{user.role === "student" ? "Go to Course" : "View Course"}
									<FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
								</Link>
							</div>
						</div>
						<Link
							to={`/CourseContents/${course.id}`}
							className="btn btn-primary"
						>
							{user.role === "student" ? "Go to Course" : "View Course"}{" "}
							<FaArrowRight />
						</Link>
					</li>
				))}
			</ul>
		);
	};

	return (
		<div className="max-w-4xl mx-auto p-6 mt-8">
			{/* Profile Header */}
			<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm mb-8">
				<div className="flex flex-col md:flex-row md:items-center gap-6">
					<div className="bg-white p-5 rounded-full shadow-sm flex items-center justify-center">
						{user.role === "student" ? (
							<FaUserGraduate className="text-4xl text-blue-600" />
						) : (
							<FaChalkboardTeacher className="text-4xl text-indigo-600" />
						)}
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-800">
							{user.username}
						</h1>
						<div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mt-1 mb-2">
							{user.role.toUpperCase()}
						</div>
						<p className="text-gray-600">{user.email}</p>
						<p className="text-gray-600 mt-3 italic">
							{user.bio || "No bio available"}
						</p>
					</div>
				</div>
			</div>

			{/* Tabs Navigation - Only show Quiz History tab for students */}
			{user.role === "student" ? (
				<div className="flex mb-6 border-b border-gray-200">
					<button
						onClick={() => setActiveTab("learning")}
						className={`px-6 py-3 font-medium text-sm ${
							activeTab === "learning"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						My Learning
					</button>
					<button
						onClick={() => setActiveTab("quizzes")}
						className={`px-6 py-3 font-medium text-sm ${
							activeTab === "quizzes"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Quiz History
					</button>
				</div>
			) : (
				<h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center">
					<span className="border-b-2 border-blue-500 pb-1">My Courses</span>
				</h2>
			)}

			{/* Content based on active tab */}
			{user.role === "instructor" || activeTab === "learning" ? (
				<section className="mb-10">{renderCourses()}</section>
			) : (
				<section className="mb-6">
					<div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
						<QuizAttempt />
					</div>
				</section>
			)}
		</div>
	);
};

export default Profile;
