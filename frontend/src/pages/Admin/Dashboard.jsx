import { useEffect, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import API from "../../services/api";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

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
			<div className="p-6 pt-0 shadow-md rounded-lg">
				<h2 className="text-2xl text-center font-bold mb-6">Dashboard Stats</h2>

				<StatsGrid stats={stats} />

				<div className="flex flex-col md:flex-row gap-8">
					<UserList
						title="New Users in the Last 7 Days"
						users={stats?.new_users_last_7_days || []}
					/>
					<UserList
						title="Active Users in the Last 24 Hours"
						users={stats?.active_users_last_24_hours || []}
					/>
				</div>
			</div>
		</AdminLayout>
	);
};

// Loading Spinner Component
const Loading = () => (
	<AdminLayout>
		<div className="flex flex-col justify-center items-center h-64">
			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
			<p className="text-gray-600">Loading dashboard...</p>
		</div>
	</AdminLayout>
);

const StatsGrid = ({ stats }) => (
	<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
		{[
			{
				title: "Users",
				value: stats?.total_users,
				desc: "Total registered users",
			},
			{
				title: "Students",
				value: stats?.total_students,
				desc: "Total registered students",
			},
			{
				title: "Instructors",
				value: stats?.total_instructors,
				desc: "Total registered instructors",
			},
			{ title: "Courses", value: stats?.total_courses, desc: "Total courses" },
			{
				title: "Contents",
				value: stats?.total_contents,
				desc: "Total contents",
			},
			{ title: "Quizzes", value: stats?.total_quizzes, desc: "Total quizzes" },
		].map((stat) => (
			<StatCard key={stat.title} {...stat} />
		))}
	</div>
);

const StatCard = ({ title, value, desc }) => (
	<div className="bg-gradient-to-b from-blue-50 to-indigo-100 p-4 rounded-lg shadow-md text-center">
		<div className="text-lg font-semibold">{title}</div>
		<div className="text-3xl font-bold mt-1">{value ?? 0}</div>
		<div className="text-sm text-gray-600 mt-2">{desc}</div>
	</div>
);

const UserList = ({ title, users }) => (
	<div className="flex-1">
		<h3 className="text-xl font-semibold mb-4">
			{title} ({users.length})
		</h3>
		<div className="grid gap-4">
			{users.length > 0 ? (
				users.map((user) => <UserCard key={user.id} user={user} />)
			) : (
				<p className="text-gray-500">No users found.</p>
			)}
		</div>
	</div>
);

const UserCard = ({ user }) => (
	<div className="bg-gray-100 p-4 rounded-lg border-2 shadow-sm flex justify-between">
		<div>
			<p className="font-semibold">{user.username}</p>
			<p>{user.email}</p>
			<p className="text-sm text-gray-600">Role: {user.role}</p>
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
};

UserList.propTypes = {
	title: PropTypes.string.isRequired,
	users: PropTypes.array.isRequired,
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
