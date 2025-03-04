import React, { useEffect, useState } from 'react';
import { getAllCourses } from '../../services/api';
import { Link } from 'react-router-dom';

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data.results);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);
  console.log(courses)

  return (
    // <div className='bg-blue-400'>
    //   <h1 className='m-6 text-lg'>Available Courses</h1>
      
    //   <ul className='grid grid-cols-4 gap-4'>
    //     {courses.map((course) => (
    //       // <li key={course.id} className='m-4'>
    //       //   <Link to={`/courses/${course.id}`}>{course.title}</Link>
    //       //    - {course.description}
    //       // </li>
    //       <div key={course.id} className="card bg-base-100 w-96 shadow-xl">
    //       <figure>
    //         <img
    //           src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
    //           alt="Shoes" />
    //       </figure>
    //       <div className="card-body">
    //         <h2 className="card-title">{course.title}</h2>
    //         <p>{course.description}</p>
    //         <div className="card-actions justify-end">
    //           <Link to={`/courses/${course.id}`} className="btn btn-primary">view more</Link>
    //         </div>
    //       </div>
    //     </div>
          
    //     ))}
    //   </ul>
    // </div>
    <h3>dfjalskfj</h3>
  );
};

export default CourseList;
