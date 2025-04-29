import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { getEnrolledCourses, enroll, getCourseDetailsById, generateInvoice } from "../../services/coursesApi";
import { toast, ToastContainer } from "react-toastify";
import { FaArrowRight, FaSpinner } from "react-icons/fa";
import OTPModal from "./OTPModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from 'react-helmet-async';
import { 
  faFilePdf,
  faVideo,
  faBook,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdTimer, MdOutlineCategory } from "react-icons/md";

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
  console.log(course)

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
          className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-md font-medium shadow-md"
        >
          Go to Course <FaArrowRight className="ml-2" />
        </Link>
      );
    }
    return (
      <button
      onClick={handleEnroll}
      disabled={loading}
      className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-md font-medium shadow-md disabled:opacity-50"
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
    
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl font-extrabold text-blue-700">{course.title}</h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">{course.description}</p>
        </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
          {/* Left Column - Course Details */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-blue-600">Course Details</h2>
              <div className="space-y-4 text-gray-700 mt-4">
                <div className="flex items-center gap-3">
                  <MdOutlineCategory className="text-blue-600 text-xl" />
                  <span className="text-lg font-semibold">Subject:</span>
                  <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full">{course.subject}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MdTimer className="text-green-600 text-xl" />
                  <span className="text-lg font-semibold">Duration:</span>
                  <span>{course.duration} hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">Difficulty:</span>
                  <span className="uppercase text-yellow-600">{course.difficulty}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">Ratings:</span>
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-lg" />
                  <span>{course.ratings}</span>
                  <span className="text-gray-500">
                    {course.ratings_count ? `(${course.ratings_count} ratings)` : "(No ratings yet)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructor Info Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p>
              <FaChalkboardTeacher className="text-blue-600 text-xl" /><span className="text-2xl font-semibold text-blue-600">Instructor</span>
              </p>
            
              <div className="space-y-4 text-gray-700 mt-4">
                <p className="flex items-center gap-3 text-lg">
                  
                  <span className="font-bold">Name:</span> {course.created_by_details?.name?.toUpperCase()}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Designation:</span> {course.created_by_details?.designation?.toUpperCase() || "Not provided"}
                </p>
                <p className="text-lg">
                  <span className="font-bold">University:</span> {course.created_by_details?.university?.toUpperCase() || "Not provided"}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 ml-4">
              {renderActionButton()}
              <OTPModal ref={otpRef} />
            </div>  

          </div>

          {/* Right Column - Course Image and Contents */}
          <div className="space-y-8 lg:col-span-1">
            <div className="p-6">
              <div className="flex justify-center">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-auto max-w-lg object-cover rounded-xl shadow-sm"
                />
              </div>
            </div>

            {/* Course Contents Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-blue-600 flex items-center gap-3 mb-6">
                <FontAwesomeIcon icon={faCircleInfo} /> Course Contents
              </h2>
              <ul className="space-y-5">
                {course.contents.map((content) => (
                  <li
                    key={content.id}
                    className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 shadow-md hover:shadow-xl transition ease-in-out"
                  >
                    {content.content_type === "video" && <FontAwesomeIcon icon={faVideo} className="text-red-500 text-xl" />}
                    {content.content_type === "pdf" && <FontAwesomeIcon icon={faFilePdf} className="text-blue-700 text-xl" />}
                    {content.content_type === "article" && <FontAwesomeIcon icon={faBook} className="text-green-600 text-xl" />}
                    <span className="text-lg font-medium text-gray-800">{content.title}</span>
                  </li>
                ))}
              </ul>
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
