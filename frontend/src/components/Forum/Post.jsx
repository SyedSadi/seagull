import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import VoteButtons from './VoteButtons';
import CommentSection from './CommentSection';
import { fetchComment, deletePost } from '../../services/forumApi';
import EditPostModal from './EditPostModal';
import PropTypes from 'prop-types';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa'; // Added FaUserShield for admin
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const Post = ({ post, onDelete }) => {
  
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedPost, setUpdatedPost] = useState(post);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const userId = user ? user.id : null;
  const token = localStorage.getItem("access_token");

  const isAuthor = Number(post.author) === Number(userId);
  const isAdmin = user?.is_superuser === true;
  
  // Function to recursively count all comments, including nested ones
  const getTotalCommentCount = (comments) => {
    if (!comments || comments.length === 0) return 0;

    let total = comments.length;
    comments.forEach((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        total += getTotalCommentCount(comment.replies);
      }
    });
    return total;
  };

  // Compute the total comment count: use fetched comments if available, otherwise use the prop
  const totalCommentCount = showComments && !loadingComments ? getTotalCommentCount(comments) : (updatedPost.comments?.length || 0);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const fetchComments = async () => {
    setComments([]);
    setLoadingComments(true);
    try {
      const response = await fetchComment(post.id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = () => {
    if (!showComments) fetchComments();
    setShowComments(!showComments);
  };

  const openEditModal = () => setIsEditing(true);
  const closeEditModal = () => setIsEditing(false);
  const refreshPost = (newPostData) => setUpdatedPost(newPostData);

  const handleVoteUpdate = (postId, newVoteCount) => {
    if (postId === updatedPost.id) {
      setUpdatedPost({ ...updatedPost, total_votes: newVoteCount });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This post will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-2xl p-6',
        title: 'text-xl font-semibold text-gray-800',
        htmlContainer: 'text-sm text-gray-600',
        confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none',
        cancelButton: 'bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 focus:outline-none',
      },
      buttonsStyling: false,
      didOpen: () => {
        const buttons = Swal.getActions();
        if (buttons) {
          buttons.classList.add('flex', 'justify-center', 'gap-3', 'mt-4');
        }
      }
    });

    if (result.isConfirmed) {
      try {
        await deletePost(post.id, token);
        onDelete(post.id);

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your post has been removed.',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-xl p-5',
            title: 'text-lg font-medium text-gray-800',
            htmlContainer: 'text-sm text-gray-600',
          },
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Failed to delete the post.',
          customClass: {
            popup: 'rounded-xl p-5',
            title: 'text-lg font-medium text-red-700',
            htmlContainer: 'text-sm text-gray-600',
          },
        });
      }
    }
  };

  // Function to parse content and render code snippets
  const renderContent = (content) => {
    // Normalize content: handle escaped newlines and line endings
    const normalizedContent = content.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');

    // Regex to match code blocks, allowing optional whitespace
    const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)\n\s*```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(normalizedContent)) !== null) {
      const [fullMatch, language, code] = match;
      const startIndex = match.index;

      // Add any text before the code block
      if (startIndex > lastIndex) {
        parts.push(
          <p key={lastIndex} className="text-gray-600 leading-relaxed text-base">
            {normalizedContent.slice(lastIndex, startIndex)}
          </p>
        );
      }

      // Add the code block with syntax highlighting
      parts.push(
        <div key={startIndex} className="my-2">
          <SyntaxHighlighter
            language={language || 'text'}
            style={vscDarkPlus}
            showLineNumbers
            wrapLines
            customStyle={{
              borderRadius: '8px',
              padding: '12px',
              fontSize: '14px',
              backgroundColor: '#1e1e1e',
            }}
          >
            {code.trim()}
          </SyntaxHighlighter>
        </div>
      );

      lastIndex = startIndex + fullMatch.length;
    }

    // Add any remaining text after the last code block
    if (lastIndex < normalizedContent.length) {
      parts.push(
        <p key={lastIndex} className="text-gray-600 leading-relaxed text-base">
          {normalizedContent.slice(lastIndex)}
        </p>
      );
    }

    return parts;
  };

  // Determine content to display based on isExpanded
  const displayContent = isExpanded
    ? updatedPost.content
    : updatedPost.content.slice(0, 250) + (updatedPost.content.length > 250 ? '...' : '');

  // Function to render the role icon based on the author's role
  const renderRoleIcon = () => {
    const role = updatedPost.role;
    if (role === 'student') {
      return <FaUserGraduate size={16} className="ml-1 text-teal-600" title="Student" />;
    } else if (role === 'instructor') {
      return <FaChalkboardTeacher size={16} className="ml-1 text-teal-600" title="Instructor" />;
    } else if (role === "") { // Handle admin (role is empty string)
      return <FaUserShield size={16} className="ml-1 text-teal-600" title="Admin" />;
    }
    return null; // No icon for unknown roles
  };
  

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
      {/* Author & Timestamp */}

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <span className="font-semibold text-teal-600 hover:text-teal-700 transition-colors flex items-center">
            {updatedPost.author_name}
            {renderRoleIcon()}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500">
            {formatDistanceToNow(new Date(updatedPost.created_at), {
              addSuffix: true,
            })}
          </span>
        </p>
      </div>

      {/* Post Title */}
      <h2 className="text-2xl font-bold text-blue-900 mb-3 hover:text-blue-700 transition-colors cursor-pointer">
        {updatedPost.title}
      </h2>

      {/* Post Content */}
      <div className="mb-4">
        {renderContent(displayContent)}
        {updatedPost.content.length > 250 && (
          <button
            onClick={toggleExpand}
            className="text-blue-500 font-medium text-sm ml-2 hover:text-blue-600 hover:underline transition-colors"
          >
            {isExpanded ? "See Less" : "See More"}
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {updatedPost.tags?.map((tag) => (
          <button
            type="button"
            key={tag.id}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 hover:text-blue-800 transition-colors"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("tagClicked", { detail: tag.name })
              )
            }
          >
            #{tag.name}
          </button>
        ))}
      </div>

      {/* Voting & Comments Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <VoteButtons
          postId={post.id}
          totalVotes={updatedPost.total_votes}
          onVote={handleVoteUpdate}
          toggleComments={toggleComments}
          commentCount={totalCommentCount}
        />

        {/* Edit & Delete Buttons (for Author) and delete button for admin */}
        <div className="flex gap-3">
          {isAuthor && (
            <button
              type="button"
              onClick={openEditModal}
              className="text-blue-500 hover:text-blue-600 transition-colors"
              title="Edit"
            >
              <FiEdit2 size={18} />
            </button>
          )}
          {(isAuthor || isAdmin) && (
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <FiTrash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments &&
        (loadingComments ? (
          <p className="text-gray-500 mt-4 text-sm">Loading comments...</p>
        ) : (
          <CommentSection
            postId={post.id}
            comments={comments}
            setComments={setComments}
          />
        ))}

      {/* Edit Modal */}
      {isEditing && (
        <EditPostModal
          post={updatedPost}
          onClose={closeEditModal}
          refreshPost={refreshPost}
        />
      )}
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    author_name: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    total_votes: PropTypes.number.isRequired,
    comments: PropTypes.arrayOf(PropTypes.object),
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    role: PropTypes.string, // Added role to propTypes
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Post;