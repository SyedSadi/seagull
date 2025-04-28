import { useEffect, useState, useRef, useCallback } from "react";
import { FiFilter } from "react-icons/fi";
import { AiOutlineEdit } from "react-icons/ai";
import { FaSearch, FaTimes } from "react-icons/fa";
import { fetchPost } from "../../services/forumApi";
import Post from "./Post";
import CreatePostModal from "./CreatePostModal";
import { debounce } from "lodash"; // Import debounce function

const PostList = () => {
	const [posts, setPosts] = useState([]);
	const [filter, setFilter] = useState("recent"); // Default filter
	const [searchTag, setSearchTag] = useState("");
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showFilterDropdown, setShowFilterDropdown] = useState(false);
	const [loading, setLoading] = useState(false);
	const filterRef = useRef(null);

	// Optimized fetchPosts function using useCallback
	const fetchPosts = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetchPost(filter, searchTag);
			setPosts(response.data);
		} catch (error) {
			console.error("Error fetching posts:", error);
		} finally {
			setLoading(false);
		}
	}, [filter, searchTag]);

	// Debounced search to avoid excessive API calls
	const debouncedFetchPosts = useCallback(debounce(fetchPosts, 500), [
		fetchPosts,
	]);

	useEffect(() => {
		debouncedFetchPosts();
		return () => debouncedFetchPosts.cancel(); // Cleanup to avoid memory leaks
	}, [filter, searchTag, debouncedFetchPosts]);

	// Click outside to close dropdown
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (filterRef.current && !filterRef.current.contains(event.target)) {
				setShowFilterDropdown(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	useEffect(() => {
		const handleTagClick = (event) => {
			setSearchTag(event.detail); // Update searchTag when a tag is clicked
		};

		window.addEventListener("tagClicked", handleTagClick);
		return () => {
			window.removeEventListener("tagClicked", handleTagClick);
		};
	}, []);

	const handleFilterChange = (newFilter) => {
		setFilter(newFilter);
		setShowFilterDropdown(false); // Close dropdown after selection
	};

	const handlePostDelete = (deletedPostId) => {
		setPosts((prevPosts) =>
			prevPosts.filter((post) => post.id !== deletedPostId)
		);
	};

	if (loading) {
		return (
			<div className="flex flex-col justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
				<p className="text-gray-600">Loading posts...</p>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto px-4 py-10">
			{/* Search & Actions */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
				{/* Search */}
				<div className="relative w-full sm:w-2/3">
					<input
						type="text"
						placeholder="Search by tag..."
						value={searchTag}
						onChange={(e) => setSearchTag(e.target.value)}
						className="w-full pl-10 pr-10 py-2.5 bg-white text-sm rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
					<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
					{searchTag && (
						<button
							onClick={() => setSearchTag("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
						>
							<FaTimes />
						</button>
					)}
				</div>

				{/* Filter + Create */}
				<div className="flex items-center gap-3">
					{/* Filter */}
					<div className="relative" ref={filterRef}>
						<button
							onClick={() => setShowFilterDropdown(!showFilterDropdown)}
							className="flex items-center gap-2 px-3 py-2 text-sm rounded-2xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
						>
							<FiFilter className="text-gray-500" />
							<span>Filter</span>
						</button>
						{showFilterDropdown && (
							<div className="absolute z-10 mt-2 right-0 w-44 bg-white rounded-xl border border-gray-200 shadow-lg">
								<ul className="py-2 text-sm text-gray-700">
									{[
										{ label: "Recent Posts", value: "recent" },
										{ label: "Top Voted", value: "highest_voted" },
										{ label: "My Posts", value: "user_posts" },
									].map((option) => (
										<li key={option.value}>
											<button
												onClick={() => handleFilterChange(option.value)}
												className={`w-full text-left px-4 py-2 rounded-lg ${
													filter === option.value
														? "bg-blue-100 text-blue-600"
														: "hover:bg-gray-100"
												}`}
											>
												{option.label}
											</button>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					{/* Create Post */}
					<button
						onClick={() => setShowCreateModal(true)}
						className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md transition"
					>
						<AiOutlineEdit className="text-lg" />
						Create
					</button>
				</div>
			</div>

			{/* Post List */}
			{posts.length === 0 ? (
				<div className="text-center text-gray-500 text-sm mt-10">
					No posts found.
				</div>
			) : (
				posts.map((post) => (
					<Post
						key={post.id}
						post={{ ...post, comments: post.comments || [] }}
						onDelete={handlePostDelete}
					/>
				))
			)}

			{/* Modal */}
			{showCreateModal && (
				<CreatePostModal
					onClose={() => setShowCreateModal(false)}
					refreshPosts={fetchPosts}
				/>
			)}
		</div>
	);
};

export default PostList;
