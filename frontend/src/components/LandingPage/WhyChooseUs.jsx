import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faGraduationCap,
	faUsers,
	faChartLine,
	faClock,
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const WhyChooseUs = () => {
	const [currentSlide, setCurrentSlide] = useState(0);

	const features = [
		{
			icon: faGraduationCap,
			title: "Expert-Led Learning",
			description:
				"Learn from industry professionals and experienced educators",
		},
		{
			icon: faUsers,
			title: "Interactive Community",
			description: "Engage with peers through forums and discussions",
		},
		{
			icon: faChartLine,
			title: "Track Progress",
			description: "Monitor your learning journey",
		},
		{
			icon: faClock,
			title: "Learn at Your Pace",
			description: "Flexible learning schedule that fits your lifestyle",
		},
	];

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev === features.length - 1 ? 0 : prev + 1));
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev === 0 ? features.length - 1 : prev - 1));
	};

	return (
		<section className="py-10 bg-gray-50">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="text-center max-w-2xl mx-auto mb-6">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Why <span className="text-blue-600">Choose</span> KUETx?
					</h2>
					<p className="text-gray-600 text-lg">
						Discover the advantages that make our platform stand out
					</p>
				</div>

				{/* Desktop View */}
				<div className="hidden lg:grid grid-cols-4 gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							className="group p-8 text-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
						>
							<div className="inline-block p-4 rounded-full bg-blue-50 text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
								<FontAwesomeIcon icon={feature.icon} size="2x" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-3">
								{feature.title}
							</h3>
							<p className="text-gray-600">{feature.description}</p>
						</div>
					))}
				</div>

				{/* Mobile Slider */}
				<div className="lg:hidden relative">
					<div className="overflow-hidden">
						<div
							className="flex transition-transform duration-300 ease-out"
							style={{
								transform: `translateX(-${currentSlide * 100}%)`,
							}}
						>
							{features.map((feature, index) => (
								<div
									key={index}
									className="w-full flex-shrink-0 p-8 text-center bg-white rounded-lg shadow-sm"
								>
									<div className="inline-block p-4 rounded-full bg-blue-50 text-blue-600 mb-4">
										<FontAwesomeIcon icon={feature.icon} size="2x" />
									</div>
									<h3 className="text-xl font-semibold text-gray-900 mb-3">
										{feature.title}
									</h3>
									<p className="text-gray-600">{feature.description}</p>
								</div>
							))}
						</div>
					</div>

					{/* Navigation Arrows */}
					<button
						onClick={prevSlide}
						className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-md text-blue-600 hover:text-blue-700 transition-colors"
						aria-label="Previous slide"
					>
						<FontAwesomeIcon icon={faChevronLeft} />
					</button>
					<button
						onClick={nextSlide}
						className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white p-2 rounded-full shadow-md text-blue-600 hover:text-blue-700 transition-colors"
						aria-label="Next slide"
					>
						<FontAwesomeIcon icon={faChevronRight} />
					</button>

					{/* Dots Indicator */}
					<div className="flex justify-center mt-6 space-x-2">
						{features.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentSlide(index)}
								className={`w-2 h-2 rounded-full transition-all duration-300 ${
									currentSlide === index ? "bg-blue-600 w-4" : "bg-gray-300"
								}`}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default WhyChooseUs;
