import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseDetailsById } from "../../services/coursesApi";
import RateCourse from "./RateCourse";
import PropTypes from "prop-types";  // Import PropTypes


// Helper components
const VideoContent = ({ url }) => {
	const youtubeId = getYouTubeId(url);
	return youtubeId ? (
		<div className="rounded-xl overflow-hidden mb-4">
			<iframe
				className="w-full h-64"
				src={`https://www.youtube.com/embed/${youtubeId}`}
				title="Course Video"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
			<a
				className="mt-2 inline-block text-sm text-blue-600 hover:underline"
				href={url}
				target="_blank"
				rel="noopener noreferrer"
			>
				Watch on YouTube
			</a>
		</div>
	) : null;
};

const PDFContent = ({ pdfUrl }) => (
	<div className="my-4">
		<iframe className="w-full h-[500px] rounded-xl" src={pdfUrl} title="PDF Viewer" />
		<div className="mt-2 flex gap-3">
			<a
				href={pdfUrl}
				download
				className="text-sm bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg"
			>
				Download PDF
			</a>
			<a
				href={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
				target="_blank"
				rel="noopener noreferrer"
				className="text-sm bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg"
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
		<div className="bg-gray-50 min-h-screen px-4 py-10 max-w-5xl mx-auto space-y-10">
			{/* Course Header */}
			<div className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
				<div>
					<h1 className="text-2xl font-semibold text-gray-800">{course.title}</h1>
					<p className="text-gray-500 mt-1 text-sm">Subject: {course.subject}</p>
				</div>
				<div className="mt-4 md:mt-0">
					<RateCourse courseId={id} />
				</div>
			</div>

			{/* Course Contents */}
			<div className="space-y-8">
				{contents.map((content) => (
					<div key={content.id} className="bg-white p-6 rounded-xl shadow-sm border">
						<h2 className="text-lg font-medium text-gray-800 mb-2">{content.title}</h2>
						<p className="text-sm text-gray-500 mb-1">Type: {content.content_type}</p>
						{content.text_content && (
							<p className="text-gray-700 text-sm mb-4 leading-relaxed">
								{content.text_content}
							</p>
						)}

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
