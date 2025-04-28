import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAllInstructors } from "../../services/instructorsApi";
import { addCourse } from "../../services/coursesApi";
import AdminLayout from "../../components/Admin/AdminLayout";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { ImageUploader } from "../../services/ImageUploader";
import { Helmet } from 'react-helmet-async';
import { AuthContext } from "../../context/AuthContext";


const AddCoursesPage = () => {
  const {user} = useContext(AuthContext)
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [course, setCourse] = useState({
    title: "",
    description: "",
    duration: "",
    difficulty: "beginner",
    subject: "",
    image: "",
    created_by: "",
  });
  
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await getAllInstructors();
        user?.role === "instructor" ? setInstructors([user?.instructor]) : setInstructors(data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };
    fetchInstructors();
  }, []);
  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first!");
      return null;
    }
    const url = await ImageUploader(selectedImage);
    setUploadedUrl(url);
    toast.success("Image uploaded successfully!");
    return url;
  };

  const handleSubmit = async (e) => {    
    e.preventDefault();
    setLoading(true);
    const url = await handleImageUpload();

    if (!url) {
      setLoading(false);
      return;
    }
    const updatedCourse = { ...course, image: url };   

    try {
      const res = await addCourse(updatedCourse);
      setTimeout(() => {
        navigate("/courses");
      }, 1500);
      toast.success("Course added successfully!");
      setCourse({
        title: "",
        description: "",
        duration: "",
        difficulty: "beginner",
        subject: "",
        image: "",
        created_by: "",
      });
      setSelectedImage(null);
      setUploadedUrl("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Add Courses | KUETx</title>
      </Helmet>
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Course</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={course.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={course.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>

          <div>
            <label htmlFor="duration" className="block mb-2 text-sm font-medium text-gray-700">Duration (Hours)</label>
            <input
              id="duration"
              type="number"
              name="duration"
              value={course.duration}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="difficulty" className="block mb-2 text-sm font-medium text-gray-700">Difficulty Level</label>
            <select
              id="difficulty"
              name="difficulty"
              value={course.difficulty}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">Subject</label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={course.subject}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="created_by" className="block mb-2 text-sm font-medium text-gray-700">Instructor</label>
            <select
              name="created_by"
              id="created_by"
              value={course.created_by}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id.toString()}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Add Course"
            )}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddCoursesPage;
