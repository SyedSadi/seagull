import React from 'react'

const ManageContents = ({content, setContents}) => {
    console.log(content)
    // Handle form input changes
    


  return (
    <div className="max-w-lg mx-auto p-6 shadow-lg bg-base-100 rounded-lg">
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
            onChange={handleChange}
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
            value={content.content_type}
            onChange={handleChange}
            className="select select-bordered w-full"
        >
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="text">Text</option>
            <option value="article">Article</option>
        </select>
        </div>

        {/* Video URL Field */}
        <div className="form-control mb-4">
        <label className="label">
            <span className="label-text">URL</span>
        </label>
        <input
            type="url"
            name="video_url"
            value={content.url || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter video URL"
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
            onChange={handleChange}
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
    // <h3>lkdjf</h3>
  )
}

export default ManageContents