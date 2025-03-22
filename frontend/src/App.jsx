import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Shared/Footer";
import Navbar from "./components/Shared/Navbar";

const App = () => {
  return (
    <div className='bg-gray-100'>
      <Navbar/>
      <div className="container mx-auto p-6">
        <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}
export default App;
