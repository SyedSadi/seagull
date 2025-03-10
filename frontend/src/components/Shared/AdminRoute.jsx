import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const AdminRoute = ({element}) => {
    const token = localStorage.getItem("access_token");
    console.log('token', token)
    console.log('ele', element)
    if (token) {
        const decodedToken = jwtDecode(token);
        console.log('decoded token', decodedToken)
        if (decodedToken.is_superuser) {
            console.log('user is admin')
            return <Outlet/>;
        }
    }
    console.log('user is not admin')
    return <Navigate to="/" />;
};

export default AdminRoute;