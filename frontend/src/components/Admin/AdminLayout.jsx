import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminLayout = ({ children }) => {
	const {user} = useContext(AuthContext)
	return (
		<div className="flex min-h-screen">
			{/* Sidebar */}
			<div className="w-64 bg-gray-800 text-white p-4">
				<h2 className="text-xl font-bold mb-4">{user.role === "instructor" ? "Dashboard" : "Admin Panel"}</h2>
				{
					user.role === "instructor" ?
					<ul>
						
						<li className="mb-2 py-2 border-b-2 border-gray-200">
							<Link to="/add-courses">Add Courses</Link>
						</li>
						<li className="mb-2 py-2 border-b-2 border-gray-200">
							<Link to="/manage-courses">Manage Courses</Link>
						</li>
						<li className="mb-2 py-2 border-b-2 border-gray-200">
							<Link to="/add-contents">Add Contents</Link>
						</li>
						<li className="mb-2 py-2 border-b-2 border-gray-200">
							<Link to="/manage-contents">Manage Contents</Link>
						</li>
					</ul>
				:
					<ul>
						<li className="mb-2 py-2 border-b-2 border-gray-200">
							<Link to="/admin/dashboard">Dashboard</Link>
						</li>
						<li className="mb-2 py-2 border-b-2 border-gray-200">
							<Link to="/add-courses">Add Courses</Link>
						</li>
						<li className="mb-2 py-2 border-b-2 border-gray-200">
							<Link to="/manage-courses">Manage Courses</Link>
						</li>
						<li className="mb-2 py-2 border-b-2 border-gray-200">
							<Link to="/add-contents">Add Contents</Link>
						</li>
						<li className="mb-2 py-2 border-b-2 border-gray-200">
							<Link to="/manage-contents">Manage Contents</Link>
						</li>
						<li className="mb-2 py-2 border-b-2 border-gray-200">
							<Link to="/add-quiz">Add Quiz</Link>
						</li>
						<li className="mb-2 py-2 border-b-2 border-gray-200">
							<Link to="/manage-quiz">Manage Quiz</Link>
						</li>
					</ul>
				}
			</div>

			{/* Main Content */}
			<div className="flex-1 p-6">{children}</div>
		</div>
	);
};
AdminLayout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AdminLayout;
