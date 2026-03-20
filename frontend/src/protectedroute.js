import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {

  const token = localStorage.getItem("token");
  const location = useLocation();

  return token
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

export default ProtectedRoute;