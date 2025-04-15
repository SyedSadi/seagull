import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseDetailsById } from "../../services/coursesApi";
import RateCourse from "./RateCourse";
import PropTypes from "prop-types";  // Import PropTypes


// Helper components
const VideoContent = ({ url }) => {
	const youtubeId = getYouTubeId(url);
	return youtubeId ? (
		<div className="w-full mb-6">
			<iframe
				className="w-full h-[500px] rounded-lg"
				src={`https://www.youtube.com/embed/${youtubeId}`}
				title="Course Video"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		</div>
	) : null;
};

const PDFContent = ({ pdfUrl }) => (
	<div className="w-full">
		<iframe
			className="w-full h-[600px] rounded-xl shadow"
			src={pdfUrl}
			title="PDF Viewer"
		/>
		<div className="mt-2 flex gap-3 justify-end">
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
		<div className="bg-white min-h-screen px-4 py-10 max-w-5xl mx-auto space-y-10">
			{/* Header */}
			<div className="space-y-3">
				<h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
				<span className="mt-3 inline-block bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded-full self-start">
								{course.subject}
				</span>
				
				 <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
				<div className="mt-1">
					<RateCourse courseId={id} />
				</div>
			</div>

			{/* Content List */}
			<div className="space-y-14">
				{contents.map((content) => (
					<div key={content.id} className="w-full space-y-5">
						<h2 className="text-xl font-semibold text-gray-800">{content.title}</h2>

						{content.text_content && (
							<p className="text-gray-700 text-sm leading-relaxed">{content.text_content}</p>
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
