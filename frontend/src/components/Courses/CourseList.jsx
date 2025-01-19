import React, { useEffect, useState } from 'react';
import { getAllCourses } from '../../services/api';
import { Link } from 'react-router-dom';

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className='bg-blue-400'>
      <h1 className='m-6 text-lg'>Available Courses</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.id} className='m-4'>
            <Link to={`/courses/${course.id}`}>{course.title}</Link>
             - {course.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
