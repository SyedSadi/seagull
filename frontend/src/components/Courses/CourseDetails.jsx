import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { getEnrolledCourses, enroll, getCourseDetailsById } from "../../services/coursesApi";
import { toast, ToastContainer } from "react-toastify";
import { FaArrowRight, FaSpinner } from "react-icons/fa";
import OtpModal from "./OTPModal";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const otpRef = useRef();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseData, enrolledData] = await Promise.all([
          getCourseDetailsById(id),
          getEnrolledCourses(),
        ]);

        setCourse(courseData);
        const enrolledCourses = enrolledData.data || [];
        console.log(courseData);
        setIsEnrolled(enrolledCourses.some((c) => c.id === parseInt(id)));
      } catch (error) {
        console.error("Error loading course or enrollment info:", error);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleEnroll = async () => {
    const otpVerified = await otpRef.current.open();
    if (!otpVerified) {
      toast.error("Enrollment Failed.");
      return;
    }

    setLoading(true);
    try {
      const response = await enroll(id);
      toast.success(response?.data?.message || "Enrolled successfully!");
      setIsEnrolled(true);
    } catch (error) {
      toast.error(error.response?.data?.error || "Enrollment failed");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  const renderActionButton = () => {
    if (isEnrolled) {
      return (
        <Link
          to={`/courseContents/${course.id}`}
          className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md"
        >
          Go to Course <FaArrowRight className="ml-2" />
        </Link>
      );
    }
    return (
      <button
      onClick={handleEnroll}
      disabled={loading}
      className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md disabled:opacity-50"
    >
      {loading ? <FaSpinner className="animate-spin mr-2" /> : "Enroll Now"}
    </button>
    );
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-10 px-4">
  <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left Content Area */}
      <div>
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">{course.title}</h1>
        <p className="text-lg text-gray-600 mb-6">{course.description}</p>

        <div className="space-y-3 text-gray-700 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-900 font-medium">Subject:</span>
            <span className="bg-sky-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">{course.subject}</span>
          </div>

          <p>
            <span className="text-gray-900 font-medium">Difficulty:</span> {course.difficulty.toUpperCase()}
          </p>

          <p>
            <span className="text-gray-900 font-medium">Duration:</span> {course.duration} hours
          </p>

          <p>
            <span className="text-gray-900 font-medium">Ratings:</span> {course.ratings}/5
          </p>

          {/* Instructor Info */}
          <div className="pt-4 border-t mt-4">
            <p><span className="text-gray-900 font-medium">Instructor Name:</span> {course.created_by?.name}</p>
            <p><span className="text-gray-900 font-medium">Designation:</span> {course.created_by?.designation}</p>
            <p><span className="text-gray-900 font-medium">University:</span> {course.created_by?.university}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {renderActionButton()}
          <OtpModal ref={otpRef} />
        </div>
      </div>

      {/* Right Image Area */}
      <div className="flex justify-center items-start">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-auto max-w-md object-contain rounded-xl shadow-lg"
        />
      </div>
    </div>

    <ToastContainer />
  </div>
</div>

  );
};

export default CourseDetails;
