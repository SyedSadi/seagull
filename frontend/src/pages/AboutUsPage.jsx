import { FaBookOpen, FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';

const AboutUsPage = () => {
  return (
    <>
    <Helmet>
        <title>About | KUETx</title>
    </Helmet>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-blue-900">About Our LMS</h1>
        <p className="text-lg text-gray-600 mb-10">
          Empowering learners and educators with the tools to succeed — anytime, anywhere.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <FaBookOpen className="text-blue-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Courses</h3>
            <p className="text-gray-600">
              Access a wide range of expertly crafted courses across various fields.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <FaUsers className="text-green-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600">
              Connect, share, and grow with a vibrant learning community.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <FaChalkboardTeacher className="text-purple-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mentorship</h3>
            <p className="text-gray-600">
              Learn directly from industry experts and experienced mentors.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our mission is simple: to make education accessible, engaging, and effective for everyone.
            We believe in the power of knowledge to transform lives, and we’re here to help you achieve your goals
            — one course, one lesson, and one success story at a time.
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default AboutUsPage;
