import { Outlet } from "react-router-dom";
import Footer from "./components/Shared/Footer";
import Navbar from "./components/Shared/Navbar";
import ScrollToTop from "./components/Shared/ScrollToTop";
import { useEffect } from "react";
import { getAllCourses } from "./services/coursesApi";

const App = () => {
	useEffect(() => {
		const fetchCourses = async () => {
			await getAllCourses()
		}
		fetchCourses()
	},[])

	return (
		<div className="bg-gray-100">
			<ScrollToTop />
			<Navbar />
			<Outlet />
			<Footer />
		</div>
	);
};
export default App;
