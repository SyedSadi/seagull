import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../services/api";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getAllCourses, getCourseDetailsById } from "../../services/coursesApi";
import ModifyCourseForm from "../../components/Admin/ModifyCourseForm";

const ModifyCoursePage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [course, setCourse] = useState({
    title: "",
    description: "",
    duration: "",
    difficulty: "beginner",
    subject: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (error) {
        toast.error("Failed to load courses. Try again later.");
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    const fetchCourseDetails = async () => {
      try {
        const data = await getCourseDetailsById(selectedCourseId);
        setCourse(data);
      } catch (error) {
        toast.error("Failed to load course details.");
        console.error("Error fetching course details:", error);
      }
    };
    fetchCourseDetails();
  }, [selectedCourseId]);

  const handleUpdate = async (updatedCourse) => {
    try {
      await API.put(`/courses/update-delete/${selectedCourseId}/`, updatedCourse);
      navigate("/courses");
      toast.success("Course updated successfully!");
    } catch (err) {
      toast.error("Failed to update course. Please try again.");
      console.error("Update error:", err.response);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await API.delete(`/courses/update-delete/${selectedCourseId}/`);
      toast.success("Course deleted successfully!");
      navigate("/courses");
    } catch (err) {
      toast.error("Failed to delete course. Please try again.");
      console.error("Delete error:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
          <h2 className="text-3xl font-bold text-center mb-6">Modify Course</h2>

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
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {selectedCourseId && (
              <p className="mt-2 text-sm text-green-600">
                Selected Course ID: {selectedCourseId}
              </p>
            )}
          </div>

          {selectedCourseId && (
            <ModifyCourseForm
              course={course}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ModifyCoursePage;


