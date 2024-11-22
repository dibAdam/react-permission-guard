'use client';

import React, { ReactNode } from 'react';
import { usePermissions } from '../context/PermissionsContext';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  permissions,
  fallback = null,
  loadingFallback = null
}: PermissionGuardProps): React.ReactElement {
  const { permissions: userPermissions, isLoading, error } = usePermissions();

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (error) {
    return <>{fallback}</>;
  }

  if (!permission && !permissions) {
    console.warn('PermissionGuard: No permissions specified');
    return <>{children}</>;
  }

  const requiredPermissions = permissions || (permission ? [permission] : []);
  const hasPermission = requiredPermissions.some(perm => userPermissions.includes(perm));

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
