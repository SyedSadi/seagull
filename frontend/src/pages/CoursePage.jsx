import React from 'react';
import CourseDetails from '../components/Courses/CourseDetails';
import CourseContent from '../components/Courses/CourseContent';

const CoursePage = ({ match }) => {
  const { id } = match.params;

  return (
    <div>
      <CourseDetails id={id} />
      <CourseContent courseId={id} />
    </div>
  );
};

export default CoursePage;
