# New Authentication System

This document describes the new authentication system built with React Query and styled-components, designed to replace the existing Stitches-based authentication.

## Overview

The new authentication system includes:
- **React Query** for state management and API calls
- **styled-components** for styling (replacing Stitches)
- **HTTP-only cookies** for secure token storage
- **NestJS backend** integration
- **TypeScript** for type safety

## Architecture

### 1. API Service (`services/auth.service.ts`)
Handles all authentication-related API calls to the NestJS backend:
- Login/Logout
- Profile management
- Password reset
- User creation (for testing)

### 2. React Query Hooks (`hooks/useAuth.ts`)
Provides hooks for authentication operations:
- `useLogin()` - Login mutation
- `useLogout()` - Logout mutation
- `useProfile()` - Get user profile
- `useIsAuthenticated()` - Check authentication status
- `useResetPasswordRequest()` - Password reset request
- `useCreateUser()` - Create user (testing)

### 3. Components
- **Login Page** (`pages/login-new/index.tsx`) - New login form with styled-components
- **Reset Password** (`pages/reset-password-new/index.tsx`) - Password reset form
- **ProtectedRoute** (`components/ProtectedRoute/index.tsx`) - Route protection component
- **AuthProviderNew** (`contexts/AuthProviderNew.tsx`) - Authentication context

## Usage

### Basic Login Page
```tsx
import LoginPage from '../pages/login-new';

// The login page handles everything automatically
export default LoginPage;
```

### Protected Routes
```tsx
import ProtectedRoute from '../components/ProtectedRoute';

const MyProtectedPage = () => (
  <ProtectedRoute requiredRole={2}> {/* Admin only */}
    <div>This content is only visible to admins</div>
  </ProtectedRoute>
);
```

### Using Authentication Hooks
```tsx
import { useIsAuthenticated, useLogin, useLogout } from '../hooks/useAuth';

const MyComponent = () => {
  const { isAuthenticated, user } = useIsAuthenticated();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={() => logoutMutation.mutate()}>
        Logout
      </button>
    </div>
  );
};
```

### Manual API Calls
```tsx
import authService from '../services/auth.service';

// Login
const loginResponse = await authService.login({
  mail: 'user@example.com',
  pwd: 'password123'
});

// Get profile
const profile = await authService.getProfile();

// Logout
await authService.logout();
```

## Configuration

### Environment Variables
The auth service connects to the NestJS backend at `http://localhost:4002/api`. Update the `baseURL` in `services/auth.service.ts` for different environments.

### React Query Setup
React Query is configured in `pages/_app.tsx` with:
- 5-minute stale time
- 1 retry on failure
- Automatic cache invalidation on logout

## Security Features

1. **HTTP-only Cookies**: JWT tokens are stored in HTTP-only cookies, preventing XSS attacks
2. **Automatic Token Refresh**: React Query handles token validation and refresh
3. **Role-based Access Control**: Support for SUPERADMIN (1), ADMIN (2), PLAYER (3) roles
4. **Tournament-specific Permissions**: Users can be admins of specific tournaments

## Migration from Old System

### 1. Replace Login Pages
- Old: `pages/login/index.tsx` (uses Stitches)
- New: `pages/login-new/index.tsx` (uses styled-components)

### 2. Replace Auth Context
- Old: `contexts/AuthProvider.tsx`
- New: `contexts/AuthProviderNew.tsx` + React Query hooks

### 3. Update Protected Routes
```tsx
// Old way
const { email } = useSession();
if (!email) return <div>Not authenticated</div>;

// New way
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

### 4. Update API Calls
```tsx
// Old way
const { login } = useSession();
await login(email, password);

// New way
const loginMutation = useLogin();
await loginMutation.mutateAsync({ mail: email, pwd: password });
```

## Testing

### Test User Creation
```tsx
import { useCreateUser } from '../hooks/useAuth';

const createTestUser = async () => {
  const createUserMutation = useCreateUser();
  await createUserMutation.mutateAsync({
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    role_id: 1 // SUPERADMIN
  });
};
```

### Demo Pages
- `/login-new` - New login page
- `/reset-password-new` - New password reset page
- `/protected-demo` - Example protected page

## Backend Requirements

The system requires the NestJS backend to be running on `http://localhost:4002` with the following endpoints:
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/profile`
- `POST /api/auth/reset-password-request`
- `POST /api/auth/create-user`

## Styling

The new system uses styled-components instead of Stitches:

```tsx
import styled from 'styled-components';

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;
```

## Error Handling

React Query provides automatic error handling:
- Network errors are automatically retried
- Error states are available in mutation objects
- Global error handling can be configured in QueryClient

## Performance

Benefits of the new system:
- **Automatic Caching**: React Query caches API responses
- **Background Updates**: Automatic background refetching
- **Optimistic Updates**: UI updates before API confirmation
- **Deduplication**: Multiple identical requests are deduplicated

## Next Steps

1. Test the new login page thoroughly
2. Migrate existing protected routes to use ProtectedRoute component
3. Update all authentication-related components
4. Remove old Stitches-based authentication code
5. Update environment configuration for production
