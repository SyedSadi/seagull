import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCourseDetailsById } from '../../services/coursesApi';
import { AuthContext } from '../../context/AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const { user } = useContext(AuthContext);

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
  // console.log(course, user)
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
          {user && <Link to={`/course/modify/${course.id}`} className='m-4 bg-red-600 p-2'>Edit Course</Link>}
        </div>  
        <div>
        <img width="400px" height="400px" src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="course-img" />
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;
