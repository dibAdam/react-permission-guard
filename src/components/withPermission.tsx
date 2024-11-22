'use client';

import React from 'react';
import { usePermissions } from '../context/PermissionsContext';

interface WithPermissionOptions {
  permission?: string;
  permissions?: string[];
  FallbackComponent?: React.ComponentType;
  LoadingComponent?: React.ComponentType;
}

export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithPermissionOptions
) {
  return function PermissionWrapper(props: P) {
    const { permissions: userPermissions, isLoading, error } = usePermissions();
    const {
      permission,
      permissions,
      FallbackComponent = () => <div>Access Denied</div>,
      LoadingComponent = () => <div>Loading...</div>
    } = options;

    if (isLoading) {
      return <LoadingComponent />;
    }

    if (error) {
      return <FallbackComponent />;
    }

    if (!permission && !permissions) {
      console.warn('withPermission: No permissions specified');
      return <WrappedComponent {...props} />;
    }

    const requiredPermissions = permissions || (permission ? [permission] : []);
    const hasPermission = requiredPermissions.some(perm => userPermissions.includes(perm));

    if (!hasPermission) {
      return <FallbackComponent />;
    }

    return <WrappedComponent {...props} />;
  };
}
