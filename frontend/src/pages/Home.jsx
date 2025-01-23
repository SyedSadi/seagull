import React, { useEffect, useState } from "react";
import Navbar from "../components/Shared/Navbar";
import Hero from "../components/LandingPage/Hero";
import TrendingCourses from "../components/LandingPage/TrendingCourses";

const Home = () => {
	return (
		<div>
			<Navbar />
			<Hero />
			<TrendingCourses />
		</div>
	);
};

export default Home;
