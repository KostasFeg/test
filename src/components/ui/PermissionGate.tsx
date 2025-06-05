import React, { ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Permission } from "../../permissions/access-model";

interface PermissionGateProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditional rendering component based on user permissions
 * Only renders children if user has the required permission
 */
const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default PermissionGate;
