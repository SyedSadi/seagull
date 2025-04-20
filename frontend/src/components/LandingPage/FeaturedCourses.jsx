import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { getAllCourses } from "../../services/coursesApi";
import PropTypes from "prop-types";
import _ from "lodash";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay"; // If using autoplay

const LoadingSkeleton = () => (
	<div className="bg-white rounded-lg shadow-md p-4 animate-pulse h-full">
		{" "}
		<div className="h-40 bg-gray-200 rounded mb-4"></div>
		<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
		<div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>{" "}
		<div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>{" "}
	</div>
);

const CourseCard = ({ course }) => (
	<div className="bg-white rounded-lg shadow-md hover:scale-105 transition duration-300 flex flex-col h-full overflow-hidden">
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
						course.difficulty === "Beginner" || course.difficulty === "beginner"
							? "bg-green-100 text-green-800"
							: course.difficulty === "Intermediate" ||
							  course.difficulty === "intermediate"
							? "bg-yellow-100 text-yellow-800"
							: course.difficulty === "Advanced" ||
							  course.difficulty === "advanced"
							? "bg-red-100 text-red-800"
							: "bg-gray-100 text-gray-800" // Fallback
					}`}
				>
					{_.capitalize(course.difficulty) || "N/A"}
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
);

// --- Main Featured Courses Component ---
const FeaturedCourses = () => {
	const [allCourses, setAllCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch courses
	useEffect(() => {
		const fetchCourses = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await getAllCourses();
				setAllCourses(data || []); // Ensure data is an array
			} catch (err) {
				console.error("Failed to load courses:", err);
				setError("Could not fetch courses. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchCourses();
	}, []);

	// --- Derived Course Lists ---
	const latestCourses = allCourses.sort((a, b) => b.id - a.id).slice(0, 4); // Taking the last 4 as "Latest"

	// Logic for "Top Rated": Sort by rating descending.
	const topRatedCourses = [...allCourses]
		.sort((a, b) => (b.ratings || 0) - (a.ratings || 0))
		.slice(0, 4);

	// --- Swiper Configuration ---
	const swiperOptions = {
		modules: [Pagination, Autoplay],
		slidesPerView: 1.2, // Show 1 full and a bit of the next card
		spaceBetween: 16, // Gap between slides
		centeredSlides: false, // Start from left
		loop: false, // Set to true for infinite circular sliding
		pagination: {
			clickable: true,
			dynamicBullets: true, // Makes pagination dots nicer
		},
		// Responsive breakpoints
		breakpoints: {
			// Small devices (e.g., landscape phones)
			640: {
				slidesPerView: 2.2,
				spaceBetween: 20,
			},
		},
	};

	// --- Rendering Logic ---
	const renderCourseList = (courses, title) => {
		if (!courses || courses.length === 0) {
			return null; // Don't render section if no courses
		}

		return (
			<div className="max-w-full mb-20">
				{" "}
				<h2 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-10 px-4">
					{title}
				</h2>
				{/* Mobile Slider View (using Swiper)*/}
				<div className="md:hidden px-4">
					{" "}
					<Swiper {...swiperOptions} className="pb-10">
						{" "}
						{courses?.map((course) => (
							<SwiperSlide key={course.id} className="h-auto">
								{" "}
								<CourseCard course={course} />
							</SwiperSlide>
						))}
					</Swiper>
				</div>
				{/* Desktop Grid View*/}
				<div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
					{courses?.map((course) => (
						<CourseCard key={course.id} course={course} />
					))}
				</div>
			</div>
		);
	};

	if (loading) {
		// Show more skeletons matching the potential final layout
		return (
			<section className="py-12 px-4 bg-gray-50">
				{" "}
				<div className="max-w-7xl mx-auto">
					<div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-10 animate-pulse"></div>{" "}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{[1, 2, 3, 4].map((n) => (
							<LoadingSkeleton key={n} />
						))}
					</div>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="py-12 px-4 text-center text-red-600">
				<p>{error}</p>
			</section>
		);
	}

	if (allCourses.length === 0) {
		return (
			<section className="py-12 px-4 text-center text-gray-500">
				<p>No courses available at the moment.</p>
			</section>
		);
	}

	return (
		<section className="pt-12">
			{" "}
			{renderCourseList(
				latestCourses,
				<>
					<span className="text-blue-600">Latest</span> Courses
				</>
			)}
			{renderCourseList(
				topRatedCourses,
				<>
					<span className="text-blue-600">Top Rated</span> Courses
				</>
			)}
		</section>
	);
};

CourseCard.propTypes = {
	course: PropTypes.shape({
		title: PropTypes.string,
		description: PropTypes.string,
		image: PropTypes.string,
		difficulty: PropTypes.string,
		ratings: PropTypes.number,
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	}),
};

export default FeaturedCourses;
