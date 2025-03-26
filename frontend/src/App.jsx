import { Outlet } from "react-router-dom";
import Footer from "./components/Shared/Footer";
import Navbar from "./components/Shared/Navbar";

const App = () => {
	return (
		<div className="bg-gray-100">
			<Navbar />
			<Outlet />
			<Footer />
		</div>
	);
};
export default App;
