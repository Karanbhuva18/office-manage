import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  //   allowedRoles?: string[];
}

const ProtectedRoute = ({
  children,
  //   allowedRoles = [],
}: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }
  //   if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
  //     return <Navigate to="/dashboard" replace />;
  //   }

  return children;
};

export default ProtectedRoute;
