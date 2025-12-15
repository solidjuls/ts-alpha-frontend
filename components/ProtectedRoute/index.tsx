import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Spinner } from '@radix-ui/themes';
import { useIsAuthenticated } from '../../hooks/useAuth';
import { LoadingContainer, ErrorContainer, ErrorTitle, ErrorMessage } from './ProtectedRoute.styled';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: number; // Optional role requirement (1=SUPERADMIN, 2=ADMIN, 3=PLAYER)
  redirectTo?: string; // Where to redirect if not authenticated
  fallback?: ReactNode; // Custom fallback component
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login',
  fallback,
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();
console.log("isAuthenticated", user, isAuthenticated);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      debugger
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);
debugger
  // Show loading state
  if (isLoading) {
    return fallback || (
      <LoadingContainer>
        <Spinner size="3" />
      </LoadingContainer>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    debugger
    return fallback || (
      <ErrorContainer>
        <ErrorTitle>Authentication Required</ErrorTitle>
        <ErrorMessage>You need to be logged in to access this page.</ErrorMessage>
      </ErrorContainer>
    );
  }

  // Check role requirement
  if (requiredRole && user && user.role > requiredRole) {
    debugger
    return fallback || (
      <ErrorContainer>
        <ErrorTitle>Access Denied</ErrorTitle>
        <ErrorMessage>You don`&apos;t have permission to access this page.</ErrorMessage>
      </ErrorContainer>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default ProtectedRoute;
