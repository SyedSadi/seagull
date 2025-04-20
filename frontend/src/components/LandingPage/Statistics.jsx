import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUserGraduate,
	faChalkboardTeacher,
	faBookOpen,
	faPuzzlePiece,
} from "@fortawesome/free-solid-svg-icons";
import API from "../../services/api";

const Statistics = () => {
	const [stats, setStats] = useState({
		total_students: 0,
		total_instructors: 0,
		total_courses: 0,
		total_quizzes: 0,
	});

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await API.get("/landingpage/stats/");
				setStats(response.data.data);
			} catch (error) {
				console.error("Error fetching stats:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, []);

	const statItems = [
		{
			icon: faBookOpen,
			label: "Courses Offered",
			value: stats.total_courses,
			color: "bg-purple-500",
		},
		{
			icon: faPuzzlePiece,
			label: "Total Quizzes",
			value: stats.total_quizzes,
			color: "bg-orange-500",
		},
		{
			icon: faUserGraduate,
			label: "Active Students",
			value: stats.total_students,
			color: "bg-blue-500",
		},
		{
			icon: faChalkboardTeacher,
			label: "Expert Instructors",
			value: stats.total_instructors,
			color: "bg-green-500",
		},
	];
	return (
		<section className="py-10 bg-gray-50">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12 md:mb-20">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Our <span className="text-blue-600">Growing</span> Community
					</h2>
				</div>

				{/* Desktop Grid View */}
				<div className="hidden lg:grid lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
					{statItems.map((item, index) => (
						<div
							key={index}
							className="relative bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300"
						>
							<div
								className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ${item.color} text-white p-4 rounded-full shadow-lg`}
							>
								<FontAwesomeIcon icon={item.icon} size="lg" />
							</div>
							<div className="mt-8 text-center">
								<div className="text-4xl font-bold text-gray-900 mb-2">
									{isLoading ? (
										<div className="animate-pulse h-8 w-16 bg-gray-200 rounded mx-auto"></div>
									) : (
										item.value.toLocaleString()
									)}
								</div>
								<p className="text-gray-600 font-medium">{item.label}</p>
							</div>
						</div>
					))}
				</div>

				{/* Mobile List View */}
				<div className="lg:hidden space-y-4 max-w-md mx-6">
					{statItems.map((item, index) => (
						<div
							key={index}
							className="flex items-center bg-white rounded-xl shadow-md p-4 transform hover:scale-102 transition-transform duration-300"
						>
							<div className="flex-grow">
								<div className="font-bold text-2xl md:text-3xl text-gray-900">
									{isLoading ? (
										<div className="animate-pulse h-6 w-24 bg-gray-200 rounded"></div>
									) : (
										item.value.toLocaleString()
									)}
								</div>
								<p className="text-gray-600 text-sm md:text-base">
									{item.label}
								</p>
							</div>
							<div
								className={`${item.color} text-white p-4 rounded-xl shadow-md mr-4 flex-shrink-0`}
							>
								<FontAwesomeIcon icon={item.icon} size="1x" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Statistics;
