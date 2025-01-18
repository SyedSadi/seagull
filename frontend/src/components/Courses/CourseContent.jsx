import React, { useEffect, useState } from 'react';
import { getCourseContents } from '../../services/api';

const CourseContent = ({ courseId }) => {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data = await getCourseContents(courseId);
        setContents(data);
      } catch (error) {
        console.error('Error fetching course contents:', error);
      }
    };

    fetchContents();
  }, [courseId]);

  return (
    <div>
      <h2>Course Contents</h2>
      <ul>
        {contents.map((content) => (
          <li key={content.content_id}>
            <strong>{content.title}</strong> - {content.content_type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseContent;
