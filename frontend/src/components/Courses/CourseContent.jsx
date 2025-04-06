import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourseDetailsById } from "../../services/coursesApi";
import { AuthContext } from "../../context/AuthContext";
import RateCourse from "./RateCourse";

const CourseContent = () => {
	const { id } = useParams(); // Get course ID from URL
	const [course, setCourse] = useState(null);
	const { user } = useContext(AuthContext);
	useEffect(() => {
		const fetchCourse = async () => {
			try {
				const data = await getCourseDetailsById(id);
				setCourse(data);
			} catch (error) {
				console.error("Error fetching course contents:", error);
			}
		};

		fetchCourse();
	}, [id]);

	if (!course) {
		return <div>Loading...</div>;
	}
	const contents = course.contents;
	console.log(contents);
	const pdfUrl = "https://arxiv.org/pdf/1708.08021.pdf";

	return (
		<div className="bg-gray-50">
			{/* Admin management link */}
			{user?.is_superuser && (
				<Link
					className="mb-6 inline-block bg-blue-600 text-white text-lg font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-500 transition"
					to={`/contents/manage/${course.id}`}
				>
					Manage Contents
				</Link>
			)}

			<RateCourse courseId={id} />

			<div className="space-y-8">
				{/* Display course contents */}
				{contents.map((content) => (
					<div key={content.id} className="bg-white shadow-lg rounded-lg p-6">
						<div className="text-gray-800 font-semibold text-xl mb-2">
							<strong>Title:</strong> {content.title}
						</div>
						<div className="text-gray-700 text-sm mb-2">
							<strong>Type:</strong> {content.content_type}
						</div>
						<div className="text-gray-600 mb-4">
							<strong>Text:</strong> {content.text_content}
						</div>

						{/* Display video if content type is video and a URL is provided */}
						{content.content_type === "video" && content.url && (
							<div className="mb-4">
								<iframe
									className="w-full h-60 rounded-lg"
									src={`https://www.youtube.com/embed/${getYouTubeId(
										content.url
									)}`}
									title="Course Video"
									allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							</div>
						)}

						{/* for pdf */}
						{content.url && content.content_type === "pdf" && (
							<div className="my-4">
								<iframe
									className="w-full h-[600px] rounded-lg shadow-md"
									src={pdfUrl}
									title="Course PDF"
								/>
								<div className="mt-2 flex space-x-4">
									<a
										href={pdfUrl}
										className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-400 transition"
										download
									>
										Download PDF
									</a>
									<a
										href={`https://docs.google.com/gview?url=${encodeURIComponent(
											pdfUrl
										)}&embedded=true`}
										className="bg-indigo-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-400 transition"
										target="_blank"
										rel="noopener noreferrer"
									>
										View in New Tab
									</a>
								</div>
							</div>
						)}

						{/* Watch Video button for external link */}
						{content.content_type === "video" && content.url && (
							<a
								className="mt-4 inline-block bg-blue-500 text-white text-center py-2 px-4 rounded-lg shadow-md hover:bg-blue-400 transition"
								href={content.url}
								target="_blank"
								rel="noopener noreferrer"
							>
								Watch Video Externally
							</a>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

const getYouTubeId = (url) => {
	const regExp =
		/(?:youtu\.be\/|youtube\.com\/(?:.*[?&]v=|embed\/|shorts\/))([\w-]{11})/;
	const match = url.match(regExp);
	return match ? match[1] : null;
};

export default CourseContent;
