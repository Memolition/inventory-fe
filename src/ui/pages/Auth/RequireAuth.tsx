import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { AuthContext } from "../../app";

const RequireAuth = ({ children, permission }: { children: JSX.Element, permission?: string }) => {
    const auth:any = useAuth(AuthContext);
    let location = useLocation();

    return children;

    if (!auth.user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (
        auth?.user?.user?.UserRole?.name !== 'Administrador'
        || (
            !!permission
            && !auth?.user?.user?.UserRole?.RolePermissions.find((allowedPermission:any) => allowedPermission.name === permission)
        )
    ) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;