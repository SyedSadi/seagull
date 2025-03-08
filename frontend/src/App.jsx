import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Shared/Footer";
import Navbar from "./components/Shared/Navbar";

const App = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}
export default App;
