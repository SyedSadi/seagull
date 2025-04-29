import { useEffect, useState, useRef, useCallback } from "react";
import { FiFilter } from "react-icons/fi";
import { AiOutlineEdit } from "react-icons/ai";
import { FaSearch, FaTimes } from "react-icons/fa";
import { fetchPost, fetchTag } from "../../services/forumApi";
import Post from "./Post";
import CreatePostModal from "./CreatePostModal";
import { debounce } from "lodash";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("recent");
  const [searchTag, setSearchTag] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);

  const filterRef = useRef(null);

  // Optimized fetchPosts function
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

  // Debounced fetchPosts
  const debouncedFetchPosts = useCallback(debounce(fetchPosts, 500), [
    fetchPosts,
  ]);

  // Fetch posts when filter or searchTag changes
  useEffect(() => {
    debouncedFetchPosts();
    return () => debouncedFetchPosts.cancel();
  }, [filter, searchTag, debouncedFetchPosts]);

  // Click outside to close filter dropdown
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

  // Handle tag click event
  useEffect(() => {
    const handleTagClick = (event) => {
      setSearchTag(event.detail);
      setInputValue(event.detail);
      setTagSuggestions([]);
    };
    window.addEventListener("tagClicked", handleTagClick);
    return () => {
      window.removeEventListener("tagClicked", handleTagClick);
    };
  }, []);

  // Fetch tags for suggestions
  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await fetchTag();
        setTags(response);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    loadTags();
  }, []);

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setShowFilterDropdown(false);
  };

  // Handle post deletion
  const handlePostDelete = (deletedPostId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPostId)
    );
  };

  // Handle input change for tag search
  const handleSearchChange = (e) => {
    const input = e.target.value;
    setInputValue(input);

    if (input.trim() === "") {
      setTagSuggestions([]);
    } else {
      const matches = tags.filter((tag) =>
        tag.name.toLowerCase().startsWith(input.toLowerCase())
      );
      setTagSuggestions(matches);
    }
  };

  // Handle tag selection from suggestions
  const handleTagSelect = (tagName) => {
    setSearchTag(tagName);
    setInputValue(tagName);
    setTagSuggestions([]);
  };

  // Handle Enter key to confirm tag
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      setSearchTag(inputValue.trim());
      setTagSuggestions([]);
    }
  };

  // Generate dynamic message based on filter and searchTag
  const getFilterMessage = () => {
    const filterLabels = {
      recent: "Recent Posts",
      highest_voted: "Top Voted Posts",
      user_posts: "My Posts",
    };
    const filterText = filterLabels[filter] || "Posts";
    const tagText = searchTag ? ` tagged with "${searchTag}"` : "";
    return `Showing ${filterText}${tagText}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-2/3">
          <input
            type="text"
            placeholder="Search by tag..."
            value={inputValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-10 py-2.5 bg-white text-sm rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          {inputValue && (
            <button
              onClick={() => {
                setInputValue("");
                setSearchTag("");
                setTagSuggestions([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
          {tagSuggestions.length > 0 && (
            <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 max-h-48 overflow-auto shadow-lg">
              {tagSuggestions.map((tag) => (
                <li
                  key={tag.id}
                  onClick={() => handleTagSelect(tag.name)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center gap-3">
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
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md transition"
          >
            <AiOutlineEdit className="text-lg" />
            Create
          </button>
        </div>
      </div>

      {/* Filter/Search Message */}
      {!loading && (
        <div className="mb-6 px-3 py-1.5 text-sm text-blue-600 font-medium">
        {getFilterMessage()}
      </div>
      )}

      {/* Post List */}
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-40 flex-col">
             <p className="mt-4 text-gray-500 text-sm">Loading posts...</p>
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500">
           
            </div>
          </div>
        ) : posts.length === 0 ? (
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
      </div>

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