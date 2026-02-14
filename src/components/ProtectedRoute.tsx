import React from "react";
import { Navigate } from "react-router-dom";
import type { Role } from "../rbac";
import { useAuth } from "../AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { currentUser, isLoading } = useAuth();
  const role = currentUser?.role;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles) {
    if (!role) return <Navigate to="/denied" replace />;
    if (!allowedRoles.includes(role)) return <Navigate to="/denied" replace />;
  }

  return children;
};

export default ProtectedRoute;
