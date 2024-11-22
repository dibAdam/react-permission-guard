# React Permission Guard

A flexible and easy-to-use permission system for React applications, with full support for Next.js 14 and React Server Components.

## Features

- 🚀 Built for React 18 and Next.js 14
- 🔒 Type-safe permission checking
- ⚡️ Component and page-level protection
- 🎯 Single or multiple permission checks
- 🔄 Automatic permission refresh
- 📱 SSR compatible
- 🎨 Customizable fallback components
- 🌐 API-based permission management

## Requirements

- React 18 or higher
- React DOM 18 or higher
- Next.js 14 or higher (optional)
- Node.js 16 or higher

## Installation

```bash
npm install react-permission-guard
# or
yarn add react-permission-guard
```

## Quick Start

### 1. Set up the Provider

The PermissionsProvider must be placed at the root level of your application, above any components that use permissions.

```tsx
// app/providers.tsx - Create a client component for providers
'use client';

import { PermissionsProvider } from 'react-permission-guard';

const config = {
  getPermissionsEndpoint: '/api/permissions',  // Your permissions API endpoint
  checkSessionEndpoint: '/api/session',        // Optional: session check endpoint
  headers: {                                   // Optional: custom headers
    'Content-Type': 'application/json'
  }
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PermissionsProvider config={config}>
      {children}
    </PermissionsProvider>
  );
}

// app/layout.tsx - Use the providers in your root layout
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 2. Create API Routes (Next.js)

Your API endpoints should return permissions in one of these formats:
```typescript
// Option 1: Object with permissions array
{
  permissions: ['admin', 'user', 'editor']
}

// Option 2: Direct array
['admin', 'user', 'editor']
```

```typescript
// app/api/permissions/route.ts
export async function GET() {
  // Your permission fetching logic
  return Response.json({
    permissions: ['admin', 'user', 'editor']
  });
}

// app/api/session/route.ts (optional)
export async function GET() {
  const isLoggedIn = true; // Your session check logic
  return new Response(null, {
    status: isLoggedIn ? 200 : 401
  });
}
```

## Usage

### 1. Protect Components

```tsx
'use client';

import { PermissionGuard } from 'react-permission-guard';

// Single permission
function AdminPanel() {
  return (
    <PermissionGuard 
      permission="admin"
      fallback={<div>Access Denied</div>}
      loadingFallback={<div>Loading...</div>}
    >
      <div>Admin Content</div>
    </PermissionGuard>
  );
}

// Multiple permissions
function SuperAdminPanel() {
  return (
    <PermissionGuard 
      permissions={['admin', 'super_admin']}
      fallback={<div>Access Denied</div>}
      loadingFallback={<div>Loading...</div>}
    >
      <div>Super Admin Content</div>
    </PermissionGuard>
  );
}
```

### 2. Protect Entire Pages

```tsx
'use client';

import { withPermission } from 'react-permission-guard';

// Your page component
function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Your dashboard content */}
    </div>
  );
}

// Custom fallback components (optional)
const CustomFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <h1>Access Denied</h1>
  </div>
);

const CustomLoading = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div>Loading...</div>
  </div>
);

// Protect the page
export default withPermission(AdminDashboard, {
  permission: 'admin',                    // Single permission
  // OR
  permissions: ['admin', 'super_admin'],  // Multiple permissions
  FallbackComponent: CustomFallback,      // Optional
  LoadingComponent: CustomLoading         // Optional
});
```

## API Reference

### PermissionsProvider

The root provider that manages permissions state. Must be placed at the root level of your application.

```typescript
interface PermissionConfig {
  getPermissionsEndpoint: string;      // API endpoint to fetch permissions
  checkSessionEndpoint?: string;       // Optional: endpoint to check session
  headers?: HeadersInit;               // Optional: custom headers for API calls
}
```

### PermissionGuard

Component-level protection.

```typescript
interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;                 // Single permission
  permissions?: string[];             // Multiple permissions
  fallback?: ReactNode;               // Component shown when unauthorized
  loadingFallback?: ReactNode;        // Component shown while loading
}
```

### withPermission

Higher-order component for page-level protection.

```typescript
interface WithPermissionOptions {
  permission?: string;                 // Single permission
  permissions?: string[];             // Multiple permissions
  FallbackComponent?: React.ComponentType;  // Custom unauthorized component
  LoadingComponent?: React.ComponentType;   // Custom loading component
}
```

## Best Practices

1. Always wrap your app with `PermissionsProvider` at the root level
2. Create a separate client component for providers in Next.js
3. Use `PermissionGuard` for component-level protection
4. Use `withPermission` for page-level protection
5. Implement proper API endpoints for permission management
6. Handle loading states appropriately
7. Provide meaningful fallback components
8. Keep permission checks as close to the protected content as possible

## Troubleshooting

### Common Issues

1. "usePermissions must be used within a PermissionsProvider"
   - Make sure your app is wrapped with `PermissionsProvider`
   - In Next.js, create a separate client component for providers
   - Check that the provider is above all components using permissions

2. "Failed to fetch permissions"
   - Verify your API endpoints are correct and accessible
   - Check network tab for API responses
   - Ensure proper CORS configuration if needed

3. Loading states not showing
   - Make sure to provide `loadingFallback` props
   - Check that your API endpoints have reasonable response times

## License

MIT 

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
