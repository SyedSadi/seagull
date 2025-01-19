import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseDetailsById } from '../../services/api';
import CourseContent from './CourseContent';

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
  return (
    <div className='text-center bg-blue-200'>
      <h1>Course Details</h1>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>Duration: {course.duration} hours</p>
      <p>Ratings: {course.ratings}/5</p>
      <p>Difficulty: {course.difficulty}</p>

      <CourseContent contents={course.contents}></CourseContent>
    </div>
  );
};

export default CourseDetails;
