import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import {AuthContext} from "../../context/AuthContext";

const ProtectedRoute = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    // console.log('loca', location)
    return user ? <Outlet /> : <Navigate to="/login" state={{from: location}} replace />;
};

export default ProtectedRoute;
