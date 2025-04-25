import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../services/api";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getAllCourses, getCourseDetailsById } from "../../services/coursesApi";
import ModifyCourseForm from "../../components/Admin/ModifyCourseForm";
import { ImageUploader } from "../../services/ImageUploader";
import ShowConfirmation from "../../components/Shared/ShowConfirmation";
import { Helmet } from 'react-helmet-async';

const ModifyCoursePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [course, setCourse] = useState({
    title: "",
    description: "",
    duration: "",
    difficulty: "beginner",
    subject: "",
    image: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses. Try again later.");
      } finally{
        setLoading(false)
      }
    };
    fetchCourses();
  }, []);

  // Fetch course details when a course is selected
  useEffect(() => {
    if (!selectedCourseId) return;

    const fetchCourseDetails = async () => {
      try {
        const data = await getCourseDetailsById(selectedCourseId);
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
        toast.error("Failed to load course details.");
      }
    };
    fetchCourseDetails();
  }, [selectedCourseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prevCourse) => ({ ...prevCourse, [name]: value }));
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await ImageUploader(file);
      setCourse((prevCourse) => ({ ...prevCourse, image: url }));
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/courses/update-delete/${selectedCourseId}/`, course);
      toast.success("Course updated successfully!");
      navigate("/courses");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update course. Please try again.");
    }
  };

  // Delete the selected course
  const handleDelete = async () => {
    try {
      const res = await ShowConfirmation();
      if(res.isConfirmed){
        await API.delete(`/courses/update-delete/${selectedCourseId}/`);
        toast.success("Course deleted successfully!");
        navigate("/courses");
      }      
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete course. Please try again.");
    }
  };

  return (
    <AdminLayout>
      <Helmet>
		    <title>Modify Courses | KUETx</title>
    	</Helmet>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
          <h2 className="text-3xl font-bold text-center mb-6">Modify Course</h2>

          {/* Course Selection Dropdown */}
          <div className="mb-6">
            <label htmlFor="course" className="block text-lg font-semibold mb-2">
              Select a Course
            </label>
            <select
              id="course"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select a course --</option>
              {
                loading ? <option>Loading...</option> : 
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))
              }
            </select>
          </div>

          {/* Modify Course Form */}
          {selectedCourseId && (
            <ModifyCourseForm
              course={course}
              handleUpdate={handleUpdate}
              handleChange={handleChange}
              handleImageChange={handleImageChange}
              handleDelete={handleDelete}
              loading={loading}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ModifyCoursePage;