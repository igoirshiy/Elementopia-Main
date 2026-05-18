// utils/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import AccessDenied from "../AccessDenied"

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const role = user?.role || localStorage.getItem("role");

  if (!allowedRoles.includes(role)) {
    return <AccessDenied />;
  }

  return children;
};

export default PrivateRoute;
