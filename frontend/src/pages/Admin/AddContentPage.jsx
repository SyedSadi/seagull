import { useState, useEffect } from 'react';
import API from '../../services/api';
import AdminLayout from '../../components/Admin/AdminLayout';
import { toast } from 'react-toastify';

const AddContentPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [contentData, setContentData] = useState({
    title: '',
    content_type: 'video',
    url: '',
    text_content: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await API.get('/courses/'); // adjust endpoint if needed
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
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
      console.error('Error adding content:', error);
      toast.error('Failed to add content. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add New Content</h1>

        <select
          value={selectedCourseId}
          onChange={handleCourseChange}
          className="p-2 border rounded mb-6"
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>

        {selectedCourseId && (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={contentData.title}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-1">Content Type</label>
              <select
                name="content_type"
                value={contentData.content_type}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              >
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="text">Text</option>
                <option value="article">Article</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-1">URL (optional)</label>
              <input
                type="url"
                name="url"
                value={contentData.url}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-1">Text Content (optional)</label>
              <textarea
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
