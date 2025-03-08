import React from 'react';
import { Link } from 'react-router-dom';

const CourseContent = ({ course }) => {
  const contents = course.contents;
  console.log(course)
  return (
    <div className='bg-blue-400 p-4'>
      <h2 style={{marginTop: '50px'}}>Course Contents</h2>
      <Link className='my-4 bg-red-200 p-2' to={`/contents/manage/${course.id}`}>Manage Contents</Link>
      <ul>
        {contents.map((content) => (
          <div key={content.id}>
            <li className='text-xl'>
            <strong>Title: {content.title}</strong> - Type: {content.content_type}
            </li>
            {content.url && <a className='my-4 bg-red-200 p-2' href={content.url}>URL</a>}
          </div>          
        ))}
      </ul>
    </div>
  );
};

export default CourseContent;
