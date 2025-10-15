import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthProviderNew';
import { useLogout } from '../../hooks/useAuth';
import { Button } from 'components/Button';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const UserInfo = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
`;

const InfoRow = styled.div`
  margin-bottom: 10px;
  
  strong {
    color: #333;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
`;

const ProtectedContent: React.FC = () => {
  const { user } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleName = (role: number) => {
    switch (role) {
      case 1: return 'Super Admin';
      case 2: return 'Admin';
      case 3: return 'Player';
      default: return 'Unknown';
    }
  };

  return (
    <Container>
      <Title>Protected Demo Page</Title>
      
      <UserInfo>
        <h3>User Information</h3>
        <InfoRow>
          <strong>Name:</strong> {user?.name}
        </InfoRow>
        <InfoRow>
          <strong>Email:</strong> {user?.email}
        </InfoRow>
        <InfoRow>
          <strong>ID:</strong> {user?.id}
        </InfoRow>
        <InfoRow>
          <strong>Role:</strong> {getRoleName(user?.role || 3)} ({user?.role})
        </InfoRow>
        <InfoRow>
          <strong>Tournaments Admin:</strong> {user?.tournamentsAdmin?.length || 0}
        </InfoRow>
        <InfoRow>
          <strong>Tournaments Registered:</strong> {user?.tournamentsRegistered?.length || 0}
        </InfoRow>
      </UserInfo>

      <p>
        This is a protected page that can only be accessed by authenticated users.
        The ProtectedRoute component automatically redirects unauthenticated users
        to the login page.
      </p>

      <ButtonContainer>
        <Button 
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const ProtectedDemoPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Protected Demo - Twilight Struggle</title>
      </Head>
      
      <ProtectedRoute>
        <ProtectedContent />
      </ProtectedRoute>
    </>
  );
};

export default ProtectedDemoPage;
