import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHeart,
	faComment,
	faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import API from "../../services/api";

const BlogPreview = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRecentPosts = async () => {
			try {
				const response = await API.get("/forum/posts/?filter=recent&limit=3");
				setPosts(response.data);
			} catch (error) {
				console.error("Error fetching blog posts:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchRecentPosts();
	}, []);

	return (
		<section className="py-10 bg-white">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Latest From Our <span className="text-blue-600">Blog</span>
					</h2>
					<p className="text-gray-600 text-lg max-w-2xl mx-auto">
						Stay updated with the latest discussions and insights from our
						community
					</p>
				</div>

				{/* Blog Posts Grid */}
				<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{loading
						? // Loading skeletons
						  [...Array(3)].map((_, index) => (
								<div key={index} className="animate-pulse">
									<div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
									<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
									<div className="h-4 bg-gray-200 rounded w-1/2"></div>
								</div>
						  ))
						: // Actual blog posts
						  posts.map((post) => (
								<div
									className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
									key={post.id}
								>
									<h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
										{post.title}
									</h3>
									<p className="text-gray-600 mb-4 line-clamp-2">
										{post.content}
									</p>

									{/* Tags */}
									<div className="flex flex-wrap gap-2 mb-4">
										{post.tags?.map((tag) => (
											<span
												key={tag.id}
												className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
											>
												#{tag.name}
											</span>
										))}
									</div>

									{/* Metrics */}
									<div className="flex items-center justify-between text-sm text-gray-500">
										<div className="flex items-center space-x-4">
											<span className="flex items-center">
												<FontAwesomeIcon
													icon={faHeart}
													className="mr-1 text-red-600"
												/>
												{post.total_votes}
											</span>
											<span className="flex items-center">
												<FontAwesomeIcon icon={faComment} className="mr-1" />
												{post.comments?.length || 0}
											</span>
										</div>
										<span className="text-gray-400 text-sm">
											{new Date(post.created_at).toLocaleDateString()}
										</span>
									</div>
								</div>
						  ))}
				</div>

				{/* View All Link */}
				<div className="text-center mt-12">
					<Link
						to="/forum"
						className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
					>
						View All Posts
						<FontAwesomeIcon icon={faArrowRight} className="ml-2" />
					</Link>
				</div>
			</div>
		</section>
	);
};

export default BlogPreview;
