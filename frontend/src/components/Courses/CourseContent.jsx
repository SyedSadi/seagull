import React from 'react';

const CourseContent = ({ contents }) => {
  console.log(contents)
  return (
    <div className='bg-blue-400'>
      <h2 style={{marginTop: '50px'}}>Course Contents</h2>
      <ul>
        {contents.map((content) => (
          <li key={content.id}>
            <strong>{content.title}</strong> - {content.content_type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseContent;
