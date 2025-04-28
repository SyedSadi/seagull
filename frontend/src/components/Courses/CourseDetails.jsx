import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { getEnrolledCourses, enroll, getCourseDetailsById, generateInvoice } from "../../services/coursesApi";
import { toast, ToastContainer } from "react-toastify";
import { FaArrowRight, FaSpinner } from "react-icons/fa";
import OTPModal from "./OTPModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from 'react-helmet-async';

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

      // generate invoice
      const res = await generateInvoice(id)
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_course_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(error.response?.data?.error || "Enrollment failed");
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
    <>
    <Helmet>
		    <title>{course.title} | KUETx</title>
    </Helmet>
    
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto  p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Right Image Area (first on mobile) */}
          <div className="order-1 md:order-2 flex justify-center items-start">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-auto max-w-md object-contain rounded-xl shadow-lg"
            />
          </div>

          {/* Left Content Area */}
          <div className="order-2 md:order-1">
            <h1 className="text-4xl font-semibold text-blue-600 mb-4">{course.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{course.description}</p>

            <div className="space-y-3 text-gray-700 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-900 text-lg font-bold">Subject:</span>
                <span className="bg-sky-100 text-blue-600 px-3 py-1 rounded-full text-md font-semibold">
                  {course.subject}
                </span>
              </div>

              <p className="text-gray-900 text-lg">
                <span className="font-bold">Difficulty:</span> {course.difficulty.toUpperCase()}
              </p>

              <p className="text-gray-900 text-lg">
                <span className="font-bold">Duration:</span> {course.duration} hours
              </p>

              <p className="text-gray-900 text-lg">
                <span className="font-bold">Ratings:</span> {course.ratings}
                <FontAwesomeIcon icon={faStar} className="text-yellow-400 ml-2 mr-1" />
                {course?.ratings_count ? (
                  <span className="text-gray-500">({course?.ratings_count} ratings)</span>
                ) : (
                  <span className="text-gray-500">(No ratings yet)</span>
                )}
              </p>

              {/* Instructor Info */}
              <div className="pt-4 border-t mt-4">
                <p className="text-gray-900 text-lg mb-2">
                  <span className="font-bold mr-2">Instructor Name:</span> {course.created_by_details?.name.toUpperCase()}
                </p>
                <p className="text-gray-900 text-lg mb-2">
                  <span className="font-bold mr-2">Designation:</span> {course.created_by_details?.designation.toUpperCase() || "not provided"}
                </p>
                <p className="text-gray-900 text-lg mb-2">
                  <span className="font-bold mr-2">University:</span> {course.created_by_details?.university.toUpperCase() || "not provided"}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6">
              {renderActionButton()}
              <OTPModal ref={otpRef} />
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </div>
    </>

  );
};

export default CourseDetails;
