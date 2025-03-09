import { Link } from "react-router-dom";

const AdminLayout = ({ children }) => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
                <ul>
                    <li className="mb-2"><Link to="/admin/dashboard">Dashboard</Link></li>
                    <li className="mb-2"><Link to="/admin/users">Users</Link></li>
                    <li className="mb-2"><Link to="/admin/courses">Courses</Link></li>
                    <li className="mb-2"><Link to="/admin/exams">Exams</Link></li>
                </ul>
            </div>  

            {/* Main Content */}
            <div className="flex-1 p-6">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
