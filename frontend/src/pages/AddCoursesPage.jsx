import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllInstructors } from "../services/instructorsApi";
import { addCourse } from "../services/coursesApi";
import AdminLayout from "../components/Admin/AdminLayout";
import { toast } from "react-toastify"; // import toast
import "react-toastify/dist/ReactToastify.css"; // import toastify css

const AddCoursesPage = () => {
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: "",
    description: "",
    duration: "",
    difficulty: "beginner",
    subject: "",
    created_by: "",
  });

  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await getAllInstructors();
        setInstructors(data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };
    fetchInstructors();
  }, []);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await addCourse(course);
      toast.success("Course added successfully!");
      setTimeout(() => {
        navigate("/courses");
      }, 1500);
      setCourse({
        title: "",
        description: "",
        duration: "",
        difficulty: "beginner",
        subject: "",
        created_by: "",
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={course.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={course.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Duration (Hours)</label>
            <input
              type="number"
              name="duration"
              value={course.duration}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Difficulty Level</label>
            <select
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

          {/* Subject */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              value={course.subject}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Instructor */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Instructor</label>
            <select
              name="created_by"
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Add Course
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddCoursesPage;
