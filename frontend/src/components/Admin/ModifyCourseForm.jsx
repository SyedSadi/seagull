const ModifyCourseForm = ({ course, onUpdate, onDelete }) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      onUpdate({ ...course, [name]: value });
    };
  
    return (
      <form onSubmit={(e) => { e.preventDefault(); onUpdate(course); }} className="space-y-5">
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
  
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl transition duration-200"
          >
            Update
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-xl transition duration-200"
          >
            Delete
          </button>
        </div>
      </form>
    );
};

export default ModifyCourseForm;