import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChalkboardTeacher,
	faUserGraduate,
	faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const TargetAudience = () => {
	const audiences = [
		{
			icon: faUserGraduate,
			title: "For Students",
			benefits: [
				"Access quality education",
				"Learn at your own pace",
				"Interactive learning experience",
				"Track your progress",
			],
		},
		{
			icon: faChalkboardTeacher,
			title: "For Instructors",
			benefits: [
				"Create and manage course content",
				"Track student progress",
				"Engage with learners directly",
				"Earn from your expertise",
			],
		},
		{
			icon: faBuilding,
			title: "For Institutions",
			benefits: [
				"Comprehensive admin tools",
				"Detailed analytics",
				"Custom branding options",
				"Scalable solutions",
			],
		},
	];

	return (
		<section className="py-10 bg-gradient-to-b from-white to-gray-50">
			<div className="container mx-auto px-4">
				<div className="text-center mb-6">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						For <span className="text-blue-600">Whom</span> It&apos;s Built?
					</h2>
					<p className="text-gray-600 text-lg max-w-2xl mx-auto">
						Tailored solutions for everyone in the education ecosystem
					</p>
				</div>

				{/* Desktop View */}
				<div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{audiences.map((audience, index) => (
						<div
							key={index}
							className="group bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
						>
							<div className="flex flex-col items-center text-center">
								<div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
									<FontAwesomeIcon
										icon={audience.icon}
										className="text-blue-600 text-4xl"
									/>
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-4">
									{audience.title}
								</h3>
								<ul className="space-y-3">
									{audience.benefits.map((benefit, idx) => (
										<li key={idx} className="text-gray-600 text-sm">
											{benefit}
										</li>
									))}
								</ul>
							</div>
						</div>
					))}
				</div>

				{/* Mobile Swiper */}
				<div className="md:hidden">
					<Swiper
						modules={[Pagination, Navigation]}
						spaceBetween={20}
						slidesPerView={1.2}
						centeredSlides={true}
						pagination={{ clickable: true }}
						navigation
						className="pb-12"
					>
						{audiences.map((audience, index) => (
							<SwiperSlide key={index}>
								<div className="group bg-white p-8 rounded-lg shadow-sm">
									<div className="flex flex-col items-center text-center">
										<div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
											<FontAwesomeIcon
												icon={audience.icon}
												className="text-blue-600 text-4xl"
											/>
										</div>
										<h3 className="text-xl font-semibold text-gray-900 mb-4">
											{audience.title}
										</h3>
										<ul className="space-y-3">
											{audience.benefits.map((benefit, idx) => (
												<li key={idx} className="text-gray-600 text-sm">
													{benefit}
												</li>
											))}
										</ul>
									</div>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</section>
	);
};

export default TargetAudience;
