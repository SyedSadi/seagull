import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseDetailsById } from "../services/coursesApi";
import API from "../services/api";

const ModifyCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: "",
    description: "",
    duration: "",
    difficulty: "beginner",
    subject: "",
  });

  useEffect(() => {
      const fetchCourse = async () => {
        try {
          const data = await getCourseDetailsById(courseId);
          setCourse(data);
        } catch (error) {
          console.error('Error fetching course details:', error);
        }
      };
  
      fetchCourse();
    }, [courseId]);
  
    if (!course) {
      return <div>Loading...</div>;
    }
    console.log(course)

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    console.log("Manually attaching token:", token);

    try {
        const res = await API.put(`/courses/update-delete/${courseId}/`, course);
        console.log("Update Response:", res);
        alert("Course updated successfully!");
        navigate("/courses");

    } catch (err) {
        console.error("Update error:", err.response);
    }
  };


  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      API.delete(`/courses/update-delete/${courseId}/`)
        .then((res) => {
            console.log(res)
          alert("Course deleted successfully!");
          navigate("/courses");
        })
        .catch((err) => console.error("Delete error:", err));
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Update Course</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Course Title</label>
            <input
              type="text"
              name="title"
              value={course.title}
              onChange={handleChange}
              placeholder="Enter course title"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={course.description}
              onChange={handleChange}
              placeholder="Enter course description"
              className="textarea textarea-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Duration (Hours)</label>
            <input
              type="number"
              name="duration"
              value={course.duration}
              onChange={handleChange}
              placeholder="Enter duration in hours"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Difficulty Level</label>
            <select
              name="difficulty"
              value={course.difficulty}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={course.subject}
              onChange={handleChange}
              placeholder="Enter subject name"
              className="input input-bordered w-full"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Update Course
          </button>
        </form>

        <button
          onClick={handleDelete}
          className="btn btn-error w-full mt-4"
        >
          Delete Course
        </button>
      </div>
    </div>
  )
}

export default ModifyCoursePage;