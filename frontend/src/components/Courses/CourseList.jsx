import React, { useEffect, useState } from 'react';
import { getCourses } from '../../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Available Courses</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.course_id}>
            {course.title} - {course.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
