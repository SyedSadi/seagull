import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById } from '../../services/api';

const CourseDetails = () => {
  const { id } = useParams(); // Get course ID from URL
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id);
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
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>Duration: {course.duration} hours</p>
      <p>Ratings: {course.ratings}/5</p>
      <p>Difficulty: {course.difficulty}</p>
    </div>
  );
};

export default CourseDetails;
