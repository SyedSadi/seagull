import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCourseDetailsById } from '../../services/coursesApi';
import { AuthContext } from '../../context/AuthContext';

const CourseContent = () => {
  const { id } = useParams(); // Get course ID from URL
  const [course, setCourse] = useState(null);
  const {user} = useContext(AuthContext)
  useEffect(() => {
      const fetchCourse = async () => {
        try {
          const data = await getCourseDetailsById(id);
          setCourse(data);
        } catch (error) {
          console.error('Error fetching course contents:', error);
        }
      };
  
      fetchCourse();
    }, [id]);
  
    if (!course) {
      return <div>Loading...</div>;
    }
  const contents = course.contents;
  return (
    <div className='bg-blue-400 p-16'>
      {user?.is_superuser && <Link className='my-4 bg-red-200 p-2' to={`/contents/manage/${course.id}`}>Manage Contents</Link>}
      <ul>
        {contents.map((content) => (
          <div key={content.id}>
            <li className='text-xl my-4'>
            <strong>Title: {content.title}</strong> - Type: {content.content_type}
            </li>
            {content.url && <a className='my-4 bg-red-200 p-2' href={content.url}>{content.content_type == "video" ? 'Watch' : 'PDF'}</a>}
          </div>          
        ))}
      </ul>
    </div>
  );
};

export default CourseContent;
