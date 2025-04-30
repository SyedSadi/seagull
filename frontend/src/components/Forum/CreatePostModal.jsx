// CreatePostModal.jsx
import React, { useState, useEffect, useContext } from "react";
import { createTag, fetchTag, createPost } from "../../services/forumApi";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import MarkdownEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "react-markdown-editor-lite/lib/index.css";

const CreatePostModal = ({ onClose, refreshPosts }) => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [allTags, setAllTags] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);
	const [isCreatingTag, setIsCreatingTag] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	// Fetch tags from the API
	useEffect(() => {
		const fetchTags = async () => {
			try {
				const tags = await fetchTag();
				setAllTags(tags);
			} catch (error) {
				console.error("Error fetching tags:", error);
			}
		};
		fetchTags();
	}, []);

	// Custom filter for tag suggestions
	const filterOption = (option, inputValue) => {
		if (option.data.__isNew__) return true;
		return (
			inputValue &&
			option.label.toLowerCase().startsWith(inputValue.toLowerCase())
		);
	};

	// Handle tag change
	const handleTagChange = (selectedOptions) => {
		if (selectedOptions.length <= 3) {
			setSelectedTags(selectedOptions);
		} else {
			toast.warning("You can select up to 3 tags only.", { autoClose: 3000 });
		}
	};

	// Handle creating new tags
	const handleCreateTag = async (inputValue) => {
		setIsCreatingTag(true);
		try {
			const newTag = await createTag({ name: inputValue });
			const formattedTag = { value: newTag.id, label: newTag.name };
			setAllTags([...allTags, newTag]);
			setSelectedTags((prev) => [...prev, formattedTag]);
		} catch (error) {
			toast.error("Failed to create tag.", { autoClose: 3000 });
			console.error(error);
		} finally {
			setIsCreatingTag(false);
		}
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (selectedTags.length < 1) {
			toast.error("Please select at least one tag.", { autoClose: 3000 });
			return;
		}

		if (!user) {
			toast.error("User not authenticated. Redirecting to login...", {
				autoClose: 2000,
			});
			setTimeout(() => {
				navigate("/login");
			}, 2000);
			return;
		}

		setIsSubmitting(true);
		try {
			const payload = {
				title,
				content,
				tag_ids: selectedTags.map((t) => t.value),
				author: user.id,
			};

			await createPost(payload);
			toast.success("Post created successfully!", { autoClose: 3000 });
			refreshPosts();
			onClose();
		} catch (error) {
			const data = error.response?.data;

			let errorMessage = "An unknown error occurred.";
			if (Array.isArray(data)) errorMessage = data[0];
			else if (typeof data === "object" && data !== null) {
				errorMessage = data.error || Object.values(data)[0];
			} else {
				errorMessage = error.message;
			}

			toast.error(errorMessage, { autoClose: 5000 });
			console.error("Error creating post:", data);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Custom render function for Markdown preview to include syntax highlighting
	const renderMarkdown = (text) => {
		return (
			<ReactMarkdown
				components={{
					code({ node, inline, className, children, ...props }) {
						const match = /language-(\w+)/.exec(className || "");
						return !inline && match ? (
							<SyntaxHighlighter
								style={vscDarkPlus}
								language={match[1]}
								showLineNumbers
								wrapLines
								customStyle={{
									borderRadius: "8px",
									padding: "12px",
									fontSize: "14px",
									backgroundColor: "#1e1e1e",
								}}
								{...props}
							>
								{String(children).replace(/\n$/, "")}
							</SyntaxHighlighter>
						) : (
							<code className={className} {...props}>
								{children}
							</code>
						);
					},
				}}
			>
				{text}
			</ReactMarkdown>
		);
	};

	const customStyles = {
		control: (base, state) => ({
			...base,
			borderRadius: "0.75rem",
			borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
			boxShadow: state.isFocused ? "0 0 0 2px rgba(59,130,246,0.5)" : "none",
			padding: "2px",
			fontSize: "0.875rem",
			minHeight: "42px",
		}),
		multiValue: (base) => ({
			...base,
			backgroundColor: "#dbeafe",
			color: "#1e40af",
			borderRadius: "9999px",
			padding: "2px 6px",
		}),
		multiValueLabel: (base) => ({
			...base,
			color: "#1e40af",
			fontWeight: "500",
		}),
		multiValueRemove: (base) => ({
			...base,
			color: "#1e40af",
			":hover": {
				backgroundColor: "#bfdbfe",
				color: "#1e3a8a",
			},
		}),
		menu: (base) => ({
			...base,
			borderRadius: "0.75rem",
			marginTop: "4px",
			boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
		}),
		loadingIndicator: (base) => ({
			...base,
			color: "#3b82f6",
			fontSize: "14px",
		}),
	};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl mx-4 sm:mx-6 my-4 sm:my-6 p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
          Create a New Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <input
            type="text"
            placeholder="Enter your post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
            required
            disabled={isSubmitting}
          />
          <div>
            <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
              Content (Use Markdown for formatting):
            </label>
            <div className="relative border border-gray-300 rounded-xl shadow-sm">
              <MarkdownEditor
                value={content}
                style={{ minHeight: '250px', maxHeight: '450px' }}
                className="w-full rounded-xl"
                renderHTML={renderMarkdown}
                onChange={({ text }) => setContent(text)}
                placeholder="Write your content here... (Use the toolbar to add code blocks, e.g., ```javascript\ncode\n```)"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* React Select Tag Selection */}
          <div>
            <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
              Select Tags (1–3):
            </label>
            <CreatableSelect
              isMulti
              options={allTags.map((tag) => ({ value: tag.id, label: tag.name }))}
              value={selectedTags}
              onChange={handleTagChange}
              onCreateOption={handleCreateTag}
              placeholder="Type to search or create a tag..."
              styles={customStyles}
              closeMenuOnSelect={false}
              filterOption={filterOption}
              noOptionsMessage={() => (isCreatingTag ? 'Creating tag...' : 'Type to see suggestions...')}
              isLoading={isCreatingTag}
              isDisabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium text-base flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              'Post'
            )}
          </button>
          <button
            onClick={onClose}
            type="button"
            className="mx-auto block text-center text-gray-500 hover:underline pt-1 text-sm sm:text-base"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </form>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

CreatePostModal.propTypes = {
	onClose: PropTypes.func.isRequired,
	refreshPosts: PropTypes.func.isRequired,
};

export default CreatePostModal;
