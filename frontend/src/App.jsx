import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CoursePage from './pages/CoursePage';

const App = () => {
  return (
    <>
    <div className='bg-blue-200 text-blue-800 text-center'>Learning Management System</div>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses/:id" element={<CoursePage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App