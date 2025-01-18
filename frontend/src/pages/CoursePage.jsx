import React from 'react';
import CourseDetails from '../components/Courses/CourseDetails';
import CourseContent from '../components/Courses/CourseContent';
import { useParams } from 'react-router-dom';

const CoursePage = () => {
  const { id } = useParams;

  return (
    <div>
      <CourseDetails id={id} />
      <CourseContent courseId={id} />
    </div>
  );
};

export default CoursePage;
