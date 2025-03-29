import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllInstructors } from "../services/instructorsApi";
import { addCourse } from "../services/coursesApi";
import AdminLayout from "../components/Admin/AdminLayout";

const AddCoursesPage = () => {
	const navigate = useNavigate();
	const [course, setCourse] = useState({
		title: "",
		description: "",
		duration: "",
		difficulty: "beginner",
		subject: "",
		created_by: "",
	});

	const [instructors, setInstructors] = useState([]);

	useEffect(() => {
		const fetchInstructors = async () => {
			try {
				const data = await getAllInstructors();
				setInstructors(data);
			} catch (error) {
				console.error("Error fetching instructors:", error);
			}
		};

		fetchInstructors();
	}, []);

	const handleChange = (e) => {
		setCourse({ ...course, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(course);
		try {
			const data = await addCourse(course);
			// console.log('course added',data);
			alert("course added successfully");
			navigate("/courses");
			setCourse({
				title: "",
				description: "",
				duration: "",
				difficulty: "beginner",
				subject: "",
				created_by: "",
			});
			console.log(data);
		} catch {
			// console.log('eerror posting course', err)
			alert("something went wrong");
		}
	};

	//   console.log(instructors)

	return (
		<AdminLayout>
			<div className="max-w-lg mx-auto p-6 shadow-lg bg-blue-100 rounded-lg">
				<h2 className="text-xl font-bold mb-4">Add New Course</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<label className="form-control w-full">
						<span className="label-text">Title</span>
						<input
							type="text"
							name="title"
							value={course.title}
							onChange={handleChange}
							className="input input-bordered w-full"
							required
						/>
					</label>

					<label className="form-control w-full">
						<span className="label-text">Description</span>
						<textarea
							name="description"
							value={course.description}
							onChange={handleChange}
							className="textarea textarea-bordered w-full"
							required
						/>
					</label>

					<label className="form-control w-full">
						<span className="label-text">Duration (Hours)</span>
						<input
							type="number"
							name="duration"
							value={course.duration}
							onChange={handleChange}
							className="input input-bordered w-full"
							required
						/>
					</label>

					<label className="form-control w-full">
						<span className="label-text">Difficulty Level</span>
						<select
							name="difficulty"
							value={course.difficulty}
							onChange={handleChange}
							className="select select-bordered w-full"
						>
							<option value="beginner">Beginner</option>
							<option value="intermediate">Intermediate</option>
							<option value="advanced">Advanced</option>
						</select>
					</label>

					<label className="form-control w-full">
						<span className="label-text">Subject</span>
						<input
							type="text"
							name="subject"
							value={course.subject}
							onChange={handleChange}
							className="input input-bordered w-full"
							required
						/>
					</label>

					<label className="form-control w-full">
						<span className="label-text">Instructor</span>
						<select
							name="created_by"
							value={course.created_by}
							onChange={handleChange}
							className="select select-bordered w-full"
						>
							<option value="">Select instructor</option>
							{instructors.map((instructor) => (
								<option key={instructor.id} value={instructor.id.toString()}>
									{instructor.name}
								</option>
							))}
						</select>
					</label>

					<button type="submit" className="btn btn-primary w-full">
						Add Course
					</button>
				</form>
			</div>
		</AdminLayout>
	);
};

export default AddCoursesPage;
