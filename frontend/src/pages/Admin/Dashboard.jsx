import AdminLayout from "../../components/Admin/AdminLayout";
import API from "../../services/api";
import { useEffect, useState } from "react";

const Dashboard = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await API.get("dashboard/stats/");
				setStats(response.data.data);
				// console.log(response);
			} catch (error) {
				console.error("Failed to fetch dashboard stats:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);
	// console.log(stats);
	return (
		<AdminLayout>
			<div className="p-6 pt-0 shadow-md rounded-lg">
				<h2 className="text-2xl text-center font-bold mb-4">Stats</h2>
				<div className="stats shadow bg-red-400 rounded-lg w-full">
					<StatCard
						title={"Users"}
						value={stats?.total_users}
						desc={"Total number of registerd users"}
					/>
					<StatCard
						title={"Students"}
						value={stats?.total_students}
						desc={"Total number of registerd students"}
					/>
					<StatCard
						title={"Instructors"}
						value={stats?.total_instructors}
						desc={"Total number of registerd instructors"}
					/>
					<StatCard
						title={"Courses"}
						value={stats?.total_courses}
						desc={"Total number of courses"}
					/>
					<StatCard
						title={"Contents"}
						value={stats?.total_contents}
						desc={"Total number of contents"}
					/>
					<StatCard
						title={"Quizzes"}
						value={stats?.total_quizzes}
						desc={"Total number of Quizzes"}
					/>
				</div>

				<div className="flex gap-x-8">
					{/* New Users Section */}
					<div className="mt-6">
						<h3 className="text-xl font-semibold mb-4">
							New Users in the Last 7 Days{" "}
							{`(${stats?.new_users_last_7_days?.length})`}
						</h3>
						<div className="grid grid-cols-1 gap-4">
							{stats?.new_users_last_7_days?.map((user) => (
								<div className="bg-gray-100 p-4 rounded-lg border-4 flex justify-between">
									<div>
										<p className="font-semibold">{user.username}</p>
										<p>{user.email}</p>
										<p className="text-sm text-gray-600">Role: {user.role}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Active Users Section */}
					<div className="mt-6">
						<h3 className="text-xl font-semibold mb-4">
							Active Users in the Last 24 Hours{" "}
							{`(${stats?.active_users_last_24_hours?.length})`}
						</h3>
						<div className="grid grid-cols-1 gap-4">
							{stats?.active_users_last_24_hours?.map((user) => (
								<div key={user.id} className="bg-gray-100 p-4 rounded-lg border-4 flex justify-between">
									<div>
										<p className="font-semibold">{user.username}</p>
										<p>{user.email}</p>
										<p className="text-sm text-gray-600">Role: {user.role}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
};

const StatCard = ({ title, value, desc }) => (
	<div className="stat bg-red-200  inline-block">
		<div className="stat-figure text-secondary">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				className="inline-block h-8 w-8 stroke-current"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
				></path>
			</svg>
		</div>
		<div className="stat-title">{title}</div>
		<div className="stat-value">{value}</div>
		<div className="stat-desc mt-2">{desc}</div>
	</div>
);

export default Dashboard;
