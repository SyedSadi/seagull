import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const AdminRoute = ({element}) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.is_superuser) {
            return <Outlet/>;
        }
    }
    return <Navigate to="/" />;
};

export default AdminRoute;