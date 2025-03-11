import {useState, useEffect} from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { getCourseDetailsById } from '../services/coursesApi';
import { updateContentById } from '../services/contentsApi';
const ManageContentsPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate()
    const [contents, setContents] = useState([]);

    useEffect(() => {
      const fetchCourse = async () => {
        try {
          const data = await getCourseDetailsById(courseId);
          setContents(Array.isArray(data.contents) ? data.contents : []);
        } catch (error) {
          console.error('Error fetching course details:', error);
        }
      };
  
      fetchCourse();
    }, [courseId]);
  
    const handleChange = (index, e) => {
      const { name, value } = e.target;
      setContents((prevContents) =>
        prevContents.map((content, i) =>
          i === index ? { ...content, [name]: value } : content
        )
      );
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      // URL validation regex
      const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;
    
      // Collect validation errors
      const validationErrors = contents.map((content, index) => {
        const errors = [];
    
        // Title validation
        if (!content.title?.trim()) {
          errors.push("Title is required.");
        }
    
        // Content type validation
        const validTypes = ["video", "pdf", "text", "article"];
        if (!validTypes.includes(content.content_type)) {
          errors.push("Invalid content type.");
        }
    
        // URL validation (required for video and pdf)
        if (["video"].includes(content.content_type)) {
          if (!content.url?.trim()) {
            errors.push("URL is required for video and PDF content.");
          } else if (!urlPattern.test(content.url)) {
            errors.push("Invalid URL format.");
          }
        }
    
        // Text content validation (required for text and article)
        if (["text", "article"].includes(content.content_type) && !content.text_content?.trim()) {
          errors.push("Text content is required for text and article content.");
        }
    
        return errors.length ? { index, errors } : null;
      }).filter(Boolean); // Remove nulls
    
      // If there are validation errors, alert them and stop submission
      if (validationErrors.length) {
        validationErrors.forEach(({ index, errors }) => {
          alert(`Errors in Content #${index + 1}:\n- ${errors.join("\n- ")}`);
        });
        return;
      }
    
      try {
        // Update each content individually
        const updatePromises = contents.map((content) => updateContentById(content.id, content));
        await Promise.all(updatePromises);

        alert("All contents updated successfully! 🎉");
        console.log('updated', contents)
        navigate(`/courses/${courseId}`) 
      } catch (error) {
        alert("An error occurred while updating contents. Please try again.");
      }
    };
    

  return (
    <div>
      <h2 className="text-2xl text-center font-semibold m-6">Manage Contents</h2>
      {contents.map((content, index) => (
        <div key={content.id || index} className="max-w-lg mx-auto p-6 shadow-lg bg-base-100 rounded-lg">
          <form onSubmit={handleSubmit}>
            {/* Title Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={content.title || ""}
                onChange={(e) => handleChange(index, e)}
                className="input input-bordered w-full"
                placeholder="Enter content title"
              />
            </div>

            {/* Content Type Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Content Type</span>
              </label>
              <select
                name="content_type"
                value={content.content_type || ""}
                onChange={(e) => handleChange(index, e)}
                className="select select-bordered w-full"
              >
                <option value="">Select type</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="text">Text</option>
                <option value="article">Article</option>
              </select>
            </div>

            {/* URL Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">URL</span>
              </label>
              <input
                type="url"
                name="url"  
                value={content.url || ""}
                onChange={(e) => handleChange(index, e)}
                className="input input-bordered w-full"
                placeholder="Enter URL"
              />
            </div>

            {/* Text Content Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Text Content</span>
              </label>
              <textarea
                name="text_content"
                value={content.text_content || ""}
                onChange={(e) => handleChange(index, e)}
                className="textarea textarea-bordered w-full"
                placeholder="Enter text content"
              />
            </div>

            {/* Submit Button */}
            <div className="form-control">
              <button type="submit" className="btn btn-primary w-full">
                Save Contents
              </button>
            </div>
          </form>
        </div>
      ))}
    </div>


  )
};

export default ManageContentsPage