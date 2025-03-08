import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CourseContent from './CourseContent';
import { getCourseDetailsById } from '../../services/coursesApi';

const CourseDetails = () => {
  const { id } = useParams(); // Get course ID from URL
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseDetailsById(id);
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) {
    return <div>Loading...</div>;
  }
  console.log(course)
  return (
    <div className='bg-red-200 p-16'>
      <section className="flex justify-between items-center">
        <div>
          <h1 className='text-5xl mb-4'>{course.title}</h1>
          <p className='text-lg my-4 text-gray-600'>{course.description}</p>
          <p className='text-lg my-4'>Duration: {course.duration} hours</p>
          <p className='text-lg my-4'>Ratings: {course.ratings}/5</p>
          <p className='text-lg my-4'>Difficulty: {course.difficulty.toUpperCase()}</p>
          <Link to={`/courseContents/${course.id}`} className='my-4 bg-red-600 p-2'>Enroll Now!</Link>
          <Link to={`/course/modify/${course.id}`} className='m-4 bg-red-600 p-2'>Edit Course</Link>
        </div>  
        <div>
        <img width="400px" height="400px" src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="course-img" />
        </div>
      </section>

      {/* <CourseContent course={course}></CourseContent> */}
    </div>
  );
};

export default CourseDetails;
