import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses } from '../../services/coursesApi';

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
      <ul className='grid grid-cols-4 gap-4'>
        {courses.map((course) => (
          // <li key={course.id} className='m-4'>
          //   <Link to={`/courses/${course.id}`}>{course.title}</Link>
          //    - {course.description}
          // </li>
          <div key={course.id} className="card bg-base-100 w-84 shadow-xl">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes" />
          </figure>
          <div className="card-body">
            <h3 className="text-left mb-2">#{course.subject}</h3>
            <Link to={`/courses/${course.id}`} className='hover:underline'><h2 className="card-title">{course.title}</h2></Link>
            <p className="text-left text-sm">{course.description}</p>
            <h3 className="text-left mt-4">{course.difficulty}</h3>
            <div className="card-actions justify-end">
              <Link to={`/courses/${course.id}`} className="btn btn-primary">Details</Link>
            </div>
          </div>
        </div>
          
        ))}
      </ul>
      {/* <h3>dfjlk</h3> */}
    </div>
  );
};

export default CourseList;
