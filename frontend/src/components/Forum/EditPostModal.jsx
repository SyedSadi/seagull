import { useState, useEffect } from "react";
import API from "../../services/api";
import PropTypes from "prop-types";

const EditPostModal = ({ post, onClose, refreshPost }) => {
	const [title, setTitle] = useState(post.title);
	const [content, setContent] = useState(post.content);
	const [allTags, setAllTags] = useState([]);
	const [selectedTags, setSelectedTags] = useState(post.tags || []);
	const token = localStorage.getItem("token");

	useEffect(() => {
		const fetchTags = async () => {
			try {
				const response = await API.get("/forum/tags/");
				setAllTags(response.data);
			} catch (error) {
				console.error("Error fetching tags:", error);
			}
		};
		fetchTags();
	}, []);

	const handleTagSelect = (e) => {
		const tagId = parseInt(e.target.value);
		const tag = allTags.find((t) => t.id === tagId);
		if (
			tag &&
			selectedTags.length < 3 &&
			!selectedTags.some((t) => t.id === tagId)
		) {
			setSelectedTags([...selectedTags, tag]);
		}
	};

	const removeTag = (tagId) => {
		setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
	};

	const handleSave = async () => {
		if (selectedTags.length === 0) {
			alert("Please select at least one tag.");
			return;
		}
		console.log("Attempting to update post:", post.id);
		try {
			const response = await API.put(
				`/forum/posts/${post.id}/`,
				{
					title, // Ensure the updated title is sent
					content, // Ensure the updated content is sent
					tag_ids: selectedTags.map((tag) => tag.id), // Send updated tag IDs
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			console.log("Post updated successfully:", response.data);
			refreshPost(response.data); // Update the UI with the new post data
			onClose(); // Close the modal after saving
		} catch (error) {
			console.error(
				"Error updating post:",
				error.response ? error.response.data : error.message
			);
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white p-6 rounded-lg w-96 shadow-lg">
				<h2 className="text-xl font-bold mb-4">Edit Post</h2>
				<input
					type="text"
					className="w-full p-2 border rounded mb-2"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<textarea
					className="w-full p-2 border rounded mb-2"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
				{/* Tag Selection */}
				<select
					onChange={handleTagSelect}
					className="w-full p-2 border rounded mb-2"
				>
					<option value="">Select a Tag</option>
					{allTags.map((tag) => (
						<option key={tag.id} value={tag.id}>
							{tag.name}
						</option>
					))}
				</select>
				<div className="flex flex-wrap gap-2 mb-4">
					{selectedTags.map((tag) => (
						<span
							key={tag.id}
							className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
						>
							{tag.name}{" "}
							<button
								onClick={() => removeTag(tag.id)}
								className="text-red-600 ml-2"
							>
								×
							</button>
						</span>
					))}
				</div>

				<div className="flex justify-end gap-2">
					<button
						onClick={handleSave}
						className="bg-blue-500 text-white px-4 py-2 rounded"
					>
						Save
					</button>
					<button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};
EditPostModal.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number.isRequired,
		title: PropTypes.string.isRequired,
		content: PropTypes.string.isRequired,
		tags: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.number.isRequired,
				name: PropTypes.string.isRequired,
			})
		),
	}).isRequired,
	onClose: PropTypes.func.isRequired,
	refreshPost: PropTypes.func.isRequired,
};

export default EditPostModal;
