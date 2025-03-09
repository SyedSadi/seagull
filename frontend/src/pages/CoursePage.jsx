import React, { useContext } from 'react';
import CourseList from '../components/Courses/CourseList';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CoursePage = () => {
  const {user} = useContext(AuthContext)
  return (
    <div className='text-center bg-blue-200 px-8'>
      <h1 className='p-6 text-2xl'>Available Courses</h1>
      {user && <Link className='bg-red-200 p-2' to={'/add-courses'}>Add New Course</Link>}
      <CourseList />
    </div>
  );
};

export default CoursePage;
