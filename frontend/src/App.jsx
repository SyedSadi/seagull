import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';

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

export default App