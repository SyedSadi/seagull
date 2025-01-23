// TrendingCourses.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar,
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

//implement data fetching logic here.

const coursesData = [
	{
		id: 1,
		title: "React Fundamentals Masterclass",
		subject: "Web Development",
		description:
			"Dive deep into React ecosystem, learn component architecture, state management, hooks, and build scalable web applications from scratch. Master modern React practices and industry-standard development workflows.",
		difficulty: "Intermediate",
		rating: 4.5,
	},
	{
		id: 2,
		title: "Python Data Science Bootcamp",
		subject: "Data Science",
		description:
			"Comprehensive Python programming for data analysis. Learn NumPy, Pandas, Matplotlib, machine learning algorithms, data visualization techniques, and build real-world predictive models using scikit-learn and TensorFlow.",
		difficulty: "Advanced",
		rating: 4.8,
	},
	{
		id: 3,
		title: "UX Design Professional Course",
		subject: "Design",
		description:
			"Comprehensive UX design journey covering user research, wireframing, prototyping, interaction design, accessibility principles, and creating intuitive digital experiences. Learn industry-standard tools like Figma and Adobe XD.",
		difficulty: "Beginner",
		rating: 4.3,
	},
];

// Individual Course Card Component
const CourseCard = ({ course }) => {
	return (
		<div className="bg-white rounded-lg shadow-lg p-6 space-y-4 w-full">
			<div className="flex items-center">
				<div>
					<h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
					<p className="text-sm text-gray-500">{course.subject}</p>
				</div>
			</div>

			<p className="text-gray-600 line-clamp-6">{course.description}</p>

			<div className="flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<span
						className={`
              text-sm font-semibold px-2 py-1 rounded-full
              ${
								course.difficulty === "Beginner"
									? "bg-green-100 text-green-800"
									: course.difficulty === "Intermediate"
									? "bg-yellow-100 text-yellow-800"
									: "bg-red-100 text-red-800"
							}
            `}
					>
						{course.difficulty}
					</span>
					<div className="flex items-center text-yellow-500">
						<FontAwesomeIcon icon={faStar} size="16" fill="currentcolour" />
						<span className="ml-1 text-sm">{course.rating}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

const TrendingCourses = () => {
	// State to manage current course in mobile view
	const [currentCourseIndex, setCurrentCourseIndex] = useState(0);

	//Right arrow click
	const handleNext = () => {
		setCurrentCourseIndex((prev) => (prev + 1) % coursesData.length);
	};

	//left arrow click
	const handlePrev = () => {
		setCurrentCourseIndex((prev) =>
			prev === 0 ? coursesData.length - 1 : prev - 1
		);
	};

	return (
		<section className="container mx-auto px-4 py-16 bg-gray-50">
			<h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
				Trending Courses
			</h2>

			{/* Desktop grid layout */}
			<div className="hidden md:grid md:grid-cols-3 gap-8">
				{coursesData.map((course) => (
					<CourseCard key={course.id} course={course} />
				))}
			</div>

			{/* Mobile Carousel */}
			<div className="md:hidden relative flex items-center justify-center">
				<button
					onClick={handlePrev}
					className="absolute left-0 z-10 p-1 bg-gray-200 rounded-full"
				>
					<FontAwesomeIcon icon={faChevronLeft} />
				</button>

				<div className="w-full max-w-md">
					<CourseCard course={coursesData[currentCourseIndex]} />
				</div>

				<button
					onClick={handleNext}
					className="absolute right-0 z-10 p-1 bg-gray-200 rounded-full"
				>
					<FontAwesomeIcon icon={faChevronRight} />
				</button>

				{/* Pagination Dots */}
				<div className="absolute bottom-[-30px] flex space-x-2">
					{coursesData.map((_, index) => (
						<span
							key={index}
							className={`
                h-2 w-2 rounded-full 
                ${index === currentCourseIndex ? "bg-blue-600" : "bg-gray-300"}
              `}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default TrendingCourses;
