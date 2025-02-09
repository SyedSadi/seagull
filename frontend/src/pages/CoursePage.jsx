import React from 'react';
import CourseList from '../components/Courses/CourseList';

const CoursePage = () => {

  return (
    <div className='text-center bg-blue-200 px-8'>
      <h1 className='text-xl'>all courses page</h1>
      <CourseList />
    </div>
  );
};

export default CoursePage;
