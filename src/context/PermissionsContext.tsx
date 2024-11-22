'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface PermissionConfig {
  getPermissionsEndpoint: string;
  checkSessionEndpoint?: string;
  headers?: HeadersInit;
}

interface PermissionsContextType {
  permissions: string[];
  setPermissions: (perms: string[]) => void;
  refreshPermissions: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const defaultContext: PermissionsContextType = {
  permissions: [],
  setPermissions: () => {
    throw new Error('PermissionsProvider not found. Wrap your app with PermissionsProvider.');
  },
  refreshPermissions: async () => {
    throw new Error('PermissionsProvider not found. Wrap your app with PermissionsProvider.');
  },
  isLoading: false,
  error: null
};

const PermissionsContext = createContext<PermissionsContextType>(defaultContext);

interface PermissionsProviderProps {
  children: ReactNode;
  config: PermissionConfig;
}

export function PermissionsProvider({ children, config }: PermissionsProviderProps): React.ReactElement {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (config.checkSessionEndpoint) {
        const sessionResponse = await fetch(config.checkSessionEndpoint, {
          headers: config.headers,
          credentials: 'include' // Add this to support cookies
        });
        
        if (!sessionResponse.ok) {
          setPermissions([]);
          return;
        }
      }
      
      const response = await fetch(config.getPermissionsEndpoint, {
        headers: config.headers,
        credentials: 'include' // Add this to support cookies
      });

      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }

      const data = await response.json();
      const permissionsList = Array.isArray(data.permissions) ? data.permissions : 
                            Array.isArray(data) ? data : [];
      setPermissions(permissionsList);
    } catch (err) {
      console.error('Error fetching permissions:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch permissions'));
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [config.getPermissionsEndpoint]); // Re-fetch when endpoint changes

  const refreshPermissions = async () => {
    await fetchPermissions();
  };

  const contextValue = {
    permissions,
    setPermissions,
    refreshPermissions,
    isLoading,
    error
  };

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions(): PermissionsContextType {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error(
      'usePermissions must be used within a PermissionsProvider. ' +
      'Make sure you have wrapped your app with <PermissionsProvider> ' +
      'at a level above the current component.'
    );
  }
  return context;
}
