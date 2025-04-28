import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaUserGraduate, FaUserTie, FaUsers, FaBookOpen, FaFileAlt, FaClipboardList } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { MdOutlinePendingActions } from "react-icons/md";
import AdminLayout from "../../components/Admin/AdminLayout";
import API from "../../services/api";
import PropTypes from "prop-types";

const Dashboard = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await API.get("dashboard/stats/");
				setStats(response.data.data);
			} catch (error) {
				console.error("Failed to fetch dashboard stats:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<AdminLayout>
			<Helmet>
				<title>Dashboard | KUETx</title>
			</Helmet>

			<div className="p-6 pt-0">
				<h2 className="text-3xl font-bold text-center mb-10">📊 Admin Dashboard</h2>

				<StatsGrid stats={stats} />

				<div className="flex flex-col md:flex-row gap-8 mt-10">
					<UserList
						title="New Users in the Last 7 Days"
						users={stats?.new_users_last_7_days || []}
						icon={<FiUsers size={22} />}
					/>
					<UserList
						title="Active Users in the Last 24 Hours"
						users={stats?.active_users_last_24_hours || []}
						icon={<MdOutlinePendingActions size={22} />}
					/>
				</div>
			</div>
		</AdminLayout>
	);
};

// Loading Spinner
const Loading = () => (
	<AdminLayout>
		<div className="flex justify-center items-center h-[70vh]">
			<span className="loading loading-dots loading-lg text-primary"></span>
		</div>
	</AdminLayout>
);

const StatsGrid = ({ stats }) => {
	const statItems = [
		{ title: "Users", value: stats?.total_users, icon: <FaUsers size={28} className="text-primary" /> },
		{ title: "Students", value: stats?.total_students, icon: <FaUserGraduate size={28} className="text-secondary" /> },
		{ title: "Instructors", value: stats?.total_instructors,  icon: <FaUserTie size={28} className="text-accent" /> },
		{ title: "Courses", value: stats?.total_courses, icon: <FaBookOpen size={28} className="text-info" /> },
		{ title: "Contents", value: stats?.total_contents, icon: <FaFileAlt size={28} className="text-success" /> },
		{ title: "Quizzes", value: stats?.total_quizzes, icon: <FaClipboardList size={28} className="text-warning" /> },
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{statItems.map((item) => (
				<StatCard key={item.title} {...item} />
			))}
		</div>
	);
};

const StatCard = ({ title, value, icon }) => (
	<div className="card shadow-lg bg-base-100 hover:scale-105 transition-transform duration-300">
		<div className="card-body items-center text-center">
			<div className="mb-2">{icon}</div>
			<p className="text-3xl font-bold">{value ?? 0}</p>
			<h2 className="card-title">{title}</h2>
		</div>
	</div>
);

const UserList = ({ title, users, icon }) => (
	<div className="flex-1">
		<div className="flex items-center gap-2 mb-4">
			{icon}
			<h3 className="text-xl font-semibold">
				{title} ({users.length})
			</h3>
		</div>
		<div className="grid gap-4">
			{users.length > 0 ? (
				users.slice(0, 5).map((user) => <UserCard key={user.id} user={user} />)
			) : (
				<p className="text-gray-400 italic">No users found.</p>
			)}
		</div>
	</div>
);


const UserCard = ({ user }) => (
	<div className="card border border-gray-200 bg-base-100 shadow-sm hover:shadow-md transition duration-300">
		<div className="card-body p-4">
			<p className="font-semibold">{user.username}</p>
			<p className="text-gray-600 text-sm">{user.email}</p>
			<p className="text-xs text-gray-500">Role: {user.role}</p>
		</div>
	</div>
);

Dashboard.propTypes = {
	stats: PropTypes.shape({
		new_users_last_7_days: PropTypes.array.isRequired,
		active_users_last_24_hours: PropTypes.array.isRequired,
		total_users: PropTypes.number,
		total_students: PropTypes.number,
		total_instructors: PropTypes.number,
		total_courses: PropTypes.number,
		total_contents: PropTypes.number,
		total_quizzes: PropTypes.number,
	}),
};

StatsGrid.propTypes = {
	stats: PropTypes.shape({
		total_users: PropTypes.number,
		total_students: PropTypes.number,
		total_instructors: PropTypes.number,
		total_courses: PropTypes.number,
		total_contents: PropTypes.number,
		total_quizzes: PropTypes.number,
	}).isRequired,
};

StatCard.propTypes = {
	title: PropTypes.string.isRequired,
	value: PropTypes.number,
	desc: PropTypes.string.isRequired,
	icon: PropTypes.node.isRequired,
};

UserList.propTypes = {
	title: PropTypes.string.isRequired,
	users: PropTypes.array.isRequired,
	icon: PropTypes.node.isRequired,
};

UserCard.propTypes = {
	user: PropTypes.shape({
		id: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		role: PropTypes.string.isRequired,
	}).isRequired,
};

export default Dashboard;
