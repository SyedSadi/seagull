import { Outlet } from "react-router-dom";
import Footer from "./components/Shared/Footer";
import Navbar from "./components/Shared/Navbar";
import ScrollToTop from "./components/Shared/ScrollToTop";

const App = () => {
	return (
		<div className="bg-gray-100">
			<ScrollToTop/>
			<Navbar />
			<Outlet />
			<Footer />
		</div>
	);
};
export default App;
