import React from 'react';
import CourseList from '../components/Courses/CourseList';
import { Link } from 'react-router-dom';

const CoursePage = () => {

  return (
    <div className='text-center bg-blue-200 px-8'>
      <h1 className='text-xl'>all courses page</h1>
      <Link className='my-4 bg-red-200 p-2' to={'/add-courses'}>Add New Course</Link>
      <CourseList />
    </div>
  );
};

export default CoursePage;
