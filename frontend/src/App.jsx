import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Shared/Footer";

const App = () => {
	return (
		<>
			<Outlet />
			<Footer />
		</>
	);
};

export default App;
