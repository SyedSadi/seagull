import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseDetailsById } from "../../services/coursesApi";
import RateCourse from "./RateCourse";
import PropTypes from "prop-types";
import { AiFillFilePdf, AiFillPlayCircle, AiOutlineFileText } from 'react-icons/ai';
import { MdArticle } from 'react-icons/md';
import { FaArrowLeft, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { Helmet } from "react-helmet";


// Helper components
const VideoContent = ({ url }) => {
	const youtubeId = getYouTubeId(url);
	return youtubeId ? (
		<div className="w-full mb-6">
			<iframe
				className="w-3/4 h-80 rounded-lg"
				src={`https://www.youtube.com/embed/${youtubeId}`}
				title="Course Video"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
			<a
				className="mt-4 inline-block bg-blue-500 text-white text-center py-2 px-4 rounded-lg shadow-md hover:bg-blue-400 transition"
				href={url}
				target="_blank"
				rel="noopener noreferrer"
			>
				Watch Externally
			</a>
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
		<div className="mt-2 flex space-x-4">
			<a
				href={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
				target="_blank"
				rel="noopener noreferrer"
				className="text-sm bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg"
			>
				Open in New Tab
			</a>
		</div>
	</div>
);

// Main component
const CourseContent = () => {
	const { id } = useParams();
	const [contents, setContents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const fetchCourse = async () => {
			try {
				const data = await getCourseDetailsById(id);
				if(data?.contents?.length !== 0) setContents(data?.contents)			  
					
			} catch (error) {
				console.error("Error fetching course contents:", error);
			}finally {
				setLoading(false);
			}
		};
		fetchCourse();
	}, [id]);

	if (loading) {
		return <div className="flex justify-center items-center h-screen">
				<FaSpinner className="animate-spin text-4xl" />
			  </div>
	}
	if (contents.length == 0) {
		return <div className="text-center text-2xl my-6">NO CONTENTS FOUND</div>;
	}
	const iconMap = {
		video: <AiFillPlayCircle className="text-xl text-blue-500" />,
		pdf: <AiFillFilePdf className="text-xl text-red-500" />,
		text: <AiOutlineFileText className="text-xl text-green-500" />,
		article: <MdArticle className="text-xl text-purple-500" />,
	};

	const handleNext = () => {
		if (currentIndex < contents.length - 1) setCurrentIndex(currentIndex + 1);
	};
	
	const handlePrevious = () => {
		if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
	};

	
	const content = contents[currentIndex];
	const dummyPdfUrl = "https://arxiv.org/pdf/1708.08021.pdf"; // Maybe dynamic later
	
	return (
		<>
		<Helmet>
		    <title>{content.title} | KUETx</title>
    	</Helmet>	
		
		<div className="bg-gray-50 px-20">			
			<div className="flex items-center justify-between mt-6">
				<div className="flex justify-center gap-4 mt-6">
					<button
						className="btn btn-sm flex items-center gap-2 bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={handlePrevious}
						disabled={currentIndex === 0}
					>
						<FaArrowLeft />
						Prev
					</button>

					<button
						className="btn btn-sm flex items-center gap-2 bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={handleNext}
						disabled={currentIndex === contents.length - 1}
					>
						Next
						<FaArrowRight />
					</button>
				</div>
				<div>
					<RateCourse courseId={id} />
				</div>
					
			</div>

			<hr className="mt-8 border-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded" />
			
			<div className="flex flex-col md:flex-row w-full gap-6 p-6">
				{/* Left: Content Display */}
				<div className="md:w-3/4 w-full bg-base-100 rounded-xl shadow-md p-6 space-y-4">
					<div className="text-gray-800 font-semibold text-3xl mb-8">
						{content?.order + 1}. {content?.title}
					</div>

					<div className="text-xl">
						{content?.text_content}
					</div>

					{content?.content_type === 'video' && content?.url && (
						<VideoContent url={content?.url} />
					)}

					{content?.content_type === 'pdf' && content?.url && (
						<PDFContent pdfUrl={content?.url} />
					)}
				</div>

				{/* Right: Content List */}
				<div className="md:w-1/3 w-full bg-base-200 rounded-xl shadow-inner p-4 space-y-2 max-h-[80vh] overflow-y-auto">
					<h3 className="text-xl font-bold text-gray-700 my-2 mb-4">All Contents</h3>
					{contents?.map((item, index) => (
					<button
						key={item.id}
						onClick={() => setCurrentIndex(index)}
						className={`block w-full text-left px-3 py-2 rounded-lg transition duration-200 ${
						index === currentIndex
							? 'bg-blue-100 text-blue-800 font-semibold'
							: 'hover:bg-gray-100 text-gray-800'
						}`}
					>
						{item.order + 1}. {item.title} - {item.content_type.toUpperCase()}
					</button>
					))}
      			</div>
    		</div>

		</div>
		</>
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
