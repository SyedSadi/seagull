import React from "react";
import Navbar from "../components/Shared/Navbar";
import Hero from "../components/LandingPage/Hero";
import FeaturedCourses from "../components/LandingPage/FeaturedCourses";

const Home = () => {
	return (
		<div>
			<Navbar />
			<Hero />
			<FeaturedCourses />
		</div>
	);
};

export default Home;
