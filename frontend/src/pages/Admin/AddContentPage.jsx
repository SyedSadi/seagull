import { useState, useEffect, useContext } from 'react';
import API from '../../services/api';
import AdminLayout from '../../components/Admin/AdminLayout';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../context/AuthContext';

const AddContentPage = () => {
  const {user} = useContext(AuthContext)
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [contentData, setContentData] = useState({
    title: '',
    content_type: 'video',
    url: '',
    text_content: '',
    order: 0,
  });

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("courses"))
    if(user.role === "instructor"){
              const instructorCourses = c.filter(item => item.created_by_details.id === user?.instructor.id)
              setCourses(instructorCourses)
          } else setCourses(c)
  }, []);

  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourseId) {
      toast.error('Please select a course first.');
      return;
    }

    try {
      const newContent = {
        ...contentData,
        course: selectedCourseId,
      };

      const response = await API.post('/courses/content/add/', newContent);
      console.log(response)
      toast.success('Content added successfully!');
      setContentData({
        title: '',
        content_type: 'video',
        url: '',
        text_content: '',
      }); // reset form
    } catch (error) {
      console.error('Error adding content:', error.response.data.non_field_errors[0]);
      toast.error(`Failed to add content, ${error.response.data.non_field_errors[0]}`);
    }
  };

  return (
    <AdminLayout>
      <Helmet>
		    <title>Add Content | KUETx</title>
    	</Helmet>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add New Content</h1>

        <select
          value={selectedCourseId}
          onChange={handleCourseChange}
          className="p-2 border rounded mb-6"
        >
          <option value="">Select a course</option>
          {
            loading ? <option>Loading...</option> :
            courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))
          }
        </select>

        {selectedCourseId && (
          <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block font-semibold mb-1">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={contentData.title}
              onChange={handleInputChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>
        
          <div className="mb-6">
            <label htmlFor="content_type" className="block font-semibold mb-1">Content Type</label>
            <select
              id="content_type"
              name="content_type"
              value={contentData.content_type}
              onChange={handleInputChange}
              className="p-2 border rounded w-full"
            >
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="article">Article</option>
            </select>
          </div>
        
          <div className="mb-6">
            <label htmlFor="url" className="block font-semibold mb-1">URL (optional)</label>
            <input
              id="url"
              type="url"
              name="url"
              value={contentData.url}
              onChange={handleInputChange}
              className="p-2 border rounded w-full"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="order" className="block font-semibold mb-1">Order</label>
            <input
              id="order"
              type="order"
              name="order"
              value={contentData.order}
              onChange={handleInputChange}
              className="p-2 border rounded w-full"
            />
          </div>
        
          <div className="mb-6">
            <label htmlFor="text_content" className="block font-semibold mb-1">Text Content (optional)</label>
            <textarea
              id="text_content"
              name="text_content"
              value={contentData.text_content}
              onChange={handleInputChange}
              className="p-2 border rounded w-full"
              rows="4"
            />
          </div>
        
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
            Add Content
          </button>
        </form>      
          
        )}
      </div>
    </AdminLayout>
  );
};

export default AddContentPage;
