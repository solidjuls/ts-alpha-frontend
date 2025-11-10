import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Spinner } from '@radix-ui/themes';
import { useIsAuthenticated } from '../../hooks/useAuth';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: #e74c3c;
  margin-bottom: 16px;
`;

const ErrorMessage = styled.p`
  color: #666;
  margin-bottom: 24px;
`;

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: number; // Optional role requirement (1=SUPERADMIN, 2=ADMIN, 3=PLAYER)
  redirectTo?: string; // Where to redirect if not authenticated
  fallback?: ReactNode; // Custom fallback component
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login-new',
  fallback,
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

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
    return fallback || (
      <ErrorContainer>
        <ErrorTitle>Authentication Required</ErrorTitle>
        <ErrorMessage>You need to be logged in to access this page.</ErrorMessage>
      </ErrorContainer>
    );
  }

  // Check role requirement
  if (requiredRole && user && user.role > requiredRole) {
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
