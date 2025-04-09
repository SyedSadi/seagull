import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseDetailsById } from "../../services/coursesApi";
import RateCourse from "./RateCourse";
import PropTypes from "prop-types";  // Import PropTypes


// Helper components
const VideoContent = ({ url }) => {
	const youtubeId = getYouTubeId(url);
	return youtubeId ? (
		<div className="mb-4">
			<iframe
				className="w-full h-60 rounded-lg"
				src={`https://www.youtube.com/embed/${youtubeId}`}
				title="Course Video"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
			<a
				className="mt-4 inline-block bg-blue-500 text-white text-center py-2 px-4 rounded-lg shadow-md hover:bg-blue-400 transition"
				href={url}
				target="_blank"
				rel="noopener noreferrer"
			>
				Watch Video Externally
			</a>
		</div>
	) : null;
};

const PDFContent = ({ pdfUrl }) => (
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
				href={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
				className="bg-indigo-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-400 transition"
				target="_blank"
				rel="noopener noreferrer"
			>
				View in New Tab
			</a>
		</div>
	</div>
);

// Main component
const CourseContent = () => {
	const { id } = useParams();
	const [course, setCourse] = useState(null);

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
	const dummyPdfUrl = "https://arxiv.org/pdf/1708.08021.pdf"; // Maybe dynamic later

	return (
		<div className="bg-gray-50">
			<RateCourse courseId={id} />

			<div className="space-y-8">
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

						{content.content_type === "video" && content.url && (
							<VideoContent url={content.url} />
						)}

						{content.content_type === "pdf" && content.url && (
							<PDFContent pdfUrl={dummyPdfUrl} />
						)}
					</div>
				))}
			</div>
		</div>
	);
};

// Helper function
const getYouTubeId = (url) => {
	const regExp = /(?:youtu\.be\/|youtube\.com\/(?:.*[?&]v=|embed\/|shorts\/))([\w-]{11})/;
	const match = url.match(regExp);
	return match ? match[1] : null;
};

VideoContent.propTypes = {
	url: PropTypes.string.isRequired,
};

PDFContent.propTypes = {
	pdfUrl: PropTypes.string.isRequired,
};

export default CourseContent;
