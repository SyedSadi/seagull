import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faGraduationCap,
	faUsers,
	faChartLine,
	faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const WhyChooseUs = () => {
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

	return (
		<section className="pb-10 bg-gray-50">
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

				{/* Mobile Swiper */}
				<div className="lg:hidden">
					<Swiper
						modules={[Pagination, Navigation]}
						spaceBetween={20}
						slidesPerView={1.2}
						centeredSlides={true}
						pagination={{ clickable: true }}
						navigation
						className="pb-12"
					>
						{features.map((feature, index) => (
							<SwiperSlide key={index}>
								<div className="p-8 text-center bg-white rounded-lg shadow-sm">
									<div className="inline-block p-4 rounded-full bg-blue-50 text-blue-600 mb-4">
										<FontAwesomeIcon icon={feature.icon} size="2x" />
									</div>
									<h3 className="text-xl font-semibold text-gray-900 mb-3">
										{feature.title}
									</h3>
									<p className="text-gray-600">{feature.description}</p>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</section>
	);
};

export default WhyChooseUs;
