import Hero from "../components/LandingPage/Hero";
import FeaturedCourses from "../components/LandingPage/FeaturedCourses";
import WhyChooseUs from "../components/LandingPage/WhyChooseUs";
import ForWhome from "../components/LandingPage/ForWhom";
import Statistics from "../components/LandingPage/Statistics";
import ForumPreview from "../components/LandingPage/ForumPreview";
import { Helmet } from 'react-helmet-async';

const Home = () => {
	return (
		<div>
			<Helmet>
		    	<title>KUETx</title>
    		</Helmet>
			<Hero />
			<section className="px-0 md:px-16">
				<FeaturedCourses />
				<WhyChooseUs />
				<ForWhome />
				<Statistics />
				<ForumPreview />
			</section>
		</div>
	);
};

export default Home;
