import React from 'react'

const ModifyCourseForm = ({course, handleUpdate, handleChange, handleImageChange, handleDelete, loading}) => {
  return (
    <form onSubmit={handleUpdate} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
          Course Title
        </label>
        <input
          id="title"
          type="text"
          name="title"
          value={course.title}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
          placeholder="Enter course title"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={course.description}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
          placeholder="Enter course description"
          rows="4"
          required
        ></textarea>
      </div>

      <div>
        <label htmlFor="duration" className="block text-gray-700 font-medium mb-1">
          Duration (Hours)
        </label>
        <input
          id="duration"
          type="number"
          name="duration"
          value={course.duration}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
          placeholder="Enter duration"
          required
        />
      </div>

      <div>
        <label htmlFor="difficulty" className="block text-gray-700 font-medium mb-1">
          Difficulty Level
        </label>
        <select
          id="difficulty"
          name="difficulty"
          value={course.difficulty}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label htmlFor="subject" className="block text-gray-700 font-medium mb-1">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          name="subject"
          value={course.subject}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
          placeholder="Enter subject"
          required
        />
      </div>

      {/* Current Image Preview */}
      {course.image && (
        <div className="mb-4">
          <p className="text-lg font-semibold mb-2">Current Image Preview:</p>
          <img
            src={course.image}
            alt="Course Preview"
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      {/* choose another img */}
      <div>
        <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-700">Update Image</label>
        {loading ? <div>Uploading image, please wait...</div> : <input
          type="file"
          accept="image/*"
          id="image"
          name="image"
          onChange={handleImageChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />}
      </div>

      {!loading && <div className="flex justify-between mt-6">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl transition duration-200"
        >
          Update
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-xl transition duration-200"
        >
          Delete
        </button>
      </div>}
    </form>
  )
}

export default ModifyCourseForm