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
            setStats(response.data);
            console.log(response)
          } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchStats();
      }, []);
      console.log(stats)
    return (
        <AdminLayout>
            <div className="p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <StatCard title="Total Users" value={stats?.total_users} />
                    <StatCard title="Total Students" value={stats?.total_students} />
                    <StatCard title="Total Instructors" value={stats?.total_instructors} />
                    <StatCard title="Total Courses" value={stats?.total_courses} />
                    <StatCard title="Total Contents" value={stats?.total_contents} />
                </div>
            </div>
        </AdminLayout>
    );
};

const StatCard = ({ title, value }) => (
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

export default Dashboard;
