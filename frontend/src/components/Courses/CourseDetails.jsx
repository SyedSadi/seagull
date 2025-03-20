import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEnrolledCourses, enroll, getCourseDetailsById } from '../../services/coursesApi';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { FaArrowRight, FaSpinner } from "react-icons/fa";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseDetailsById(id);
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const handleGetEnrolledCoureses = async () => {
      try {
        const response = await getEnrolledCourses();
        console.log(response)
        const enrolledCourses = await response.data;
        setIsEnrolled(enrolledCourses.some(course => course.id === parseInt(id)));
      } catch (error) {
        console.error(error);
        setIsEnrolled(false);
      }
    };

    handleGetEnrolledCoureses();
  }, [id]);
  
  const handleEnroll = async () => {
    setLoading(true);
    try {
      const response = await enroll(id);
      toast.success(response.data.message, {
        position: 'top-right',
      });
      console.log(response?.data?.message)
      setIsEnrolled(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
      console.log(error.response?.data?.message)
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-red-200 p-16'>
      <section className="flex justify-between items-center">
        <div>
          <h1 className='text-5xl mb-4'>{course.title}</h1>
          <p className='text-lg my-4 text-gray-600'>{course.description}</p>
          <p className='text-lg my-4'>Duration: {course.duration} hours</p>
          <p className='text-lg my-4'>Ratings: {course.ratings}/5</p>
          <p className='text-lg my-4'>Difficulty: {course.difficulty.toUpperCase()}</p>
          {/* <Link to={`/courseContents/${course.id}`} className='my-4 bg-red-600 p-2'>Enroll Now!</Link> */}
          {/* <button className="btn btn-primary mt-4 w-full" onClick={handleEnroll} disabled={loading}>
            {loading ? "Enrolling..." : "Enroll Now"}
          </button> */}
          {isEnrolled === null ? (
            <span className="loading loading-spinner loading-lg"></span>) : isEnrolled ? (
            <Link to={`/courseContents/${course.id}`} className='btn btn-primary flex items-center gap-2'>Go to Course <FaArrowRight /></Link>) : (
            <button
            onClick={handleEnroll}
            className="btn btn-accent flex items-center gap-2"
            disabled={loading}
            >
            {loading ? <FaSpinner className="animate-spin" /> : "Enroll Now"}
            </button>
          )}
          {user?.is_superuser && <Link to={`/course/modify/${course.id}`} className='m-4 bg-red-600 p-2'>Edit Course</Link>}
        </div>  
        <div>
        <img width="400px" height="400px" src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="course-img" />
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default CourseDetails;
