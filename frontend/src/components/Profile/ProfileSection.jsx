import { useState, useEffect, useContext } from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";

export default function ProfileSection() {
	const { user, setUser } = useContext(AuthContext);
	const [editMode, setEditMode] = useState(false);
	const [form, setForm] = useState({});

	const fetchProfile = async () => {
		const res = await API.get("/users/");
		setForm(res.data);
	};

	const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

	const handleUpdate = async () => {
		try {
			await API.put("/users/", form);
			const response = await API.get("/users/");
			setUser(response.data);
			localStorage.setItem("user", JSON.stringify(response.data));
			setEditMode(false);
			toast.success("Profile updated!");
		} catch {
			toast.error("Failed to update profile");
		}
	};

	useEffect(() => {
		fetchProfile();
	}, []);

	if (!user) return <div>Loading...</div>;

	return (
		<div className="w-full h-full bg-gradient-to-b from-blue-50 to-indigo-100 p-6 rounded-2xl shadow-lg flex flex-col items-center">
			<div className="bg-white p-5 rounded-full shadow-md mb-4">
				{user.role === "student" ? (
					<FaUserGraduate className="text-5xl text-blue-600" />
				) : (
					<FaChalkboardTeacher className="text-5xl text-indigo-600" />
				)}
			</div>

			<h2 className="text-2xl font-bold text-center text-gray-800 mt-6">{user.username.toUpperCase()}</h2>
			<span className="mt-4 text-xs font-medium text-white bg-blue-500 px-3 py-1 rounded-full uppercase">
				{user.role}
			</span>

			<p className="mt-3 text-lg text-center text-gray-600 break-words">
				{user.email}
			</p>

			{editMode ? (
				<div className="w-full mt-4">
					<textarea
						className="textarea textarea-bordered w-full mt-2"
						name="bio"
						placeholder="Bio"
						value={form.bio || ""}
						onChange={handleChange}
					/>
					{user.role === "instructor" && (
						<>
							<input
								className="input input-bordered w-full mt-2"
								name="designation"
								placeholder="Designation"
								value={form.instructor?.designation || ""}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										instructor: {
											...prev.instructor,
											designation: e.target.value,
										},
									}))
								}
							/>
							<input
								className="input input-bordered w-full mt-2"
								name="university"
								placeholder="University"
								value={form.instructor?.university || ""}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										instructor: {
											...prev.instructor,
											university: e.target.value,
										},
									}))
								}
							/>
						</>
					)}
					<button className="btn btn-primary w-full mt-4" onClick={handleUpdate}>
						Save
					</button>
				</div>
			) : (
				<>
					{user.role === "instructor" && (
						<p className="mt-2 text-center text-sm text-gray-700">
							{user.instructor?.designation}, {user.instructor?.university}
						</p>
					)}
					<p className="mt-3 text-center text-sm italic text-gray-500 px-2">
						{form.bio || "No bio available"}
					</p>
					<button
						className="btn btn-sm btn-outline mt-12"
						onClick={() => setEditMode(true)}
					>
						<FaEdit className="mr-2" /> Edit
					</button>
				</>
			)}
		</div>
	);
}
